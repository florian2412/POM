'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('LoginCtrl', function ($scope, $location, $state, $http, $rootScope, authenticateService, FlashService){
  	
	$scope.authenticate = function() {
  		if($scope.pseudo && $scope.mot_de_passe){
	    authenticateService.authenticate(JSON.stringify({"pseudo":$scope.pseudo, "mot_de_passe":$scope.mot_de_passe}),
	    	function(response){
	    		if(response.success){
	    			$rootScope.$broadcast("LoginSuccess", "isConnected");
	    			//$location.path('main');
	    			$state.go('/');
	    		}
	    		else
	    		{
	    			$rootScope.$broadcast("LoginFailed", "isNotConnected");
	    			FlashService.Error('Pseudo ou mot de pase incorrect');
	    		}
	    	});
		}else
		{
			FlashService.Error('Pseudo ou mot de pase incorrect');
		}
  };
  $scope.$on('$viewContentLoaded', function() {
    if (authenticateService.getCurrentUser() !== null) {
      console.log("Logout successful");
      authenticateService.clearCredentials();
      $rootScope.$broadcast("LogoutSuccess", "isDisconnected");
    }
  });
})
