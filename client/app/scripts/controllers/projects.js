'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('ProjectsCtrl', function ($scope, $http, projectsService) {

    //var this.id;



    projectsService.getAllProjects()
        .success(function (data, status) {
            console.log("Success !");
            console.log(data[0]);
            console.log(status);
            $scope.id = data[0]._id;
        })
        .error(function (err) {
            console.error("Error !");
            console.error(err);
        });

    projectsService.getProjectById($scope.id)
        .success(function (data, status) {
            console.log("Success !");
            console.log(status);
            $scope.date = data[0].dateDebut;
        })
        .error(function (err) {
            console.error("Error !");
            console.error(err);
        });


});

