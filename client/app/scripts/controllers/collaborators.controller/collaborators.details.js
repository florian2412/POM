'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsDetailsCtrl', function ($scope, $stateParams, $state, $mdDialog, databaseService) {

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

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {

    // Rôle proposé dans le combo du formulaire de création
    $scope.getAllRoles();

    $scope.getCollaboratorById($stateParams.id);

    $scope.getAllCollaborators();
  });

});
