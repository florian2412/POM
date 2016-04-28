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
  .controller('TaskCtrl', function ($scope, $state, databaseService, $stateParams, flashService) {
    var idProject = $stateParams.id;
    var idTask = $stateParams.idtask;


    /*$scope.updateTask = function(idTask) {
      databaseService.getObjectById('projects', idProject)
        .success(function (data) {
          console.log("ID TASK TO DISPLAY : " + idTask);
          var tasks = data.taches;
          convertDateStringsToDates(data);
          //console.log("DATA : " + tasks[0]._id);

          var indexTaskToDisplay = arrayObjectIndexOf(tasks, idTask, "_id");

           var task = tasks[indexTaskToDisplay]


          console.log("INDEX : " + indexTaskToDisplay);
        })
        .error(function(err) {
          console.log(err);
        });
    };*/


    // Permet de lancer au chargement de la page : récupère les données de la tâche
    $scope.$on('$viewContentLoaded', function() {

      databaseService.getObjectById('projects', idProject)
        .success(function (data) {
          console.log(data);
          $scope.currentProject = data;

          var tasks = data.taches;

          //console.log("DATA : " + tasks[0]._id);

          var indexTaskToDisplay = arrayObjectIndexOf(tasks, idTask, "_id");
          $scope.currentIndexTask = indexTaskToDisplay;

          var task = tasks[indexTaskToDisplay]

          console.log("INDEX : " + indexTaskToDisplay);
          var d1 = task.date_debut;
          var d2 = task.date_fin_theorique;

          var d3 = dateDiff(d1, d2);
          $scope.cout =d3.day ;

          convertDateStringsToDates(task);
          $scope.task = task;
          console.log(task);

        })
          .error(function (err) {
            console.log(err);
      });

    });


    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    }



    var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    function convertDateStringsToDates(input) {
      // Ignore things that aren't objects.
      if (typeof input !== "object") return input;

      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
          // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === "object") {
          // Recurse into object
          convertDateStringsToDates(value);
        }
      }
    };


    //calcul du cout d'une tâche

    function dateDiff(date1, date2){
      var diff = {};                          // Initialisation du retour
      var tmp = date2 - date1;

      tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
      diff.day = tmp;
      console.log(diff);
      return diff;
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
