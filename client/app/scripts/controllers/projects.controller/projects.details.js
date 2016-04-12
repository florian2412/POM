'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('ProjectsDetailsCtrl', function ($scope, $stateParams, projectsService) {

    //var id = $stateParams._id;
    //console.log($stateParams);
    $scope.getProjectById = function(id) {
      projectsService.getProjectById(id)
        .success(function (data) {
          $scope.project = data;
      })
    };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    $scope.getProjectById($stateParams.id);
  });
});
