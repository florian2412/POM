'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

ProjectsCreateCtrl.$inject = ['$scope', '$state', '$mdDialog', 'databaseService', 'flashService', 'authenticateService'];

angular.module('pomApp').controller('ProjectsCreateCtrl', ProjectsCreateCtrl);

function ProjectsCreateCtrl($scope, $state, $mdDialog, databaseService, flashService, authenticateService) {
    var vm = this;
    var collaborateursId = [];
    vm.minDate = new Date();

    vm.createProject = function() {

      if(!vm.project.startDate)
        vm.project.startDate = new Date();

      if(!vm.project.endDate)
        vm.project.endDate = new Date();

      var budget = JSON.parse(vm.project.ligne_budgetaire);

      var data = {
        "nom" : vm.project.name,
        "statut" : vm.project.statut,
        "chef_projet" : authenticateService.getCurrentUser()._id,
        "date_debut" : vm.project.startDate,
        "date_fin_theorique" : vm.project.endDate,
        "date_derniere_modif" : new Date(),
        "collaborateurs": collaborateursId,
        "ligne_budgetaire": {
            "id": budget._id,
            "montant_restant": budget.montant
        }
      };

      databaseService.createObject('projects', data)
        .success(function (data) {
          flashService.Success("Création du projet " + vm.project.name + " réussie.", "", "bottom-right", true, 4);
          $state.go("projects");
        })
        .error(function (err) {
          console.log(err);
        });
    };

    vm.selectCollaborator = function (collaborator) {
      if(!collaborator.checked) {
        collaborateursId.push(collaborator._id);
        collaborator.checked = true;
      } else {
        collaborator.checked = false;

        var indexCol = collaborateursId.indexOf(collaborator._id);
        if (indexCol > -1) {
          collaborateursId.splice(indexCol, 1);
        }
      }
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      databaseService.getAllObjects('budgets')
        .success(function (data) {
          vm.budgets = data;
        })
        .error(function (err) {
          console.log(err);
        });


      vm.statuts = ["Initial", "En cours", "Annulé", "Terminé"]

      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          vm.collaborators = data;
        })
        .error(function (err) {
          console.log(err);
        });

    });

    // Appelé depuis la view
    vm.showCancelDialog = function(event) {

      var confirm = $mdDialog.confirm()
        .title('Alerte')
        .textContent('Etes-vous sûr d\'annuler la création du projet ?')
        .ariaLabel('Annulation')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(function() {
        $state.go("projects");
      }, function() { });
    };

    vm.showAdvanced = function(ev) {

      $mdDialog.show({
        controller: CollaboratorPickerController,
        templateUrl: 'views/shared/collaborators.picker.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false,
        locals: {
           collaborators: vm.collaborators 
         },
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
   };

  function CollaboratorPickerController($scope, $mdDialog, collaborators) {

    $scope.collaborators = collaborators;
    $scope.selection = collaborateursId;
    $scope.hide = function() { $mdDialog.hide(); };
    $scope.cancel = function() { $mdDialog.cancel(); };
    $scope.answer = function(answer) { $mdDialog.hide(answer); };

    $scope.selectCollaborator = function (collaborator) {
      if(!collaborator.checked) {
        collaborateursId.push(collaborator._id);
        collaborator.checked = true;
      } else {
        collaborator.checked = false;
        var indexCol = collaborateursId.indexOf(collaborator._id);
        if (indexCol > -1) { collaborateursId.splice(indexCol, 1); }
      }
    };
    
  }
}
