'use strict';

/**
 * @ngdoc service
 * @name pomApp.database
 * @description
 * # database
 * Service in the pomApp for database requests.
 */
angular.module('pomApp').factory('databaseService', function ($http) {

  return {

    getAllObjects: function(collection){
      return  $http({
        method: 'GET',
        url: 'http://localhost:3000/' + collection
      });
    },

    getObjectById: function(collection, id){
      return  $http({
        method: 'GET',
        url: 'http://localhost:3000/' + collection + '/' + id
      });
    },

    createObject: function(collection, data){
      console.log(collection);
      console.log(data);
      return  $http({
        method: 'POST',
        url: 'http://localhost:3000/' + collection + '/',
        data: data,
        headers: { 'Content-Type': 'application/json' }
      });
    },

    deleteObject: function(collection, id){
      console.log(collection);
      console.log(id);
      return  $http({
        method: 'DELETE',
        url: 'http://localhost:3000/' + collection + '/' + id,
        headers: { 'Content-Type': 'application/json' }
      });
    },

    updateObject: function(collection, id, data){
      console.log(collection);
      console.log(id);
      console.log(data);
      return  $http({
        method: 'PUT',
        url: 'http://localhost:3000/' + collection + '/' + id,
        data: data,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  }
});

