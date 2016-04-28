/**
 * Created by sarra on 26/04/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('TasksCtrl', function ($scope, $location, $http, databaseService, $stateParams) {
    var idProject = $stateParams.id;

    // Affiche ou rafraichit toutes les taches dans le tableau de taches
    $scope.showAllTasks = function(){
      databaseService.getObjectById('projects',idProject)
        .success(function (data) {
          $scope.tasks = data.taches;
        })
        .error(function (err) {
          console.error(err);
        });
    };



    /*$scope.getCollaboratorById = function(id) {
     $scope.project.chef_projet = getObjectById('collaborators', id);
     };

     $scope.getProjectById = function(id){
     $scope.project.projectDetail = getObjectById('projects', id);
     };*/


    $scope.deleteTask = function(id) {
      databaseService.getObjectById('projects', idProject)
        .success(function (data) {
          console.log("ID TASK TO DELETE : " + id);
          var tasks = data.taches;
          console.log("DATA : " + tasks[0]._id);
          var indexTaskToDelete = arrayObjectIndexOf(tasks, id, "_id");
          console.log("INDEX : " + indexTaskToDelete);
          if(indexTaskToDelete > -1) {
            tasks.splice(indexTaskToDelete, 1);

            var dataToUpdate = {
              "taches":tasks
            };

            databaseService.updateObject('projects',idProject,dataToUpdate)
              .success(function (data) {
                console.log(data);
              })
              .error(function(err) {
                console.log(err);
              });

          }
          else {
            alert( "Something gone wrong" );
          }
        })
        .error(function(err) {
          console.log(err);
        });
    };


    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
      $scope.showAllTasks();

    });

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    }

  });

