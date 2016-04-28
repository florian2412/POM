'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('ProjectsCtrl', function ($scope, $location, $http, databaseService) {

    // Affiche ou rafraichit tous les projets dans le tableau des projets
    $scope.showAllProjects = function(){
      databaseService.getAllObjects('projects')
          .success(function (data) {
          $scope.projects = data;
        })
          .error(function (err) {
              console.error(err);
          });
    };

    var getObjectById = function(collection, id) {
      databaseService.getObjectById(collection, id)
        .success(function (data) {
          return data;
        })
        .error(function (err) {
          return err;
        });
    };

    $scope.getCollaboratorById = function(id) {
      $scope.project.chef_projet = getObjectById('collaborators', id);
    };

    $scope.getProjectById = function(id){
      $scope.project.projectDetail = getObjectById('projects', id);
    };


    $scope.deleteProject = function(id) {
      databaseService.deleteObject('projects', id)
        .success(function (data) {
          // Update liste projets
          var index = -1;
          var comArr = eval( $scope.projects );
          for( var i = 0; i < comArr.length; i++ ) {
            if( comArr[i]._id === id ) {
              index = i;
              break;
            }
          }

          //var index2 = $scope.projects._id.indexOf(id);

          if( index === -1 ) {
            alert( "Something gone wrong" );
          }
          $scope.projects.splice( index, 1 );
        })
        .error(function(err) {
          console.log(err);
        });
    };


    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
        $scope.showAllProjects();

    });


});

