'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:StatisticsCtrl
 * @description
 * # StatsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('StatisticsCtrl', function ($scope, $rootScope, $location, $timeout, localStorageService, databaseService, utilsService) {

    $scope.user = localStorageService.get('currentUser');
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);

    var vm = this;


    function buildProjectsStatusGraph() {
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
    }

    function buildBarGraph() {
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
    }


    // Retourne le cout total d'une tache par rapport à la durée et aux collaborateurs affecté
    function calculTaskTotalCost(task) {
      var taskTotalCost = 0;
      var currentTaskDuration = utilsService.calculProjectDuration(task);
      for (var l = 0; l < task.collaborateurs.length; l++) {
        var currentCollaboratorId = task.collaborateurs[l];
        var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(vm.saveCollaborators, currentCollaboratorId, '_id');
        var currentCollaborator = -1;
        if (indexCurrentCollaborator > -1)
          currentCollaborator = vm.saveCollaborators[indexCurrentCollaborator];
        taskTotalCost += currentCollaborator.cout_horaire * 7 * currentTaskDuration;
      }
      return taskTotalCost;
    }

    function populatePage() {

      buildProjectsStatusGraph();
//      buildBarGraph();

      // TODO Cout de chaque taches par rapport a cout total du projet
      // Récupérer le cout de chaque tache
      // Faire la somme
      // 1. Faire un graph ou on voit la répartition par tâches, des couts (en gros, on pourra voir quelles sont les taches les plus couteuses et les moins couteuse
      // 2. Faire un graph ou on voit la répartition des taches, des couts par rapport à la ligne budgétaire du projet avec une valeur de plus, représentant le budget restant


      var project = vm.saveProjects[0];
      var tasks = project.taches;
      var tasksCost = [];


      for (var i = 0; i < tasks.length; i++) {
        tasksCost.push(calculTaskTotalCost(tasks[i]));
      }

      console.log('tasksCost');
      console.log(tasksCost);
    }



    function getData(callback) {
      var statuts = [];
      var projects = vm.saveProjects;
      for (var i = 0; i < projects.length; i++)
        statuts.push(projects[i].statut);

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
    }



// Au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // On récupère tout ce dont on a besoin de la BDD et on stocke dans des variables
      databaseService.getAllObjects('projects').success(function (data){ vm.saveProjects = data;})
        .error(function(err) { console.log(err); });

      databaseService.getAllObjects('collaborators').success(function(data){ vm.saveCollaborators = data;})
        .error(function(err) { console.log(err); });

      databaseService.getAllObjects('budgets').success(function(data){ vm.saveBudgets = data.data; })
        .error(function(err){ console.log(err); });

      /*databaseService.getCollaboratorProjects(idCurrentUser).success(function(data){ vm.projects = data; })
       .error(function(err){ console.log(err); });*/

      $timeout(function() {
        populatePage();
      }, 1000);

    });

  });


