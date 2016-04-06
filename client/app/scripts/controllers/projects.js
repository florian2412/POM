'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('ProjectsCtrl', function ($scope, projectsService) {

    console.log("CONTROLLER");

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
    $http.jsonp('http://localhost:3000/projects')
        .success(function (data) {
            console.log(data);
            //$scope.heading = data.posts; // response data
    }).error(function (data) {
        console.log(data);
    });
*/


        projectsService.getAllProjects()
            .success(function(data){
            console.log(data);
            $scope.projects = data.results;

            })
            .error(function(err){
                console.log(err);
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