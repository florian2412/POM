'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('ProjectsCtrl', function ($scope, $http, projectsService) {

    $scope.showAllProjects = function(){
        projectsService.getAllProjects()
            .success(function (data, status) {
                $scope.projects = data;
            })
            .error(function (err) {
                console.error("Error !");
                console.error(err);
            });
    }
   

    $scope.getProjectById = function(id){
        projectsService.getProjectById(id)
            .success(function (data, status) {
                console.log("Success !");
                console.log(data);
                $scope.projectDetail = data;
            })
            .error(function (err) {
                console.error("Error !");
                console.error(err);
            });
    };

    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
        $scope.showAllProjects();
    });
});

