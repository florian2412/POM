'use strict';

/**
 * @ngdoc service
 * @name pomApp.authenticate.service
 * @description
 * # collaboratorsService
 * Service in the pomApp.
 */
angular.module('pomApp').factory('authenticateService', Service);
    
function Service($http, $rootScope, localStorageService){
  var service = {};

  service.authenticate = Authenticate;
  service.setCredentials = SetCredentials;
  service.clearCredentials = ClearCredentials;
  service.getCurrentUser = GetCurrentUser;
  service.logout = Logout;
  service.resetPassword = ResetPassword;

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
      } else { response = { "success" : r.success, "message" : "Pseudo ou mot de passe incorrect" }; }

      callback(response);
    })
    .error(function (err) {
      console.error("Login error !" + err);
    });
  }

  function GetCurrentUser(){ return localStorageService.get('currentUser');}

  function SetCredentials(collaborator) { 
    localStorageService.set('currentUser',collaborator);
    $rootScope.isAuthenticated = collaborator;
    $rootScope.userFirstname = collaborator.prenom;
    $rootScope.userLastname = collaborator.nom;
    $rootScope.userRole = collaborator.role;
  }

  function ClearCredentials() { 
    localStorageService.remove('currentUser'); 
    $rootScope.isAuthenticated = null;
    delete $rootScope.userFirstname;
    delete $rootScope.userLastname;
    delete $rootScope.userRole;
  }

  function Logout() { ClearCredentials(); }

  function ResetPassword(pseudo,callback) {
    var response;
    var res = $http({ method: 'POST',
                      data: pseudo,
                      headers: { 'Content-Type': 'application/json' },
                      url: 'http://localhost:3000/collaborators/resetPassword'});
    res.success(function (r) {
      response = { "success" : r.success, "message" : r.message };
      callback(response);
    })
    .error(function (err) {
      console.error("Reset password failed : " + err);
    });
  }
};