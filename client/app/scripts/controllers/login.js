'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('LoginCtrl', function ($scope, $alert, $location, $state, $http, $rootScope, authenticateService, FlashService){
	$scope.authenticate = function() {
  		if($scope.pseudo && $scope.mot_de_passe){
	    authenticateService.authenticate(JSON.stringify({"pseudo":$scope.pseudo, "mot_de_passe":$scope.mot_de_passe}),
	    	function(response){
	    		if(response.success){
	    			$rootScope.$broadcast("LoginSuccess", "isConnected");
	    			$state.go('/');
	    		}
	    		else
	    		{
	    			$rootScope.$broadcast("LoginFailed", "isNotConnected");
					FlashService.Error("Erreur ! ", "Pseudo ou mot de passe incorrect", "top-right", "true", 4);
	    		}
	    	});
		}else
		{
			FlashService.Error('Erreur ! ', 'Pseudo ou mot de passe incorrect', 'top-right', true, 4);
		}
  };
  $scope.$on('$viewContentLoaded', function() {
    if (authenticateService.getCurrentUser() !== null) {
     	FlashService.Success("Déconnexion réussie ! ", "A bientôt ! ", "top-right", true, 4);
      	authenticateService.clearCredentials();
      	$rootScope.$broadcast("LogoutSuccess", "isDisconnected");		
    }
  });
})
