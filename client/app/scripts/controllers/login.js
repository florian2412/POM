'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pomApp
 */

LoginCtrl.$inject = ['$scope', '$alert', '$location', '$state', '$mdDialog', '$rootScope', 'authenticateService', 'flashService', 'AuthService'];

angular.module('pomApp').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $alert, $location, $state, $mdDialog, $rootScope, authenticateService, flashService, AuthService){
	
  var vm = this;

  vm.authenticate = authenticate;
  vm.showPrompt = showPrompt;

  function authenticate() {
  		if(vm.pseudo && vm.mot_de_passe){
	    authenticateService.authenticate(JSON.stringify({"pseudo":vm.pseudo, "mot_de_passe":vm.mot_de_passe}),
	    	function(response){
	    		if(response.success){
	    			AuthService.setRole(authenticateService.getCurrentUser().role);
	    			$state.go('/');
	    		}
	    		else
	    		{
	    			$rootScope.$broadcast("LoginFailed", "isNotConnected");
            flashService.Error("Erreur ! ", "Pseudo ou mot de passe incorrect", "bottom-right", "true", 4);
	    		}
	    	});
		}
		else
		{
			flashService.Error('Erreur ! ', 'Pseudo ou mot de passe incorrect', 'bottom-right', true, 4);
		}
  };
  $scope.$on('$viewContentLoaded', function() {

  	// Si un utilisateur déjà connecté redemande la page de login, alors il est automatiquement déconnecté
    if (authenticateService.getCurrentUser() !== null) {
      flashService.Success("Déconnexion réussie ! ", "A bientôt ! ", "bottom-right", true, 4);
    	AuthService.setRole("public");
      	authenticateService.clearCredentials();
   	}
  });

  var resetPassword = function (pseudo){
  	if(pseudo){
	    authenticateService.resetPassword(JSON.stringify({"pseudo":pseudo}),
	    	function(response){
	    		if(response.success){
            flashService.Success("Envoi réussi ! ", response.message, "bottom-right", "true", 4);
	    		}else{ flashService.Error("Erreur ! ", response.message, "bottom-right", "true", 4);}
	    	});
		} else {flashService.Error('Erreur ! ', 'Veuillez entrer votre pseudo', 'bottom-right', true, 4);}
  }

  function showPrompt(ev) {
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

}
