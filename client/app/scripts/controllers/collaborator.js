'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorCtrl
 * @description
 * # CollaboratorCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorCtrl', function ($scope, $routeParams, collaboratorsService) {

  var id = $routeParams._id;

  $scope.getCollaboratorById = function() {
    collaboratorsService.getCollaboratorById(id)
      .success(function (data) {
        $scope.collaborator = data;
      });
  };

 


  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    $scope.getCollaboratorById();
  });

});
