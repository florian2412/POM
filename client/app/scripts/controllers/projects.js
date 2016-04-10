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
/*
  $scope.showAllCollaborators = function(){
    collaboratorsService.getAllCollaborators()
      .success(function (data) {
        $scope.collaborators = data;

      })
      .error(function (err) {
        console.error("Error !");
        console.error(err);
      });
  };
*/
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

      var data = "{ \"nom\": " + "\"PROJET\", \"statut\":\"En cours\" " + "} ";

      /*
      var nom = $scope.nameNewProject;
      console.log(nom);
      */

      projectsService.createProject(data)
        .success(function (data) {
          console.log(data);
          $scope.showAllProjects();
          $scope.hideFormCreateProject();

        })
        .error(function (err) {
          console.log(err);
        });
    };



    $scope.showFormCreateProject = function () {
        console.log($scope.showForm);
        //if(!$scope.showForm)
        $scope.showForm = true;
        $scope.showListProjects = false;

    };

    $scope.hideFormCreateProject = function () {
        console.log($scope.showForm);
        //if($scope.showForm)
        $scope.showForm = false;
        $scope.showListProjects = true;


    };

    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
        $scope.showAllProjects();

        // Default --> Hide the form create project & show the table
        $scope.showForm = false;
        $scope.showListProjects = true;

    });




});

