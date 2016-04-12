'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('LoginCtrl', function ($scope, $location, $http, collaboratorsService){
  	
  	$scope.authenticate = function() {
  		var data = JSON.stringify({"pseudo":$scope.pseudo, "mot_de_passe":$scope.mot_de_passe});
	  	console.log(d);
	    collaboratorsService.authenticate(data)
	    	.success(function (data) {
	            $scope.message = "Connection successful";
	        })
	        .error(function (err) {
	            console.error("Error !");
	            console.error(err);
	    });
    };
  });
