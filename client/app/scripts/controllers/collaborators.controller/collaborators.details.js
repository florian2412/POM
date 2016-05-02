'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsDetailsCtrl',CollaboratorsDetailsCtrl);

function CollaboratorsDetailsCtrl($scope, $stateParams, $state, $mdDialog, databaseService, flashService, localStorageService, utilsService) {

  var vm = this;
  var currentUser = localStorageService.get('currentUser');
  
  vm.updateCollaborator = updateCollaborator;
  vm.showCancelDialog = showCancelDialog;


  function updateCollaborator() {

    var data = {
      "nom": vm.collaborator.nom,
      "prenom":  vm.collaborator.prenom,
      "manager": vm.collaborator.manager,
      "fonction": vm.collaborator.fonction,
      "pseudo": vm.collaborator.pseudo,
      "cout_horaire" : vm.collaborator.cout_horaire,
      "role": vm.collaborator.role,
      "email" : vm.collaborator.email
    };

    databaseService.updateObject('collaborators', vm.collaborator._id, data)
      .success(function (data) {
        flashService.Success("Le collaborateur " + vm.collaborator.prenom + " " + vm.collaborator.nom + " a bien été mis à jour !", "", "bottom-right", true, 4);
        $state.go("collaborators");
      })
      .error(function (err) {
        console.log(err);
      });
  };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    
    databaseService.getObjectById('collaborators', $stateParams.id).success(function (data) {
      vm.collaborator = data;
    });

    databaseService.getSettings('fonctions').success(function(data){ vm.fonctions = data; });
      
      // Si on est admin
    if(currentUser.role === 'admin') {
      
      databaseService.getSettings('roles')
      .success(function(data){ 
        var i = data.indexOf('admin');
        data.splice(i, 1);
        for (var i = data.length - 1; i >= 0; i--) {
          data[i] = utilsService.capitalize(data[i]);
        }
        vm.roles = data;
      });

      databaseService.getCollaboratorsByRole('manager')
      .success(function (data) {
        if(data.length > 0) {
          data.push(currentUser);
          var indexToDelete = utilsService.arrayObjectIndexOf(data, $stateParams.id, '_id');
          data.splice(indexToDelete, 1);
          vm.managers = data;
        } else { vm.managers = [currentUser]; }
      });

    }
    // Si on est manager, on doit sélectionner automatiquement le role et le manager
    else {
      vm.roles = ['collaborateur'];
      vm.managers = [currentUser];
      vm.collaborator = currentUser;
      vm.collaborator.n_role = 'collaborateur';
      vm.collaborator.n_manager = currentUser._id;
    }

  });


  function showCancelDialog(event) {
    var confirm = $mdDialog.confirm()
      .title('Alerte')
      .textContent('Etes-vous sûr d\'annuler la modification du collaborateur ?')
      .ariaLabel('Annulation')
      .targetEvent(event)
      .ok('Oui')
      .cancel('Non');
    $mdDialog.show(confirm).then(function() {
      $state.go("collaborators");
    }, function() {
    });
  };

};
