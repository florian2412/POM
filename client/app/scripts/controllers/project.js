'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('ProjectCtrl', function ($scope, $routeParams, projectsService) {

    var id = $routeParams._id;

    $scope.getProjectById = function() {
      projectsService.getProjectById(id)
        .success(function (data) {
          $scope.project = data;
      })
    };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    $scope.getProjectById();
  });

});
