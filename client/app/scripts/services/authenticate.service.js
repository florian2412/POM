'use strict';

/**
 * @ngdoc service
 * @name pomApp.authenticate.service
 * @description
 * # collaboratorsService
 * Service in the pomApp.
 */
angular.module('pomApp').factory('authenticateService', function ($http, $rootScope) {
    var service = {};

    service.authenticate = Authenticate;
    service.setCredentials = SetCredentials;
    service.clearCredentials = ClearCredentials;
    service.getCurrentUser = GetCurrentUser;
    service.logout = Logout;

    return service;

    function Authenticate(data,callback){
      var response;
    	var res = $http({ method: 'POST',
						            data: data,
            			      headers: { 'Content-Type': 'application/json' },
    					          url: 'http://localhost:3000/collaborators/authenticate'});

      res.success(function (r) {
        if(r.success){
          SetCredentials(r.collaborator);
          response = { "success" : r.success, "message" : r.message };
        }
        response = { "success" : r.success, "message" : "Pseudo ou mot de passe incorrect" };
        callback(response);
      })
      .error(function (err) {
        console.error("Login error !" + err);
      });
    }

    function GetCurrentUser(){
      if ($rootScope.currentUser == null || $rootScope.currentUser == {} )
        return null;
      return $rootScope.currentUser;
    }

    function SetCredentials(collaborator) { $rootScope.currentUser = collaborator;}

    function ClearCredentials() { $rootScope.currentUser = null; }

    function Logout() { ClearCredentials(); }
});
