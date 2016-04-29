/**
 * Created by sarra on 27/04/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('TaskCtrl', function ($scope, $state, $stateParams, databaseService,  flashService, utilsService) {
    var idProject = $stateParams.id;
    var idTask = $stateParams.idtask;

    // Permet de lancer au chargement de la page : récupère les données de la tâche
    $scope.$on('$viewContentLoaded', function() {

      databaseService.getObjectById('projects', idProject)
        .success(function (data) {

          $scope.currentProject = data;
          $scope.minDateTask =  new Date(data.date_debut);

          var tasks = data.taches;

          var indexTaskToDisplay = utilsService.arrayObjectIndexOf(tasks, idTask, "_id");
          $scope.currentIndexTask = indexTaskToDisplay;

          var task = tasks[indexTaskToDisplay];
          //calcul du cout
          var date1 = new Date(task.date_debut);
          var date2 = new Date(task.date_fin_theorique);
          $scope.coutTask =  dateDiff(date1,date2);

          utilsService.convertDateStringsToDates(task);
          $scope.task = task;

        })
        .error(function (err) {
          console.log(err);
        });

    });
    //fonction de calcul de diff entre deux date
    function dateDiff(date1, date2){

      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays;
    }

    //modification de la tache
    $scope.updateTask = function() {

      var vm = this;

      var idTask = vm.task._id;

      var libelle = vm.task.libelle;
      var statut = vm.task.statut;
      var date_debut = vm.task.date_debut;
      var date_fin_theorique = vm.task.date_fin_theorique;
      var date_fin_reelle = vm.task.date_fin_reelle;
      var date_derniere_modif = new Date();

      updateTaskInProject();
      function updateTaskInProject(){
        var tasksList = $scope.currentProject.taches;
        var t = tasksList[$scope.currentIndexTask];
        t.libelle = libelle;
        t.statut = statut;
        t.date_debut  = date_debut;
        t.date_fin_theorique =date_fin_theorique;
        t.date_fin_reelle =date_fin_reelle;
        t.date_derniere_modif =date_derniere_modif;

      };

      databaseService.updateObject('projects', idProject, $scope.currentProject)
        .success(function (data) {
          console.log(data);

          flashService.Success("La tâche" + $scope.task.libelle + " a bien été mise à jour !", "", "bottom-right", true, 4);
          $state.go("projects.details.tasks");
        })
        .error(function (err) {
          console.log(err);
        });
    };

  });
