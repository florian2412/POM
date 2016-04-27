'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

angular.module('pomApp')
  .controller('BudgetsCtrl', function ($scope, databaseService) {

    $scope.deleteBudget = function(idBudget) {
      databaseService.deleteObject('budgets', idBudget)
        .success(function () {


          var index = -1;
          var comArr = eval( $scope.budgets );
          for( var i = 0; i < comArr.length; i++ ) {
            if( comArr[i]._id === idBudget ) {
              index = i;
              break;
            }
          }
          if( index === -1 ) { alert( "Something gone wrong" ); }
          $scope.budgets.splice( index, 1 );
        })
        .error(function (err) {
          console.log(err);
        });
    };

    var getAllBudgets = function() {
      databaseService.getAllObjects('budgets')
        .success(function (data) {
          $scope.budgets = data;
        })
        .error(function (err) {
          console.log(err);
        });
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // Récupère toutes lignes budgétaires et les affiche dans "budgets"
      getAllBudgets();

    });



  });
