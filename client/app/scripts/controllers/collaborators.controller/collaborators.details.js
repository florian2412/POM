'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsDetailsCtrl', function ($scope, $stateParams, $state, $mdDialog, authenticateService, databaseService, FlashService) {

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

  /*
  function showSuccessDialog() {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Confirmation de modification')
        .textContent('Le collaborateur ' + $scope.collaborator.firstName + ' ' + $scope.collaborator.lastName + ' a bien été modifié !')
        .ariaLabel('Modification du collaborateur réussie')
        .ok('Ok'));
  };
*/
  
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
