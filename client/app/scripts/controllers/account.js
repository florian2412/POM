'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $location, localStorageService, databaseService) {

    $scope.user = localStorageService.get('currentUser');
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);

    databaseService.getProjectsCollaborator(idCurrentUser)
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
        $scope.donghnutData = nb[1];
        /* Intitulés des statuts */
        $scope.doughnutLabels = nb[0];
      });


        $scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.lineSeries = ['Théorique', 'Réel'];
        $scope.data = [
      [10, 20, 25, 35, 40, 50, 55, 60, 70, 75, 80, 85],
      [10, 23, 30, 37, 42, 48, 52, 62, 70, 73, 80, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  })
  .config(function(ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions('Line',{
    colours: ['#00FF00', '#FF0000'],
    responsive: true
  });
});
