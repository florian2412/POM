'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:BudgetListCtrl
 * @description
 * # BudgetListCtrl
 * Controller of the budgets.list
 */

angular.module('pomApp').controller('BudgetsListCtrl', BudgetsListCtrl);

function BudgetsListCtrl($scope, databaseService, flashService, utilsService, statisticsService) {

  var vm = this;

  vm.deleteBudget = deleteBudget;
  vm.showAllBudgets = showAllBudgets;

  /**
   * Supprime une ligne budgétaire en base selon un id
   *
   * @param idBudget
   */
  function deleteBudget(idBudget) {
    databaseService.deleteObject('budgets', idBudget)
      .success(function (data) {
        if(data.success){
          var i = utilsService.arrayObjectIndexOf(vm.budgets, idBudget, '_id');
          vm.budgets.splice( i, 1 );
          flashService.success("Succés ! ", data.message, "bottom-right", true, 4);
        }
        else flashService.error("Erreur ! ", data.message, "bottom-right", true, 4);

      })
      .error(function (err) {
        console.log(err);
      });
  }

  /**
   * Récupère et affiche tous les budgets
   */
  function showAllBudgets() {
    databaseService.getAllObjects('budgets')
      .success(function (data) {
        if(data.success) {
          vm.budgets = data.data;

            databaseService.getAllObjects('projects').success(function (projects) {

              vm.projects = projects;

              databaseService.getAllObjects('collaborators').success(function(collaborators){

                for (var i = vm.budgets.length - 1; i >= 0; i--) {
                  var percentage = statisticsService.calculateBudgetConsumption( vm.budgets[i], vm.projects, collaborators);
                  percentage = percentage * 100;
                  vm.budgets[i].percentage = percentage;
                }
              });
            });
        }
        else flashService.error("Erreur ! ", data.message, "bottom-right", true, 4);
      });
  }

  /**
   * Se lance au chargement de la page
   */
  $scope.$on('$viewContentLoaded', function() {
    vm.showAllBudgets();
  });

}
