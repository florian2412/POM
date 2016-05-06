'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp').controller('BudgetsListCtrl', BudgetsListCtrl);

function BudgetsListCtrl($scope, databaseService, flashService, utilsService) {

  var vm = this;

  vm.deleteBudget = deleteBudget;
  vm.showAllBudgets = showAllBudgets;

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
  };

  function showAllBudgets() {
    databaseService.getAllObjects('budgets')
      .success(function (data) {
        if(data.success) vm.budgets = data.data;
        else flashService.error("Erreur ! ", data.message, "bottom-right", true, 4);
      })
      .error(function (err) {
        console.log(err);
      });
  };

  $scope.$on('$viewContentLoaded', function() {
    vm.showAllBudgets();
  });

};
