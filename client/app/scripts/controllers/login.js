'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('LoginCtrl', function ($scope, $alert, $location, $state, $mdDialog, $rootScope, authenticateService, FlashService, AuthService){
	$scope.authenticate = function() {
  		if($scope.pseudo && $scope.mot_de_passe){
	    authenticateService.authenticate(JSON.stringify({"pseudo":$scope.pseudo, "mot_de_passe":$scope.mot_de_passe}),
	    	function(response){
	    		if(response.success){
	    			AuthService.setRole(authenticateService.getCurrentUser().role);
	    			$state.go('/');
	    		}
	    		else
	    		{
	    			$rootScope.$broadcast("LoginFailed", "isNotConnected");
					FlashService.Error("Erreur ! ", "Pseudo ou mot de passe incorrect", "bottom-right", "true", 4);
	    		}
	    	});
		}
		else
		{
			FlashService.Error('Erreur ! ', 'Pseudo ou mot de passe incorrect', 'bottom-right', true, 4);
		}
  };
  $scope.$on('$viewContentLoaded', function() {

  	// Si un utilisateur déjà connecté redemande la page de login, alors il est automatiquement déconnecté
    if (authenticateService.getCurrentUser() !== null) {
     	FlashService.Success("Déconnexion réussie ! ", "A bientôt ! ", "bottom-right", true, 4);
    	AuthService.setRole("public");
      	authenticateService.clearCredentials();
   	}
  });

  var resetPassword = function (pseudo){
  	if(pseudo){
	    authenticateService.resetPassword(JSON.stringify({"pseudo":pseudo}),
	    	function(response){
	    		if(response.success){
	    			FlashService.Success("Envoi réussi ! ", response.message, "bottom-right", "true", 4);
	    		}else{ FlashService.Error("Erreur ! ", response.message, "bottom-right", "true", 4);}
	    	});
		} else {FlashService.Error('Erreur ! ', 'Veuillez entrer votre pseudo', 'bottom-right', true, 4);}
  }
  $scope.showPrompt = function(ev) {
    var confirm = $mdDialog.prompt()
          .title('Réinitialisation de votre mot de passe')
          .textContent('Entrer votre pseudo : ')
          .placeholder('pseudo')
          .ariaLabel('Pseudo')
          .targetEvent(ev)
          .ok('Réinitialiser')
          .cancel('Annuler');
    $mdDialog.show(confirm).then(function(result) {
    	resetPassword(result);
    }, function() {});
  };

})
