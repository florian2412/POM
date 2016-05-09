'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:StatisticsCtrl
 * @description
 * # StatsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('StatisticsCtrl', function ($scope, $rootScope, $location, $timeout, localStorageService, databaseService) {

    $scope.user = localStorageService.get('currentUser');
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);

    var vm = this;


    function populatePage() {

      // TODO Cout de chaque taches par rapport a cout total du projet
      /*
       vm.numberProjects = vm.projects.length;

       var tasksCollaborator = [];

       for (var i = 0; i < vm.projects.length; i++) {

       // On calcule la durée du projet
       vm.projects[i].duration = utilsService.calculProjectDuration(vm.projects[i]);

       vm.projects[i].leftDuration = utilsService.calculProjectLeftDuration(vm.projects[i]);

       // On récupère les taches du projet courant
       var projectTasks = vm.projects[i].taches;

       var sumNowCostProject = 0;

       for (var j = 0; j < projectTasks.length; j++) {

       // On récupère la tache courante
       var currentTask = projectTasks[j];

       // On calcul le cout total de la tâche
       var totalCost = 0;
       var currentTaskDuration = utilsService.calculProjectDuration(projectTasks[j]);

       for(var l = 0; l < currentTask.collaborateurs.length; l++) {
       var currentCollaboratorId = currentTask.collaborateurs[l];
       var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(vm.saveCollaborators, currentCollaboratorId, '_id');
       var currentCollaborator = -1;
       if(indexCurrentCollaborator > -1)
       currentCollaborator = vm.saveCollaborators[indexCurrentCollaborator];
       totalCost += currentCollaborator.cout_horaire * 7 * currentTaskDuration;
       }

       // On récupère les collaborateurs de la tache courante
       var collaborators = projectTasks[j].collaborateurs;

       // On cherche l'index de l'id du user dans la listes des collaborateurs de la tache
       var indexCurrentUser = collaborators.indexOf(idCurrentUser);

       // Si > -1 alors le current user est assigné à la tâche
       if (indexCurrentUser > -1) {
       projectTasks[j] = statisticsService.taskStats(projectTasks[j], currentTask, vm.saveCollaborators, totalCost);
       tasksCollaborator.push(projectTasks[j]);
       }
       sumNowCostProject += projectTasks[j].nowCost;
       }
       vm.projects[i] = statisticsService.projectStats(vm.projects[i], vm.saveBudgets, sumNowCostProject);
       // Projects
       //showProgressBars();
       }
       vm.tasks = tasksCollaborator;
       */


      function getData(callback) {

        console.log('vm.saveProjects');
        console.log(vm.saveProjects);

        var statuts = [];
        var projects = vm.saveProjects;
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




    };





    // Au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

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


