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

    databaseService.getCollaboratorProjects(idCurrentUser)
      .success(function (data) {

        var projects = data;
        var numberProjet = projects.length;

        vm.projects = projects;
        vm.numberProjects = numberProjet;

        var tasksCollaborator = [];

        for(var i = 0; i < projects.length; i++) {
          // On calcule la durée du projet
          projects[i].duration = utilsService.calculProjectDuration(projects[i]);
          projects[i].leftDuration = utilsService.calculProjectLeftDuration(projects[i]);

          var savedCollaborators = projects[i].collaborateurs;

          // On récupère les taches du projet courant
          var projectTasks = projects[i].taches;
          for(var j = 0; j < projectTasks.length; j++) {
            // On récupère les collaborateurs de la tache courante
            var collaborators = projectTasks[j].collaborateurs;

            // On cherche l'index de l'id du user dans la listes des collaborateurs de la tache
            var indexCurrentUser = collaborators.indexOf(idCurrentUser);
            // Si > -1 alors il existe
            if(indexCurrentUser > -1) {

//////////////////////////////////////////////////////////////////////////////////////////////////////
              // TODO get allCollaboratorsById ou non et chercher le cout horaire
/*
              console.log('collaborators avant get');
              console.log(collaborators);

              console.log('savedCollaborators avant get');
              console.log(savedCollaborators);
*/
              databaseService.getAllObjects('collaborators')
                .success(function (data) {
/*
                  console.log('collaborators dans get');
                  console.log(collaborators);
                  console.log('savedCollaborators dans get');
                  console.log(savedCollaborators);
*/
                  for(var k = 0; k < savedCollaborators.length; k++) {

//                    console.log(collaborators[k]);

                    var indexCollaborator = utilsService.arrayObjectIndexOf(data, savedCollaborators[k], '_id');
                    console.log('________________________________');

                    console.log('indexCollaborator[' + k + '] : ');
                    console.log(indexCollaborator);

                  }


                  //projectTasks[j].totalCost = 0;
                })
                .error(function (err) {

                });

//////////////////////////////////////////////////////////////////////////////////////////////////////



              projectTasks[j].duration = utilsService.calculTaskDuration(projectTasks[j]);

              if(projectTasks[j].statut === 'Initial') {
                projectTasks[j].leftDuration = projectTasks[j].duration;
                projectTasks[j].nowCost = 0;

                projectTasks[j].passedDuration = 0;
              }
              else if(projectTasks[j].statut === 'En cours') {
                projectTasks[j].leftDuration = utilsService.calculTaskLeftDuration(projectTasks[j]);
                projectTasks[j].passedDuration = utilsService.calculTaskPassedDuration(projectTasks[j]);

                // TODO Calcul du cout de la tâche
                //projectTasks[j].costNow = utilsService.calculCostTaskNow(projectTasks[j]);
                projectTasks[j].nowCost = -1;


              }
              else if(projectTasks[j].statut === 'Terminé(e)') {
                projectTasks[j].leftDuration = 0;
                projectTasks[j].nowCost = 0;
                //projectTasks[j].totalCost = 0;
                projectTasks[j].passedDuration = projectTasks[j].duration;
              }
              else if(projectTasks[j].statut === 'Annulé(e)') {
                projectTasks[j].leftDuration = 0;
                projectTasks[j].nowCost = 0;
                //projectTasks[j].totalCost = 0;
                projectTasks[j].passedDuration = 0;
              }

              tasksCollaborator.push(projectTasks[j]);
            }
          }
        }

        vm.tasks = tasksCollaborator;

      })
      .error(function (err) {
        console.log(err);
      });

  });
