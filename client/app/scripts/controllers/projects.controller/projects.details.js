'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('ProjectsDetailsCtrl', function ($scope, $stateParams, $mdDialog, $state, databaseService) {


  $scope.getProjectById = function(id) {
    databaseService.getObjectById('projects', id)
      .success(function (data) {
        convertDateStringsToDates(data);
        $scope.project = data;
        databaseService.getObjectById('collaborators', $scope.project.chef_projet)
          .success(function (data) {
            var collaborator = data;
            $scope.chef_projet = collaborator.prenom + ' ' + collaborator.nom;
          })
      })
  };

  $scope.updateProject = function() {

    var nom = $scope.project.nom;
    var statut = $scope.project.statut;
    var date_debut = $scope.project.date_debut;
    var date_fin_theorique = $scope.project.date_fin_theorique;
    var date_fin_reelle = $scope.project.date_fin_reelle;
    /*var date_debut = new Date();
     var date_fin_theorique = new Date();*/
    //var ligne_budgetaire = $scope.budget._id;

    // TODO Faire la validation du formulaire de création de projet
    var data = "{ \"nom\": " + "\"" + nom + "\" "
      + ", \"statut\": " + "\"" + statut + "\" "
      + ", \"date_debut\": \"" + date_debut + "\" "
      + ", \"date_fin_theorique\": \"" + date_fin_theorique + "\" }";
    /*+ ", \"collaborateurs\": \"" + collaborateurs + "\" "
     + ", \"collaborateurs\": \"" + collaborateurs + "\" } ";*/

    console.log(data);

    databaseService.updateObject('projects', data)
      .success(function (data) {
        console.log(data);
        showSuccessDialog();
        $state.go("projects");
      })
      .error(function (err) {
        console.log(err);
      });
  };


  function showSuccessDialog() {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Confirmation de modification')
        .textContent('Le projet ' + $scope.project.name + ' a bien été mis à jour !')
        .ariaLabel('Modification du projet réussie')
        .ok('Ok'));
  };

  $scope.showCancelDialog = function() {

    var confirm = $mdDialog.confirm()
      .title('Alerte')
      .textContent('Etes-vous sûr d\'annuler la modification du projet ?')
      .ariaLabel('Annulation')
      .ok('Oui')
      .cancel('Non');

    $mdDialog.show(confirm).then(function() {
      $state.go("projects");
    }, function() {

    });
  };

  var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
      if (!input.hasOwnProperty(key)) continue;

      var value = input[key];
      var match;
      // Check for string properties which look like dates.
      // TODO: Improve this regex to better match ISO 8601 date strings.
      if (typeof value === "string" && (match = value.match(regexIso8601))) {
        // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
          input[key] = new Date(milliseconds);
        }
      } else if (typeof value === "object") {
        // Recurse into object
        convertDateStringsToDates(value);
      }
    }
  };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    $scope.budgets = ["Ligne budget 1 : 30000€", "Ligne budget 2 : 50000€", "Ligne budget 3 : 100000€"];

    $scope.statuts = ["Initial", "En cours", "Annulé", "Terminé"]

    $scope.getProjectById($stateParams.id);
  });
});
