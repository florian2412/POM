'use strict';

/**
 * @ngdoc service
 * @name pomApp.projectsService
 * @description
 * # projectsService
 * Service in the pomApp.
 */
angular.module('pomApp').factory('projectsService', function ($http) {
  return{
      getAllProjects: function(){
          return  $http({
            method: 'GET',
            url: 'http://localhost:3000/projects'
          });
      },

      getProjectById: function(id){
          return  $http({
            method: 'GET',
            url: 'http://localhost:3000/projects/' + id
          });
      },

      createProject: function(data){
        console.log(data);
        return  $http({
          method: 'POST',
          url: 'http://localhost:3000/projects/',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },

      deleteProject: function(id){
        console.log(id);
        return  $http({
          method: 'DELETE',
          url: 'http://localhost:3000/projects/' + id,
          headers: { 'Content-Type': 'application/json' }
        });
      }

    }
  });
