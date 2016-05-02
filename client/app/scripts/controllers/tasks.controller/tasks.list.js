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

angular.module('pomApp').controller('TasksListCtrl', TasksListCtrl);

function TasksListCtrl($scope, databaseService, $stateParams, utilsService) {

  var vm = this;

  vm.showAllTasks = showAllTasks;
  vm.deleteTask = deleteTask;


  function showAllTasks(){
    databaseService.getObjectById('projects',$stateParams.id)
      .success(function (data) {
        vm.tasks = data.taches;
      })
      .error(function (err) {
        console.error(err);
      });
  };

  function deleteTask(id) {
    databaseService.getObjectById('projects', $stateParams.id)
      .success(function (data) {

        var tasks = data.taches;
        var indexTaskToDelete = utilsService.arrayObjectIndexOf(tasks, id, "_id");

        if(indexTaskToDelete > -1) {
          tasks.splice(indexTaskToDelete, 1);
          vm.tasks.splice(indexTaskToDelete, 1 );
          databaseService.updateObject('projects',$stateParams.id,data).success(function (data) {});
        }
      })
      .error(function(err) {
        console.log(err);
      });
  };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    vm.showAllTasks();
  });

};

