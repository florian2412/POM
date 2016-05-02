'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp').controller('BudgetsListCtrl', BudgetsListCtrl);

function BudgetsListCtrl($scope, databaseService, flashService) {

  var vm = this;

  vm.deleteBudget = deleteBudget;
  vm.showAllBudgets = showAllBudgets;

  function deleteBudget(idBudget) {
    databaseService.deleteObject('budgets', idBudget)
      .success(function (data) {
        if(data.success){
          var index = -1;
          var comArr = eval( vm.budgets );
          for( var i = 0; i < comArr.length; i++ ) {
            if( comArr[i]._id === idBudget ) {
              index = i;
              break;
            }
          }
          vm.budgets.splice( index, 1 );
          flashService.Success("Succés ! ", data.message, "bottom-right", true, 4);
        }
        else flashService.Error("Erreur ! ", data.message, "bottom-right", true, 4);
         
      })
      .error(function (err) {
        console.log(err);
      });
  };

  function showAllBudgets() {
    databaseService.getAllObjects('budgets')
      .success(function (data) {
        if(data.success) vm.budgets = data.data;
        else flashService.Error("Erreur ! ", data.message, "bottom-right", true, 4);
      })
      .error(function (err) {
        console.log(err);
      });
  };

  $scope.$on('$viewContentLoaded', function() {
    vm.showAllBudgets();
  });

};
