'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectDetailsCtrl
 * @description
 * # ProjectDetailsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('ProjectsDetailsCtrl', ProjectsDetailsCtrl);

function ProjectsDetailsCtrl($rootScope, $scope, $stateParams, $mdSidenav, $mdDialog, $state, databaseService, flashService, utilsService) {

  $rootScope.$on('$stateChangeStart', function() {$mdSidenav('projectSideNav').close();});

  var collaborateursId = [];
  var vm = this;

  vm.getProjectById = getProjectById;
  vm.updateProject =  updateProject;
  vm.showCancelDialog = showCancelDialog;
  vm.showCollaboratorPicker = showCollaboratorPicker;
  vm.closeProject = closeProject;

  /**
   * Enregistre en base de données le projet actuel en "Terminé(e)" après avoir controller que toutes les tâches sont fermées ou annulées
   */
  function closeProject() {
    var projectTasks = vm.project.taches;
    var isValid = true;
    for(var i = 0; i < projectTasks.length; i++) {
      if(projectTasks[i].statut === 'En cours' || projectTasks[i].statut === 'Initial')
        isValid = false;
    }

    if(isValid) {
      var idProject = vm.project._id;
      var data;

      data = {
        "statut": 'Terminé(e)',
        "date_fin_reelle": new Date()
      };

      databaseService.updateObject('projects', idProject, data)
        .success(function (data) {
          flashService.success("Le projet " + vm.project.nom + " a bien été cloturé !", "", "bottom-right", true, 4);
          $state.go("projects");
        })
        .error(function (err) {
          console.log(err);
        });
    }
    else {
      showFinishTasksDialog();
    }

  }

  /**
   * Récupère un projet en fonction d'un id
   *
   * @param id
   */
  function getProjectById(id) {
    databaseService.getObjectById('projects', id)
      .success(function (data) {
        var collList = data.collaborateurs;

        for (var i = collList.length - 1; i >= 0; i--) {
          collaborateursId.push(collList[i]);
        }

        utilsService.convertDateStringsToDates(data);

        vm.project = data;
        vm.minDateProject =  new Date(data.date_debut);
        vm.numberOfCollaborators = collList.length;

        //durée du projet
        var date1 = new Date(data.date_debut);
        var date2 = new Date(data.date_fin_theorique);
        vm.dureeProject =  utilsService.dateDiff(date1,date2);

        var budgetId = data.ligne_budgetaire.id;
        var budgetsList = vm.budgets;
        var indexBudgetToSelect = utilsService.arrayObjectIndexOf(budgetsList, budgetId, "_id");

        vm.selectedBudget = budgetsList[indexBudgetToSelect];

        databaseService.getObjectById('collaborators', data.chef_projet)
          .success(function (data) {
            vm.chef_projet = data.prenom + ' ' + data.nom;
          });

      })
  }

  /**
   * Met à jour un projet en base
   */
  function updateProject() {

    var idProject = vm.project._id;

    var ligne_budgetaire_id = vm.selectedBudget._id;
    var ligne_budgetaire = {
      "id": ligne_budgetaire_id,
      "montant_restant": vm.selectedBudget.montant
    };

    var data;

    data = {
      "nom" : vm.project.nom,
      "statut" : vm.project.statut,
      "date_debut" : vm.project.date_debut,
      "date_fin_theorique" : vm.project.date_fin_theorique,
      "ligne_budgetaire" : ligne_budgetaire,
      "date_derniere_modif" : new Date(),
      "collaborateurs": collaborateursId,
      "description" : vm.project.description
    };

    databaseService.updateObject('projects', idProject, data)
      .success(function () {
        flashService.success("Le projet " + vm.project.nom + " a bien été mis à jour !", "", "bottom-right", true, 4);
        $state.go("projects");
      })
      .error(function (err) {
        console.log(err);
      });
  }

  /**
   * Affiche la boite de dialogue de d'erreur de fermeture projet lorsque toutes les tâches ne sont pas terminés ou annulées
   */
  function showFinishTasksDialog() {
    var alert = $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Alerte')
      .textContent('Vous devez finaliser toutes les tâches associées au projet avant de pouvoir le terminer.')
      .ariaLabel('Vérification dss tâches')
      .ok('Ok');

    $mdDialog.show(alert);
  }

  /**
   * Affiche la boite de dialogue de confirmation d'annulation
   */
  function showCancelDialog() {
    var confirm = $mdDialog.confirm()
      .title('Alerte')
      .textContent('Etes-vous sûr d\'annuler la modification du projet ?')
      .ariaLabel('Annulation')
      .ok('Oui')
      .cancel('Non');

    $mdDialog.show(confirm).then(function() {
        $state.go("projects");
      }, function() {}
    );
  }

  /**
   * Lancer au chargement de la page
   */
  $scope.$on('$viewContentLoaded', function() {

    databaseService.getAllObjects('budgets').success(function (data) { vm.budgets = data.data; });

    databaseService.getAllObjects('collaborators').success(function (data) { vm.collaborators = data;});

    databaseService.getSettings('statuts').success(function(data){
      //data.splice(data.indexOf("Archivé"),1);
      data.splice(data.indexOf("Initial"),1);
      data.splice(data.indexOf("Terminé(e)"),1);
      data.splice(data.indexOf("Archivé(e)"),1);
      vm.statuts = data;
    });

    vm.getProjectById($stateParams.id);

  });

  /**
   * affiche la boite de dialogue de sélection collaborateurs
   */
  function showCollaboratorPicker(ev) {
    $mdDialog.show({
      controller: _CollaboratorPickerController,
      templateUrl: 'views/shared/collaborators.picker.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false,
      locals: {
        collaborators: vm.collaborators
      }
    })
      .then(function(count) {
        console.log(count);
        //vm.numberOfCollaborators = count.length;
      });
  }

  /**
   * Controller de la boite de dialogue de sélection collaborateurs
   * @param $rootScope
   * @param $scope
   * @param $mdDialog
   * @param collaborators
   * @private
   */
  function _CollaboratorPickerController($rootScope, $scope, $mdDialog, collaborators) {

    $scope.collaborators = collaborators;
    $scope.selection = collaborateursId;
    $scope.hide = function() { $mdDialog.hide($scope.selection); };
    $scope.userRole = $rootScope.userRole;

    $scope.selectCollaborator = function (collaborator) {
      if(collaborateursId.indexOf(collaborator._id) < 0) {
        collaborateursId.push(collaborator._id);
        collaborator.checked = true;
      } else {
        collaborator.checked = false;
        var indexCol =  collaborateursId.indexOf(collaborator._id);
        if (indexCol > -1) { collaborateursId.splice(indexCol, 1); }
      }
    };
  }
}
