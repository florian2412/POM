'use strict';

/**
 * @ngdoc service
 * @name pomApp.collaboratorsService
 * @description
 * # collaboratorsService
 * Service in the pomApp.
 */
angular.module('pomApp').factory('collaboratorsService', function ($http) {

  return{

    getAllCollaborators: function(){
     	return  $http({ method: 'GET', url: 'http://localhost:3000/collaborators' });
    },

    getCollaboratorById: function(id){
     	return  $http({ method: 'GET', url: 'http://localhost:3000/collaborators/' + id});
    },

    createCollaborator: function(data){
      console.log(data);
      return  $http({
        method: 'POST',
        url: 'http://localhost:3000/collaborators/',
        data: data,
        headers: { 'Content-Type': 'application/json' }
      });
    },

    deleteCollaborator: function(id){
      console.log(id);
      return  $http({
        method: 'DELETE',
        url: 'http://localhost:3000/collaborators/' + id,
        headers: { 'Content-Type': 'application/json' }
      });
    },

    authenticate: function(data){
    	return  $http({
        method: 'POST',
				data: data,
        headers: { 'Content-Type': 'application/json' },
    		url: 'http://localhost:3000/collaborators/authenticate'});
    }
  }
});
