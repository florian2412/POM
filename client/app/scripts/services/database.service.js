'use strict';

  /**
   * @ngdoc service
   * @name pomApp.database
   * @description
   * # database
   * Service in the pomApp for database requests.
   */
angular.module('pomApp').factory('databaseService', Service);

function Service($http) {
  var service = {};

  service.getAllObjects = getAllObjects;
  service.getObjectById = getObjectById;
  service.createObject = createObject;
  service.deleteObject = deleteObject;
  service.updateObject = updateObject;
  service.getCollaboratorsByRole = getCollaboratorsByRole;

  return service;

  function getAllObjects(collection){
    console.log(collection);
    return  $http({
            method: 'GET',
            url: 'http://localhost:3000/' + collection
            });
  }

  function getObjectById(collection, id){
    /*console.log(collection);
    console.log(id);*/
    return  $http({
            method: 'GET',
            url: 'http://localhost:3000/' + collection + '/' + id
            });
  }

  function createObject(collection, data){
    console.log(collection);
    console.log(data);
    return  $http({
            method: 'POST',
            url: 'http://localhost:3000/' + collection + '/',
            data: data,
            headers: { 'Content-Type': 'application/json' }
    });
  }

  function deleteObject(collection, id){
    console.log(collection);
    console.log(id);
    return  $http({
            method: 'DELETE',
            url: 'http://localhost:3000/' + collection + '/' + id,
            headers: { 'Content-Type': 'application/json' }
    });
  }

  function updateObject(collection, id, data){
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

  // Resources Collaborators
  function getCollaboratorsByRole(role){
    console.log(role);
    return  $http({
            method: 'GET',
            url: 'http://localhost:3000/collaborators/role/' + role
            });
  }
}

