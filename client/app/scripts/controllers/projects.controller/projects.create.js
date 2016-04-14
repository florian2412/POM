'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp')
  .controller('ProjectsCreateCtrl', function ($scope, $state, $rootScope, databaseService) {

    $scope.createProject = function() {

      var nom = $scope.project.name;
      //var chef_projet = $rootScope.currentUser.pseudo;
      var statut = $scope.project.statut;
      var date_debut = $scope.project.startDate;
      var date_fin_theorique = $scope.project.endDate;
      /*var date_debut = new Date();
      var date_fin_theorique = new Date();*/
      //var ligne_budgetaire = $scope.budget._id;


      // TODO Faire la validation du formulaire de création de projet
      var data = "{ \"nom\": " + "\"" + nom + "\" "
        + ", \"statut\": " + "\"" + statut + "\" "
        //+ ", \"chef_projet\": \"" + chef_projet + "\" "
        + ", \"date_debut\": \"" + date_debut + "\" "
        + ", \"date_fin_theorique\": \"" + date_fin_theorique + "\" }";
      /*+ ", \"collaborateurs\": \"" + collaborateurs + "\" "
       + ", \"collaborateurs\": \"" + collaborateurs + "\" } ";*/

      console.log(data);

      databaseService.createObject('projects', data)
        .success(function (data) {
          console.log(data);
          $state.go("collaborators");
        })
        .error(function (err) {
          console.log(err);
        });
    };


    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // Infos en dur pour le moment
      $scope.budgets = ["Ligne budget 1 : 30000€", "Ligne budget 2 : 50000€", "Ligne budget 3 : 100000€"];

      $scope.statuts = ["Initial", "En cours", "Annulé", "Terminé"]


    });

  });
