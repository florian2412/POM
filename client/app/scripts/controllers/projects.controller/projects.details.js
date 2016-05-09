'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
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
  };


  function updateProject() {

    var idProject = vm.project._id;

    // TODO SAVE BUDGETS
    var ligne_budgetaire_id = vm.selectedBudget._id;
    var ligne_budgetaire = {
      "id": ligne_budgetaire_id,
      "montant_restant": vm.selectedBudget.montant
    };

    var data;

    // TODO Changer le status de 'Initial' à 'En cours' lorsqu'on affecte une date de début réelle


    data = {
      "nom" : vm.project.nom,
      "statut" : vm.project.statut,
      "date_debut" : vm.project.date_debut,
      "date_fin_theorique" : vm.project.date_fin_theorique,
      "date_fin_reelle" : vm.project.date_fin_reelle,
      "ligne_budgetaire" : ligne_budgetaire,
      "date_derniere_modif" : new Date(),
      "collaborateurs": collaborateursId,
      "date_debut_reelle" : vm.project.date_debut_reelle
    };




    databaseService.updateObject('projects', idProject, data)
      .success(function (data) {
        flashService.success("Le projet " + vm.project.nom + " a bien été mis à jour !", "", "bottom-right", true, 4);
        $state.go("projects");
      })
      .error(function (err) {
        console.log(err);
      });
  };

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
  };

  // Lancer au chargement de la page
  $scope.$on('$viewContentLoaded', function() {

    databaseService.getAllObjects('budgets').success(function (data) { vm.budgets = data.data; });

    databaseService.getAllObjects('collaborators').success(function (data) { vm.collaborators = data;});

    databaseService.getSettings('statuts').success(function(data){
      data.splice(data.indexOf("Archivé"),1);
      data.splice(data.indexOf("Initial"),1);
      vm.statuts = data;
    });

    vm.getProjectById($stateParams.id);

  });

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
  };


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
};
