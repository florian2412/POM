'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:BudgetsCreateCtrl
 * @description
 * # BudgetsCreateCtrl
 * Controller of the budget creation
 */

angular.module('pomApp')
  .controller('BudgetsCreateCtrl', function ($scope, $state, $mdDialog, databaseService, flashService) {

    $scope.createBudget = function() {

      var libelle = $scope.budget.libelle;
      var montant = $scope.budget.montant;
      var description = $scope.budget.description;

      var data = {
        "libelle" : libelle,
        "montant" : montant,
        "description" : description
      };

      databaseService.createObject('budgets', data)
        .success(function (data) {
          flashService.Success("Création de la ligne budgétaire " + libelle + " réussie.", "", "bottom-right", true, 4);
          $state.go("budgets");
        })
        .error(function (err) {
          console.log(err);
        });
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

    });

    // Appelé depuis la view
    $scope.showCancelDialog = function(event) {

      var confirm = $mdDialog.confirm()
        .title('Alerte')
        .textContent('Etes-vous sûr d\'annuler la création de la ligne budgétaire ?')
        .ariaLabel('Annulation')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(function() {
        $state.go("budgets");
      }, function() {});
    };

  });
