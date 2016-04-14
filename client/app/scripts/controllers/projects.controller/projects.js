'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular
  .module('pomApp')
  .controller('ProjectsCtrl', function ($scope, $location, $http, databaseService) {

    // Affiche ou rafraichit tous les projets dans le tableau des projets
    $scope.showAllProjects = function(){
      databaseService.getAllObjects('projects')
          .success(function (data) {
              $scope.projects = data;
          })
          .error(function (err) {
              console.error(err);
          });
    };

    var getObjectById = function(collection, id) {
      databaseService.getObjectById(collection, id)
        .success(function (data) {
          return data;
        })
        .error(function (err) {
          return err;
        });
    };

    $scope.getCollaboratorById = function(id) {
      $scope.project.chef_projet = getObjectById('collaborators', id);

      /*
      databaseService.getObjectById('collaborators', id)
        .success(function (data) {
          console.log(data);
          $scope.project.chef_projet = data;
        })
        .error(function (err) {
          console.error(err);
        });
        */
    };

    $scope.getProjectById = function(id){
      $scope.project.projectDetail = getObjectById('projects', id);

      /*
      databaseService.getObjectById('projects', id)
            .success(function (data) {
                console.log(data);
                $scope.projectDetail = data;
            })
            .error(function (err) {
                console.error(err);
            });
            */
    };

/*
    $scope.createProject = function() {


      var nom = $scope.nameNewProject;
      var chef_projet = $scope.collaboratorIdNewProject;
      var statut = "Initialisation";
      var date = new Date();
      var date_debut = date;
      var date_fin_theorique = date;
      var collaborateurs = ["sds", "sdsdsdsd"];
      var ligne_budgetaire = "1111111";




      // TODO Faire la validation du formulaire de création de projet
      var data = "{ \"nom\": " + "\"" + nom + "\" "
        + ", \"statut\": " + "\"" + statut + "\" "
        + ", \"chef_projet\": \"" + chef_projet + "\" }";
        + ", \"date_debut\": \"" + date_debut + "\" "
        + ", \"date_fin_theorique\": \"" + date_fin_theorique + "\" "
        + ", \"collaborateurs\": \"" + collaborateurs + "\" } ";

      databaseService.createObject('projects', data)
        .success(function (data) {
          console.log(data);

          // Update liste projets
          $scope.showAllProjects();

          //  Cache le formulaire de création de projet et affiche la tableau des projets
          $scope.hideFormCreateProject();

        })
        .error(function (err) {
          console.log(err);
        });
    };
*/

    $scope.deleteProject = function(id) {
      databaseService.deleteObject('projects', id)
        .success(function (data) {
          // Update liste projets
          $scope.showAllProjects();
        })
        .error(function(err) {
          console.log(err);
        });
    };


/*
    $scope.showFormCreateProject = function () {
      $scope.showForm = true;

      $scope.dateLaunchProjectNewProject = new Date();

      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          $scope.collaborators = data;
        });
    };

    $scope.hideFormCreateProject = function () {
        $scope.showForm = false;
    };
*/

    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
        $scope.showAllProjects();

        // Default --> Cache le formulaire de création de projet et affiche la tableau des projets
        //$scope.hideFormCreateProject();
    });


});

