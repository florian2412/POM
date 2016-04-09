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
          var dataJson = " { \"name\": " + "NOUVEAU PROJET" + "} ";

          return  $http({
            method: 'POST',
            url: 'http://localhost:3000/projects/',
            data: dataJson,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      }
    });
