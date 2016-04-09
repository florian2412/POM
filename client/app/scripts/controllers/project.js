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

    projectsService.getProjectById(id)
        .success(function(data){
            $scope.project = data;
    })

});
