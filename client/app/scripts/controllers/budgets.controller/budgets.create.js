'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:BudgetsCreateCtrl
 * @description
 * # BudgetsCreateCtrl
 * Controller of the budget creation
 */

angular.module('pomApp').controller('BudgetsCreateCtrl', BudgetsCreateCtrl);

function BudgetsCreateCtrl($scope, $state, $mdDialog, databaseService, flashService) {

  var vm = this;

  vm.createBudget = createBudget;
  vm.showCancelDialog = showCancelDialog;


  function createBudget() {

    var budget = {
      "libelle" : vm.budget.libelle,
      "montant" : vm.budget.montant,
      "description" : vm.budget.description
    };

    databaseService.createObject('budgets', budget)
      .success(function (data) {
        if(data.success){
          flashService.success("Succés ! ", "Création du budget " + vm.budget.libelle + " réussie.", "bottom-right", true, 4);
          $state.go("budgets");
        } 
        else flashService.error("Erreur ! ", data.message, "bottom-right", true, 4);        
      })
      .error(function (err) {
        console.log(err);
      });
  };

  function showCancelDialog(event) {

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

    // Lancement au chargement de la page
  $scope.$on('$viewContentLoaded', function() {

  });

};
