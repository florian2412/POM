/**
 * Created by sarra on 25/04/2016.
 */

'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsDetailsTasksCreateCtrl
 * @description
 * # ProjectsDetailsTasksCreateCtrl
 * Controller of the projects.details.tasks.create
 */

angular.module('pomApp')
  .controller('ProjectsDetailsTasksCreateCtrl',
    function ($scope, $state, $mdDialog, $stateParams, databaseService, flashService, authenticateService) {

      var collaborateursId = [];

      $scope.createTask = function() {
        var idProject = $stateParams.id

        databaseService.getObjectById('projects',idProject)
          .success(function (data) {
            console.log(data);

            var project = data;

            if(!$scope.task.startDate)
              $scope.task.startDate = new Date();

            if(!$scope.task.endDate)
              $scope.task.endDate = new Date();

            var nom = $scope.task.name;
            var date_debut = $scope.task.startDate;
            var date_fin_theorique = $scope.task.endDate;
            var statut = $scope.task.statut;

            var task = {
              "libelle" : nom,
              "date_debut" : date_debut,
              "date_fin_theorique" : date_fin_theorique,
              "statut" : statut,
              "collaborateurs" : collaborateursId

            };

            var tasks = project.taches;

            tasks.push(task);

            var data = {
              "taches" : tasks
            };

            console.log(data);

            databaseService.updateObject('projects', idProject, data)
              .success(function (data) {
                console.log(data);
                //showSuccessDialog();
                flashService.Success("Création de la tâche " + nom + " réussie.", "", "bottom-right", true, 4);
                $state.go("projects.details.tasks");
              })
              .error(function (err) {
                console.log(err);
          });
      })
          .error(function (err) {
            console.log(err);
          });
      };


      $scope.selectCollaborator = function (collaborator) {
        if(!collaborator.checked) {
          collaborateursId.push(collaborator._id);
          collaborator.checked = true;
        } else {
          collaborator.checked = false;

          var indexCol = collaborateursId.indexOf(collaborator._id);
          if (indexCol > -1) {
            collaborateursId.splice(indexCol, 1);
          }
        }

      };


      // Lancement au chargement de la page
      $scope.$on('$viewContentLoaded', function() {
        databaseService.getAllObjects('collaborators')
          .success(function (data) {
            console.log(data);
            $scope.collaborators=data;
          })
          .error(function (err) {
            console.log(err);
          });


      });


      $scope.minDate = new Date();

      $scope.showCancelDialog = function(event) {

        var confirm = $mdDialog.confirm()
          .title('Alerte')
          .textContent('Etes-vous sûr d\'annuler la création de la tâche ?')
          .ariaLabel('Annulation')
          .targetEvent(event)
          .ok('Oui')
          .cancel('Non');

        $mdDialog.show(confirm).then(function() {
          $state.go("projects.details.tasks");
        }, function() {

        });
      };
    });

