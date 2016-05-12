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

function TasksListCtrl($scope, $state, databaseService, flashService, $stateParams, utilsService, NgTableParams) {

  var vm = this;

  vm.showAllTasks = showAllTasks;
  vm.deleteTask = deleteTask;
  vm.redirectTasksDetails = redirectTasksDetails;
  vm.isFiltersEnabled = false;

  var statuts = {"initial": { "color": "blue", "class": "fa fa-info", "statut": "Initial" },
               "en_cours": { "color": "orange", "class": "fa fa-cog fa-spin fa-fw margin-bottom", "statut":"En cours" },
               "termine": { "color": "green", "class": "fa fa-check-circle","statut": "Terminé(e)" },
               "annule": { "color": "red", "class": "fa fa-times-circle", "statut": "Annulé(e)" },
               "archive": { "color": "gray", "class": "fa fa-file-archive-o", "statut": "Archivé" }
             };

  function redirectTasksDetails(event,id){
    $state.go('projects.details.tasks.details',{"idtask":id});
  }

  function showAllTasks(){
    databaseService.getObjectById('projects', $stateParams.id)
      .success(function (data) {
        vm.tasks = data.taches;
        for (var i = data.taches.length - 1; i >= 0; i--) {
          switch (data.taches[i].statut)
          {
            case 'Initial': data.taches[i].statut = statuts.initial;
            break;
            case 'En cours': data.taches[i].statut = statuts.en_cours;
            break;
            case 'Terminé(e)': data.taches[i].statut = statuts.termine;
            break;
            case 'Annulé(e)': data.taches[i].statut = statuts.annule;
            break;
            case 'Archivé': data.taches[i].statut = statuts.archive;
            break;
          }
        }

        vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: data.taches });

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

          vm.tableParams.reload().then(function(data) {
              if (data.length === 0 && vm.tableParams.total() > 0) {
              vm.tableParams.page(vm.tableParams.page() - 1);
              vm.tableParams.reload();
            }
          });
          flashService.success("Succès ! ", "La tâche a été supprimée", "bottom-right", true, 4);
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

