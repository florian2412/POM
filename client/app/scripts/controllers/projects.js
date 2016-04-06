'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('ProjectsCtrl', function ($scope, $http, projectsService) {



    /*$http.jsonp('http://localhost:3000/projects')
     .success(function (data) {
     $scope.projects = data;
     console.log(data);
     })
     .error(function (data, status) {
     console.log(status);
     console.log(error);
     console.log("Error occured");
     });
     */
    /*
     return $http.jsonp("http://localhost:3000/projects?callback=JSON_CALLBACK")
     .success(function (data) {
     console.log("Success !");
     console.log(data);
     //$scope.heading = data.posts; // response data
     })
     .error(function (data) {
     console.log("Error !");
     console.log(data);
     });

     */
/*
    projectsService.getAllProjects()
        .success(function (data) {
            console.log("Success !");
            console.log(data);
            //$scope.projects = data;
            // $scope.projectName = data[0].name;


        })
        .error(function (err) {
            console.log("Error !");
            console.log(err);
        });
*/

    $http({ method: 'GET', url: 'http://localhost:3000/projects' }).
    success(function (data, status, headers, config) {
        console.log("Success !");
        console.log(data[0]);
        console.log(status);
        $scope.name = data[0]._id;
    }).
    error(function (data, status, headers, config) {
        console.log("Error !");
        console.log(status);
    });

});
/*
angular.service('pomApp', function($http) {
    delete $http.defaults.headers.common['X-Requested-With'];

    this.getData = function(callbackFunc) {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/projects'
        }).success(function(data){
            // With the data succesfully returned, call our callback
            callbackFunc(data);

        }).error(function(){
            alert("error");
        });
    }
});
*/
