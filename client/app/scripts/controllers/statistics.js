'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:StatisticsCtrl
 * @description
 * # StatsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('StatisticsCtrl', function ($scope, $rootScope, $location, localStorageService, databaseService, $mdDialog) {

    $scope.user = localStorageService.get('currentUser');
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);
    

    databaseService.getAllObjects('projects')
      .success(function (data) {
        console.log(data);
        var statuts = [];
        var projects = data;
        for (var i = 0; i < projects.length; i++)
          statuts.push(projects[i].statut);
        console.log(statuts);

        /* Récupération des intitulés des statuts ainsi que du nombre de projets par statut*/

        var numberProjectsByStatuts = statuts;

        function countProjects(numberProjectsByStatuts) {
          var a = [], b = [], prev;

          numberProjectsByStatuts.sort();
          for ( var j = 0; j < numberProjectsByStatuts.length; j++ ) {
            if ( numberProjectsByStatuts[j] !== prev ) {
              a.push(numberProjectsByStatuts[j]);
              b.push(1);
            } else {
              b[b.length-1]++;
            }
            prev = numberProjectsByStatuts[j];
          }
          return [a, b];
        }

        var nb = countProjects(numberProjectsByStatuts);

        /* Nombre de projets par statut*/
        $scope.doughnutData = nb[1];
        /* Intitulés des statuts */
        $scope.doughnutLabels = nb[0];
      });
    $scope.onClick= function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '../views/statistics.views/statistics.details.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
    };
    function DialogController($scope, $mdDialog, localStorageService) {
      $scope.state = localStorageService.get('projects');
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
  })
  .config(function(ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions('Doughnut',{
      colours: ['#FF0000', '#FF6600','#0000FF' , '#00FF00'],
      responsive: true
    });
  });

