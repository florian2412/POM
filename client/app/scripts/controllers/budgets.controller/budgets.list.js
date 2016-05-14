'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp').controller('BudgetsListCtrl', BudgetsListCtrl);

function BudgetsListCtrl($scope, databaseService, flashService, utilsService, statisticsService) {

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
        if(data.success) {
          vm.budgets = data.data;

            databaseService.getAllObjects('projects').success(function (projects) {
              
              vm.projects = projects;

              databaseService.getAllObjects('collaborators').success(function(collaborators){

                var percentage;
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
  };

  $scope.$on('$viewContentLoaded', function() {
    vm.showAllBudgets();
  });

};
