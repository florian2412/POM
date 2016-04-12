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
  .controller('ProjectsCtrl', function ($scope, $location, $http, projectsService, collaboratorsService) {

    // Affiche ou rafraichit tous les projets dans le tableau des projets
    $scope.showAllProjects = function(){
        projectsService.getAllProjects()
            .success(function (data) {
                $scope.projects = data;
            })
            .error(function (err) {
                console.error(err);
            });
    };

    $scope.getCollaboratorById = function(id) {
      collaboratorsService.getCollaboratorById(id)
        .success(function (data) {
          console.log(data);
          $scope.project.chef_projet = data;
        })
        .error(function (err) {
          console.error(err);
        });
    };

    $scope.getProjectById = function(id){
        projectsService.getProjectById(id)
            .success(function (data) {
                console.log(data);
                $scope.projectDetail = data;
            })
            .error(function (err) {
                console.error(err);
            });
    };


    $scope.createProject = function() {

      //var chef_projet_all = "{ \"nom\": \"Pussacq\",\"prenom\": \"Florian\",\"pseudo\": \"florian2412\",\"mot_de_passe\": \"azerty\",\"status\": \"Developpeur\",\"cout_horaire\": 250}"   ;

/*
      nom: String,
        chef_projet: mongoose.Schema.ObjectId,
        //chef_projet_all: {type: mongoose.Schema.ObjectId, ref: 'Collaborator'},
        date_debut: { type: Date, default: Date.now },
        date_fin_theorique: Date,
        date_fin_reelle: Date,
        statut : String, // En cours, Terminé, Annulé, Supprimé
        collaborateurs: [ mongoose.Schema.ObjectId ],
        infos_techniques: {
        creation: { type: Date, default: Date.now },
        modification:  { type: Date, default: Date.now }
      },
      ligne_budgetaire: mongoose.Schema.ObjectId

      */


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

      //initDatePicker();

      $scope.dateLaunchProjectNewProject = new Date();

      collaboratorsService.getAllCollaborators()
        .success(function (data) {
          $scope.collaborators = data;
        });


    };

    $scope.hideFormCreateProject = function () {
        $scope.showForm = false;
        $scope.showListProjects = true;
    };






    // Permet de lancer au chargement de la page : récupère tous les projets
    $scope.$on('$viewContentLoaded', function() {
        $scope.showAllProjects();

        // Default --> Cache le formulaire de création de projet et affiche la tableau des projets
        $scope.hideFormCreateProject();

    });


    // Variables (fonctions, valeurs, etc...)
    /*var initDatePicker = function () {
      $scope.dateLaunchProjectNewProject = new Date();

      console.log(dateLaunchProjectNewProject);

      $scope.minDate = new Date(
        $scope.dateLaunchProjectNewProject.getFullYear(),
        $scope.dateLaunchProjectNewProject.getMonth() - 2,
        $scope.dateLaunchProjectNewProject.getDate());

      $scope.maxDate = new Date(
        $scope.dateLaunchProjectNewProject.getFullYear(),
        $scope.dateLaunchProjectNewProject.getMonth() + 48,
        $scope.dateLaunchProjectNewProject.getDate());

    };*/

});

