'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp').controller('ProjectsCreateCtrl', ProjectsCreateCtrl);

function ProjectsCreateCtrl($scope, $state, $mdDialog, databaseService, flashService, localStorageService) {
    var vm = this;
    var collaborateursId = [];

    //vm.minDate = new Date();
    vm.createProject = createProject;
    vm.showCancelDialog = showCancelDialog;
    vm.showCollaboratorPicker = showCollaboratorPicker;
    
    function createProject() {

      if(!vm.project.startDate) vm.project.startDate = new Date();

      if(!vm.project.endDate) vm.project.endDate = new Date();

      var budget = JSON.parse(vm.project.ligne_budgetaire);

      var data = {
        "nom" : vm.project.name,
        "statut" : "Initial", // statut initial par défaut à la création
        "chef_projet" : localStorageService.get('currentUser')._id,
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
          flashService.success("Création du projet " + vm.project.name + " réussie.", "", "bottom-right", true, 4);
          $state.go("projects");
        })
        .error(function (err) {
          console.log(err);
        });
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      databaseService.getAllObjects('budgets').success(function (data){ vm.budgets = data.data;})
        .error(function (err) { console.log(err); });

      databaseService.getAllObjects('collaborators').success(function(data){ vm.collaborators = data;})
        .error(function (err) { console.log(err); });

    });

    function showCancelDialog(event) {

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
        },
      })
      .then(function(count) {
        vm.numberOfCollaborators = count.length;
      });
   };

  function _CollaboratorPickerController($rootScope, $scope, $mdDialog, $state, collaborators) {

    $scope.collaborators = collaborators;
    $scope.selection = collaborateursId;
    $scope.hide = function() { $mdDialog.hide($scope.selection); };
    $scope.userRole = $rootScope.userRole;


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
