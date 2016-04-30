'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsDetailsCtrl', function ($scope, $stateParams, $state, $mdDialog, authenticateService, databaseService, flashService, localStorageService, utilsService) {

  var currentUser = localStorageService.get('currentUser');
  var userIdToUpdate = $stateParams.id;

  $scope.getCollaboratorById = function(id) {
    databaseService.getObjectById('collaborators', id)
      .success(function (data) {
        $scope.collaborator = data;
      });
  };

  $scope.getAllRoles = function() {
    databaseService.getAllObjects('rolesCollaborator')
      .success(function (data) {
        // On récupère l'index du role d'admin pour le supprimer ensuite
        var indexToDelete = utilsService.arrayObjectIndexOf(data, 'admin', 'libelle_court');
        // On supprime le role admin de la liste des roles
        data.splice(indexToDelete, 1);
        $scope.roles = data;
      });
  };

  $scope.getCollaboratorsByRole = function(role) {
    databaseService.getCollaboratorsByRole(role)
      .success(function (data) {
        // TODO ENLEVER SOI MEME DE LA LISTE
        if(data.length > 0) {
          data.push(currentUser);

          var indexToDelete = utilsService.arrayObjectIndexOf(data, userIdToUpdate, '_id');

          data.splice(indexToDelete, 1);

          $scope.collaborators = data;
        }
        else {
          $scope.collaborators = [currentUser];
        }
      });
  };

  $scope.updateCollaborator = function() {

    var vm = this;
    var idCollaborator = vm.collaborator._id;

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

    databaseService.updateObject('collaborators', idCollaborator, data)
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
    $scope.getCollaboratorById($stateParams.id);
    $scope.fonctions = ["Développeur", "Architecte", "Directeur", "Chef de projet"]

    /*if(currentUser.role === 'admin') {
     $scope.getAllRoles();
     $scope.getCollaboratorsByRole('manager');
     } else {
     $scope.collaborator.manager = currentUser._id;
     $scope.collaborator.role = 'manager';
     }*/

    // Si on est admin
    if(currentUser.role === 'admin') {
      $scope.getAllRoles();
      $scope.getCollaboratorsByRole('manager');
    }
    // Si on est manager, on doit sélectionner automatiquement le role et le manager
    else {
      $scope.roles = ['collaborateur'];
      $scope.role = 'collaborateur';

      $scope.collaborators = [currentUser];
      $scope.collaborator = currentUser;

      $scope.collaborator.role = $scope.role;
      $scope.collaborator.manager = currentUser._id;
    }


    /*    $scope.getCollaboratorsByRole('manager');

     // Rôle proposé dans le combo du formulaire de création
     $scope.getAllRoles();*/
  });


  $scope.showCancelDialog = function(event) {
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

});
