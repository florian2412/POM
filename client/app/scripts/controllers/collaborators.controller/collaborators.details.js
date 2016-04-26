'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsDetailsCtrl', function ($scope, $stateParams, $state, $mdDialog, authenticateService, databaseService, flashService) {

  $scope.getCollaboratorById = function(id) {
    databaseService.getObjectById('collaborators', id)
      .success(function (data) {
        $scope.collaborator = data;
      });
  };

  $scope.getAllRoles = function() {
    databaseService.getAllObjects('rolesCollaborator')
      .success(function (data) {
        $scope.roles = data;
      });
  };

  $scope.getAllCollaborators = function() {
    databaseService.getAllObjects('collaborators')
      .success(function (data) {
        $scope.collaborators = data;
      });
  };

  $scope.getCollaboratorsByRole = function(role) {
    databaseService.getCollaboratorsByRole(role)
      .success(function (data) {
        $scope.collaborators = data;
      });
  };

  $scope.updateCollaborator = function() {

    var vm = this;

    var idCollaborator = vm.collaborator._id;

    var lastName = vm.collaborator.nom;
    var firstName = vm.collaborator.prenom;
    var manager = vm.collaborator.manager;
    var role = vm.collaborator.role;
    var login = vm.collaborator.pseudo;
    var cost = vm.collaborator.cout_horaire;
    var email = vm.collaborator.email;

    var data = {
      "nom": lastName,
      "prenom": firstName,
      "manager": manager,
      "pseudo": login,
      "cout_horaire" : cost,
      "role": role,
      "email" : email
    };

    console.log(data);

    databaseService.updateObject('collaborators', idCollaborator, data)
      .success(function (data) {
        console.log(data);
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

    /*
     if(authenticateService.getCurrentUser().role == 'manager')
     $scope.getCollaboratorsByRole('admin');
     else if(authenticateService.getCurrentUser().role == 'collaborator')
     $scope.getCollaboratorsByRole('manager');
     */

    $scope.getCollaboratorsByRole('manager');

    // Rôle proposé dans le combo du formulaire de création
    $scope.getAllRoles();
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
