'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsDetailsCtrl', function ($scope, $stateParams, collaboratorsService) {

  $scope.getCollaboratorById = function(id) {
    collaboratorsService.getCollaboratorById(id)
      .success(function (data) {
        $scope.collaborator = data;
      });
  };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    $scope.getCollaboratorById($stateParams.id);
  });

});
