'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, $timeout, localStorageService, databaseService, utilsService) {

    var vm = this;
    var currentUser = localStorageService.get('currentUser');

    $scope.user = localStorageService.get('currentUser').pseudo;
    var idCurrentUser = localStorageService.get('currentUser')._id;

    function populatePage () {

      vm.numberProjects = vm.projects.length;

      var tasksCollaborator = [];

      for (var i = 0; i < vm.projects.length; i++) {

        // On calcule la durée du projet
        vm.projects[i].duration = utilsService.calculProjectDuration(vm.projects[i]);

        vm.projects[i].leftDuration = utilsService.calculProjectLeftDuration(vm.projects[i]);

        // On récupère les taches du projet courant
        var projectTasks = vm.projects[i].taches;

        var sumNowCostProject = 0;

        for (var j = 0; j < projectTasks.length; j++) {

          // On récupère la tache courante
          var currentTask = projectTasks[j];

          // On calcul le cout total de la tâche
          var totalCost = 0;
          var currentTaskDuration = utilsService.calculProjectDuration(projectTasks[j]);

          for(var l = 0; l < currentTask.collaborateurs.length; l++) {
            var currentCollaboratorId = currentTask.collaborateurs[l];
            var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(vm.saveCollaborators, currentCollaboratorId, '_id');
            var currentCollaborator = -1;
            if(indexCurrentCollaborator > -1)
              currentCollaborator = vm.saveCollaborators[indexCurrentCollaborator];
            totalCost += currentCollaborator.cout_horaire * 7 * currentTaskDuration;
          }

          // On récupère les collaborateurs de la tache courante
          var collaborators = projectTasks[j].collaborateurs;

          // On cherche l'index de l'id du user dans la listes des collaborateurs de la tache
          var indexCurrentUser = collaborators.indexOf(idCurrentUser);

          // Si > -1 alors le current user est assigné à la tâche
          if (indexCurrentUser > -1) {

            projectTasks[j].duration = utilsService.calculTaskDuration(projectTasks[j]);

            if (projectTasks[j].statut === 'Initial') {
              projectTasks[j].leftDuration = projectTasks[j].duration; // OK
              projectTasks[j].nowCost = 0; // OK
              projectTasks[j].totalCost = 0;
              projectTasks[j].passedDuration = 0; // OK
            }
            else if (projectTasks[j].statut === 'En cours') {
              projectTasks[j].passedDuration = utilsService.calculTaskPassedDuration(projectTasks[j]);
              projectTasks[j].leftDuration = projectTasks[j].duration - projectTasks[j].passedDuration;
              projectTasks[j].totalCost = totalCost;

              var nowCost = 0;
              // Calcul du cout de la tâche à l'insant t = now
              for(var l = 0; l < currentTask.collaborateurs.length; l++) {
                var currentCollaboratorId = currentTask.collaborateurs[l];
                var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(vm.saveCollaborators, currentCollaboratorId, '_id');
                var currentCollaborator = -1;
                if(indexCurrentCollaborator > -1)
                  currentCollaborator = vm.saveCollaborators[indexCurrentCollaborator];
                nowCost += currentCollaborator.cout_horaire * 7 * projectTasks[j].passedDuration;
              }
              projectTasks[j].nowCost = nowCost;

              // On arrondi au chiffre inférieur
              var advancement = Math.round((nowCost * 100) / totalCost);

              projectTasks[j].advancement = advancement;

            }
            else if (projectTasks[j].statut === 'Terminé(e)') {
              projectTasks[j].leftDuration = 0; // OK
              projectTasks[j].nowCost = 0; // OK
              projectTasks[j].totalCost = totalCost;
              projectTasks[j].passedDuration = projectTasks[j].duration; // OK
            }
            else if (projectTasks[j].statut === 'Annulé(e)') {
              projectTasks[j].leftDuration = 0; // OK
              projectTasks[j].nowCost = 0; // OK
              projectTasks[j].totalCost = 0;
              projectTasks[j].passedDuration = 0; // OK
            }

            tasksCollaborator.push(projectTasks[j]);
          }

          sumNowCostProject += projectTasks[j].nowCost;

        }


        vm.projects[i] = utilsService.projectStats(vm.projects[i], vm.saveBudgets, sumNowCostProject);

      }

      vm.tasks = tasksCollaborator;
    }









    // Au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      //  databaseService.getAllObjects('projects').success(function (data){ vm.saveProjects = data.data;})
      //  .error(function (err) { console.log(err); });

      databaseService.getAllObjects('collaborators').success(function(data){ vm.saveCollaborators = data;})
        .error(function (err) { console.log(err); });

      databaseService.getAllObjects('budgets').success(function(data){ vm.saveBudgets = data.data; })
       .error(function(err){ console.log(err); });

      databaseService.getCollaboratorProjects(idCurrentUser).success(function(data){ vm.projects = data; })
        .error(function(err){ console.log(err); });

      $timeout(function() {
        populatePage();
      });

    });

  });
