'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, localStorageService, databaseService) {

    $scope.user = localStorageService.get('currentUser').pseudo;
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);

    databaseService.getProjectsCollaborator(idCurrentUser)
      .success(function (data) {
        console.log(data);

        var projects = data;
        var numberProjet = projects.length;

        $scope.projects = projects;
        $scope.numberProjects = numberProjet;

        var tasksCollaborator = [];

        for(var i = 0; i < projects.length; i++) {
          // On récupère les taches du projet courant
          var projectTasks = projects[i].taches;
          for(var j = 0; j < projectTasks.length; j++) {
            // On récupère les collaborateurs de la tache courante
            var collaborators = projectTasks[j].collaborateurs;
            // On cherche l'index de l'id du user dans la listes des collaborateurs de la tache
            var indexCurrentUser = collaborators.indexOf(idCurrentUser);
            // Si > -1 alors il existe
            if(indexCurrentUser > -1) {
              tasksCollaborator.push(projectTasks[j]);
            }
          }
        }

        var numberTasks = tasksCollaborator.length;
        $scope.numberTasks = numberTasks;
        $scope.tasks = tasksCollaborator;

      })
      .error(function (err) {
        console.log(err);
      });





  });
