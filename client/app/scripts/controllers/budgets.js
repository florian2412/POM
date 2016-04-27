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

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // Récupère toutes lignes budgétaires et les affiche dans "budgets"
      databaseService.getAllObjects('budgets')
        .success(function (data) {
          $scope.budgets = data;
        })
        .error(function (err) {
          console.log(err);
        });

    });



  });
