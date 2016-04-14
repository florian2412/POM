'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp')
  .controller('ProjectsCreateCtrl', function ($scope, databaseService) {

    $scope.createProject = function() {
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

      databaseService.createObject('projects', data)
        .success(function (data) {
          console.log(data);



        })
        .error(function (err) {
          console.log(err);
        });
    };


    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

    
    });

  });
