'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('CollaboratorsCtrl', function ($scope, collaboratorsService) {


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





    $scope.createCollaborator = function() {

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


      var nom = $scope.nameNewCollaborator;
      var chef_projet = $scope.collaboratorIdNewCollaborator;
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

      collaboratorsService.createCollaborator(data)
        .success(function (data) {
          console.log(data);

          // Update liste projets
          $scope.showAllCollaborators();

          //  Cache le formulaire de création de projet et affiche la tableau des projets
          $scope.hideFormCreateCollaborator();

        })
        .error(function (err) {
          console.log(err);
        });
    };


    $scope.deleteCollaborator = function(id) {
      collaboratorsService.deleteCollaborator(id)
        .success(function (data) {
          // Update liste projets
          $scope.showAllCollaborators();
        })
        .error(function(err) {
          console.log(err);
        });
    };



    $scope.showFormCreateCollaborator = function () {
      $scope.showForm = true;

      $scope.dateLaunchCollaboratorNewCollaborator = new Date();

      collaboratorsService.getAllCollaborators()
        .success(function (data) {
          $scope.collaborators = data;
        });


    };

    $scope.hideFormCreateCollaborator = function () {
      $scope.showForm = false;
    };











    // Permet de lancer au chargement de la page : récupère tous les collaborateurs
    $scope.$on('$viewContentLoaded', function() {
      $scope.showAllCollaborators();

      // Default --> Cache le formulaire de création de projet et affiche la tableau des projets
      $scope.hideFormCreateCollaborator();

    });

  });
