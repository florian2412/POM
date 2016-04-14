'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp')
  .controller('ProjectsCreateCtrl', function ($scope, $state, $rootScope, $mdDialog, databaseService) {

    $scope.createProject = function() {

      if(!$scope.project.startDate)
        $scope.project.startDate = new Date();

      if(!$scope.project.endDate)
        $scope.project.endDate = new Date();

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
          showSuccessDialog();
          $state.go("projects");
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

    function showSuccessDialog() {

      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Confirmation de création')
          .textContent('Le projet ' + $scope.project.name + ' a bien été créé !')
          .ariaLabel('Création du projet réussie')
          .ok('Ok'));
    };

    /*
     var success = $mdDialog.confirm()
     .title('Confirmation de création')
     .textContent('Le projet ' + " nom projet" + ' a bien été créé !')
     .ariaLabel('Création d\'un projet')
     //.targetEvent(event)
     .ok('Oui');

     $mdDialog.show(success).then(function() {
     $state.go("projects");
     });
     */




    $scope.showCancelDialog = function(event) {

      var confirm = $mdDialog.confirm()
        .title('Alerte')
        .textContent('Etes-vous sûr d\'annuler la création du projet ?')
        .ariaLabel('Annulation')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(function() {
        $state.go("projects");
      }, function() {

      });
    };


  });
