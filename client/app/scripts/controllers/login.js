'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('LoginCtrl', function ($scope, $alert, $location, $state, $rootScope, authenticateService, FlashService, AuthService){
	$scope.authenticate = function() {
  		if($scope.pseudo && $scope.mot_de_passe){
	    authenticateService.authenticate(JSON.stringify({"pseudo":$scope.pseudo, "mot_de_passe":$scope.mot_de_passe}),
	    	function(response){
	    		if(response.success){
	    			//$rootScope.$broadcast("LoginSuccess", "isConnected");
				    AuthService.getRole = function(){
				      return authenticateService.getCurrentUser().role ;
				    };
	    			$state.go('/');
	    		}
	    		else
	    		{
	    			$rootScope.$broadcast("LoginFailed", "isNotConnected");
					FlashService.Error("Erreur ! ", "Pseudo ou mot de passe incorrect", "bottom-right", "true", 4);
	    		}
	    	});
		}else
		{
			FlashService.Error('Erreur ! ', 'Pseudo ou mot de passe incorrect', 'bottom-right', true, 4);
		//	AuthService.setRole("public");
		}
  };
  $scope.$on('$viewContentLoaded', function() {

  	// Si un utilisateur déjà connecté redemande la page de login, alors il est automatiquement déconnecté
    if (authenticateService.getCurrentUser() !== null) {
     	FlashService.Success("Déconnexion réussie ! ", "A bientôt ! ", "bottom-right", true, 4);
      	/*AuthService.getRole = function(){
      		return "public";
    	};*/
    	AuthService.setRole("public");
      	authenticateService.clearCredentials();

      	//$rootScope.$broadcast("LogoutSuccess", "isDisconnected");		
    }
  });
})
