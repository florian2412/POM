'use strict';

/**
 * @ngdoc service
 * @name pomApp.database
 * @description
 * # database
 * Service in the pomApp for database requests.
 */
angular.module('pomApp').factory('databaseService', Service);

/**
 * Méthode API POM
 * Service de requêtes vers la base de donnée MongoDB de POM
 *
 * @param $http
 * @returns {{}}
 * @constructor
 */
function Service($http) {
  var service = {};

  service.getAllObjects = getAllObjects;
  service.getObjectById = getObjectById;
  service.createObject = createObject;
  service.deleteObject = deleteObject;
  service.updateObject = updateObject;
  service.getCollaboratorsByRole = getCollaboratorsByRole;
  service.getCollaboratorProjects = getCollaboratorProjects;
  service.getSettings = getSettings;

  return service;

  /**
   * Récupère tous les objets d'une collection en base de données
   *
   * @param collection
   * @returns {*}
   */
  function getAllObjects(collection){
    return  $http({
      method: 'GET',
      url: 'http://localhost:3000/' + collection
    });
  }

  /**
   * Récupère un objet d'une collection selon un id passée en paramètre de la requête
   *
   * @param collection
   * @param id
   * @returns {*}
   */
  function getObjectById(collection, id){
    return  $http({
      method: 'GET',
      url: 'http://localhost:3000/' + collection + '/' + id
    });
  }

  /**
   * Insère un objet dans une collection en base
   * L'objet est passé en paramètre dans le body de la requête et doit être au format JSON
   *
   * @param collection
   * @param data
   * @returns {*}
   */
  function createObject(collection, data){
    return  $http({
      method: 'POST',
      url: 'http://localhost:3000/' + collection + '/',
      data: data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Supprime un objet d'une collection en base selon un id
   *
   * @param collection
   * @param id
   * @returns {*}
   */
  function deleteObject(collection, id){
    return  $http({
      method: 'DELETE',
      url: 'http://localhost:3000/' + collection + '/' + id,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Met à jour un objet déjà présent en base
   * L'objet est passé en paramètre dans le body de la requête et doit être au format JSON
   *
   * @param collection
   * @param id
   * @param data
   * @returns {*}
   */
  function updateObject(collection, id, data){
    return  $http({
      method: 'PUT',
      url: 'http://localhost:3000/' + collection + '/' + id,
      data: data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Récupère tous les collaborateurs selon un role (admin, manager ou collaborateur)
   *
   * @param role
   * @returns {*}
   */
  function getCollaboratorsByRole(role){
    return  $http({
      method: 'GET',
      url: 'http://localhost:3000/collaborators/role/' + role
    });
  }

  /**
   * Récupère tous les projets d'un collaborateur selon un id de collaborateur
   *
   * @param id
   * @returns {*}
   */
  function getCollaboratorProjects(id){
    return  $http({
      method: 'GET',
      url: 'http://localhost:3000/collaborators/' + id + '/projects'
    });
  }

  /**
   * Récupère une donnée de paramètres en base
   *
   * @param setting
   * @returns {*}
   */
  function getSettings(setting){
    return  $http({
      method: 'GET',
      url: 'http://localhost:3000/settings/' + setting
    });
  }

}

