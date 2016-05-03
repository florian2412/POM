'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, localStorageService, databaseService, utilsService) {

    var vm = this;
    var currentUser = localStorageService.get('currentUser');

    $scope.user = localStorageService.get('currentUser').pseudo;
    var idCurrentUser = localStorageService.get('currentUser')._id;

    databaseService.getProjectsCollaborator(idCurrentUser)
      .success(function (data) {
        console.log(data);

        var projects = data;
        var numberProjet = projects.length;

        vm.projects = projects;
        vm.numberProjects = numberProjet;

        var tasksCollaborator = [];
        //var taskID_projectID = { taskID : "", projectID :""};

        for(var i = 0; i < projects.length; i++) {
          // On calcule la durée du projet
          projects[i].duration = utilsService.calculProjectDuration(projects[i]);
          projects[i].leftDuration = utilsService.calculProjectLeftDuration(projects[i]);

          // On récupère les taches du projet courant
          var projectTasks = projects[i].taches;
          for(var j = 0; j < projectTasks.length; j++) {
            // On récupère les collaborateurs de la tache courante
            var collaborators = projectTasks[j].collaborateurs;
            // On cherche l'index de l'id du user dans la listes des collaborateurs de la tache
            var indexCurrentUser = collaborators.indexOf(idCurrentUser);
            // Si > -1 alors il existe
            if(indexCurrentUser > -1) {
              projectTasks[j].duration = utilsService.calculTaskDuration(projectTasks[j]);
              projectTasks[j].leftDuration = utilsService.calculTaskLeftDuration(projectTasks[j]);
              tasksCollaborator.push(projectTasks[j]);


            }
          }
        }

        var numberTasks = tasksCollaborator.length;
        vm.numberTasks = numberTasks;
        vm.tasks = tasksCollaborator;

      })
      .error(function (err) {
        console.log(err);
      });





  });
