'use strict';

/**
 * @ngdoc service
 * @name pomApp.projectsService
 * @description
 * # projectsService
 * Service in the pomApp.
 */
angular.module('pomApp')
    .factory('projectsService', function ($http) {
      return{
        getAllProjects: function(){
          return $http.jsonp("http://localhost:3000/projects?callback=JSON_CALLBACK");
        }
      }
    });