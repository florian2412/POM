'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('ProjectsDetailsCtrl', function ($rootScope, $scope, $stateParams, $log, $mdDialog, $state, databaseService, flashService) {

   $scope.getProjectById = function(id) {
    databaseService.getObjectById('projects', id)
      .success(function (data) {

        convertDateStringsToDates(data);

        $scope.project = data;
        $scope.minDateProject =  new Date(data.date_debut);

        //durée du projet
        var date1 = new Date(data.date_debut);
        var date2 = new Date(data.date_fin_theorique);
        $scope.dureeProject =  dateDiff(date1,date2);

        var budgetId = data.ligne_budgetaire.id;
        var budgetsList = $scope.budgets;
        var indexBudgetToSelect = arrayObjectIndexOf(budgetsList, budgetId, "_id");

        $scope.selectedBudget = budgetsList[indexBudgetToSelect];

        databaseService.getObjectById('collaborators', $scope.project.chef_projet)
          .success(function (data) {
            var collaborator = data;
            $scope.chef_projet = collaborator.prenom + ' ' + collaborator.nom;
          });

        $scope.progressProject = 100;
      })
  };

  //fonction de calcul de de difference entre deux dates et le cout
  function dateDiff(date1, date2){

    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  $scope.updateProject = function() {

    var vm = this;

    var idProject = vm.project._id;

    var nom = vm.project.nom;
    var statut = vm.project.statut;
    var date_debut = vm.project.date_debut;
    var date_fin_theorique = vm.project.date_fin_theorique;
    var date_fin_reelle = vm.project.date_fin_reelle;

    // TODO SAVE BUDGETS
    var ligne_budgetaire_id = $scope.selectedBudget._id;
    var ligne_budgetaire = {
      "id": ligne_budgetaire_id,
      "montant_restant": vm.selectedBudget.montant
    };

    var date_derniere_modif = new Date();

    var data = {
      "nom" : nom,
      "statut" : statut,
      "date_debut" : date_debut,
      "date_fin_theorique" : date_fin_theorique,
      "date_fin_reelle" : date_fin_reelle,
      "ligne_budgetaire" : ligne_budgetaire,
      "date_derniere_modif" : date_derniere_modif
    };

    databaseService.updateObject('projects', idProject, data)
      .success(function (data) {
        flashService.Success("Le projet " + $scope.project.nom + " a bien été mis à jour !", "", "bottom-right", true, 4);
        $state.go("projects");
      })
      .error(function (err) {
        console.log(err);
      });
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
      }, function() {}
    );
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

  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  $scope.$on('$viewContentLoaded', function() {

    databaseService.getAllObjects('budgets')
      .success(function (data) {
        $scope.budgets = data;
      })
      .error(function (err) {
        console.log(err);
      });

    $scope.statuts = ["Initial", "En cours", "Annulé", "Terminé"];

    $scope.getProjectById($stateParams.id);
  });
});
