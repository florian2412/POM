'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('ProjectsCtrl', function ($scope, $location, $http, projectsService, collaboratorsService) {

    $scope.showAllProjects = function(){
        projectsService.getAllProjects()
            .success(function (data) {
                $scope.projects = data;
            })
            .error(function (err) {
                console.error("Error !");
                console.error(err);
            });
    };

    $scope.getCollaboratorById = function(id) {
      collaboratorsService.getCollaboratorById(id)
        .success(function (data) {
          console.log("Success !");
          console.log(data);
          $scope.project.chef_projet = data;
        })
        .error(function (err) {
          console.error("Error on projectController : getNameCollaboratorById !");
          console.error(err);
        });
    };

    $scope.getProjectById = function(id){
        projectsService.getProjectById(id)
            .success(function (data) {
                console.log("Success !");
                console.log(data);
                $scope.projectDetail = data;
            })
            .error(function (err) {
                console.error("Error !");
                console.error(err);
            });
    };


    $scope.createProject = function() {

      //var chef_projet_all = "{ \"nom\": \"Pussacq\",\"prenom\": \"Florian\",\"pseudo\": \"florian2412\",\"mot_de_passe\": \"azerty\",\"status\": \"Developpeur\",\"cout_horaire\": 250}"   ;

      // TODO Faire la validation du formulaire de création de projet
      var data = "{ \"nom\": " + "\"" + $scope.nameNewProject + "\", \"statut\":\"En cours\" " + ", \"chef_projet\": \"" + $scope.collaboratorIdNewProject + "\" } ";

      projectsService.createProject(data)
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


  $scope.deleteProject = function(id) {
    projectsService.deleteProject(id)
      .success(function (data) {
        // Update liste projets
        $scope.showAllProjects();
      })
      .error(function(err) {
        console.log(err);
      });
  };

  $scope.showFormCreateProject = function () {
      $scope.showForm = true;
      $scope.showListProjects = false;

      collaboratorsService.getAllCollaborators()
        .success(function (data) {
          $scope.collaborators = data;
        });


  };

  $scope.hideFormCreateProject = function () {
      $scope.showForm = false;
      $scope.showListProjects = true;
  };




  $scope.modalShown = false;

  $scope.toggleModal = function() {
    console.log("OUIII");
    $scope.modalShown = !$scope.modalShown;
  };



    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
        $scope.showAllProjects();

        // Default --> Cache le formulaire de création de projet et affiche la tableau des projets
        $scope.hideFormCreateProject();

    });

});

