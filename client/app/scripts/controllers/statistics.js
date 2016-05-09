'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:StatisticsCtrl
 * @description
 * # StatsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('StatisticsCtrl', function ($scope, $rootScope, $location, localStorageService, databaseService) {

    $scope.user = localStorageService.get('currentUser');
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);


    function getData(callback) {
      databaseService.getAllObjects('projects')
        .success(function (data) {
          console.log(data);
          var statuts = [];
          var projects = data;
          for (var i = 0; i < projects.length; i++)
            statuts.push(projects[i].statut);
          //console.log(statuts);

          /* Récupération des intitulés des statuts ainsi que du nombre de projets par statut*/

          var numberProjectsByStatuts = statuts;

          function countProjects(numberProjectsByStatuts) {
            var a = [], b = [], prev;

            numberProjectsByStatuts.sort();
            for (var j = 0; j < numberProjectsByStatuts.length; j++) {
              if (numberProjectsByStatuts[j] !== prev) {
                a.push(numberProjectsByStatuts[j]);
                b.push(1);
              } else {
                b[b.length - 1]++;
              }
              prev = numberProjectsByStatuts[j];
            }
            return [a, b];
          }

          var nb = countProjects(numberProjectsByStatuts);
          console.log(nb[0]);
          console.log(nb[1]);

          var newData = [];
          for (var k = 0; k < nb[0].length; k++) {
            var dataJson = {
              'y': nb[1][k],
              'name': nb[0][k]
            };

            newData.push(dataJson);
          }
          callback(newData);

        });
    }
    /**********************************************************************************************************
     Pie chart of all projects
     *********************************************************************************************************/
    getData(function (newData) {


      $(function () {

        $(document).ready(function () {

          // Build the chart
          $('#piechart').highcharts({
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: true,
              type: 'pie'
            },
            title: {
              text: 'Compte rendu des projets'
            },
            tooltip: {
              pointFormat: 'Nombre de projets :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false
                },
                showInLegend: true
              }
            },
            series: [{
              colorByPoint: true,
              data: newData
            }]
          })
        })
      });
    });
    /**********************************************************************************************************
     **********************************************************************************************************
     *********************************************************************************************************/

    /**********************************************************************************************************
     Bar chart
     *********************************************************************************************************/
    databaseService.getAllObjects('projects')
      .success(function (data) {

        $(function () {
          $('#barchart').highcharts({
            chart: {
              type: 'column'
            },
            title: {
              text: 'Durée passée par projet / Coût de chaque projet'
            },
            xAxis: {
              categories: {series:data}
            },
            yAxis: [{
              min: 0,
              title: {
                text: 'Employees'
              }
            }, {
              title: {
                text: 'Profit (millions)'
              },
              opposite: true
            }],
            legend: {
              shadow: false
            },
            tooltip: {
              shared: true
            },
            plotOptions: {
              column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
              }
            },
            series: [{
              data : (function () {
                var libelle = [];
                var projects = data;
                for (var i = 0; i < projects.length; i++)
                  libelle.push(projects[i].nom);
                //console.log(statuts);

                /* Récupération des intitulés des statuts ainsi que du nombre de projets par statut*/

                var numberProjectsByStatuts = libelle;

                function countProjects(numberProjectsByStatuts) {
                  var a = [], b = [], prev;

                  numberProjectsByStatuts.sort();
                  for (var j = 0; j < numberProjectsByStatuts.length; j++) {
                    if (numberProjectsByStatuts[j] !== prev) {
                      a.push(numberProjectsByStatuts[j]);
                      b.push(1);
                    } else {
                      b[b.length - 1]++;
                    }
                    prev = numberProjectsByStatuts[j];
                  }
                  return [a, b];
                }

                var nb = countProjects(numberProjectsByStatuts);
                console.log(nb[0]);
                console.log(nb[1]);

                var newData = [];
                for (var k = 0; k < nb[0].length; k++) {
                  var dataJson = {
                    'y': nb[1][k],
                    'name': nb[0][k]
                  };

                  newData.push(dataJson);
                }

                return newData;
              }())
            }]
          });
        });
      });
    /**********************************************************************************************************
     **********************************************************************************************************
     *********************************************************************************************************/
  });
