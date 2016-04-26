'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp')
  .controller('ProjectsCreateCtrl', function ($scope, $state, $mdDialog, databaseService, flashService, authenticateService) {

    var collaborateursId = [];
    $scope.minDate = new Date();

    $scope.createProject = function() {

      // TODO Replace $scope by vm
      var vm = this;

      if(!$scope.project.startDate)
        $scope.project.startDate = new Date();

      if(!$scope.project.endDate)
        $scope.project.endDate = new Date();

      var nom = $scope.project.name;
      var chef_projet = authenticateService.getCurrentUser()._id;
      var statut = $scope.project.statut;
      var date_debut = $scope.project.startDate;
      var date_fin_theorique = $scope.project.endDate;
      var date_derniere_modif = new Date();

      /*var date_debut = new Date();
       var date_fin_theorique = new Date();*/
      //var ligne_budgetaire = $scope.budget._id;

      var data = {
        "nom" : nom,
        "statut" : statut,
        "chef_projet" : chef_projet,
        "date_debut" : date_debut,
        "date_fin_theorique" : date_fin_theorique,
        "date_derniere_modif" : date_derniere_modif,
        "collaborateurs": collaborateursId
      };

      console.log(data);

      databaseService.createObject('projects', data)
        .success(function (data) {
          flashService.Success("Création du projet " + nom + " réussie.", "", "bottom-right", true, 4);
          $state.go("projects");
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
      // Infos en dur pour le moment
      $scope.budgets = ["Ligne budget 1 : 30000€", "Ligne budget 2 : 50000€", "Ligne budget 3 : 100000€"];
      $scope.statuts = ["Initial", "En cours", "Annulé", "Terminé"]

      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          $scope.collaborators = data;
        })
        .error(function (err) {
          console.log(err);
        });

    });

    // Appelé depuis la view
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
