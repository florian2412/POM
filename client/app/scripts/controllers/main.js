'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, localStorageService, databaseService) {

    $scope.user = localStorageService.get('currentUser').pseudo;
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);

    databaseService.getProjectsCollaborator(idCurrentUser)
      .success(function (data) {
        console.log(data);
        $scope.projects = data;
        $scope.numberProjects = data.length;
      })
      .error(function (err) {
        console.log(err);
      });





  });
