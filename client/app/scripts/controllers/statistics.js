'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:StatisticsCtrl
 * @description
 * # StatsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('StatisticsCtrl', function ($scope, $rootScope, $location, $timeout, localStorageService, databaseService, utilsService, chartsService, statisticsService) {

    $scope.user = localStorageService.get('currentUser');
    var vm = this;
    vm.updateChartProject = updateChartProject;

    function populatePage() {
      buildProjectsStatusChart();

    }

    function updateChartProject() {
      var project = JSON.parse(vm.project);

      buildTasksCostChart(project._id);
      buildTasksCostProjectBudgetChart(project._id);

    }

    /**********************************************************************************************************
     Pie chart of all projects
     *********************************************************************************************************/
    function buildProjectsStatusChart() {
      var statuts = [];
      var projects = vm.saveProjects;
      for (var i = 0; i < projects.length; i++)
        statuts.push(projects[i].statut);

      var nbProjectsAndStatus = statisticsService.countProjectsByStatusFromStatus(statuts);

      var dataChart = chartsService.calculDataChart(nbProjectsAndStatus[1], nbProjectsAndStatus[0]);
      var idChart = 'piechart';
      var titleChart = 'Compte rendu des projets';
      var pointFormatChart = 'Nombre de projets :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';

      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    function searchProjectInProjects(projectId) {
      var indexProject = utilsService.arrayObjectIndexOf(vm.saveProjects, projectId, '_id');
      if(indexProject > -1)
        return vm.saveProjects[indexProject];
      else
        return -1;
    }

    function buildTasksCostChart(projectId) {
      var project = searchProjectInProjects(projectId);

      var tasks = project.taches;
      var tasksCost = [];
      var tasksName = [];

      for (var i = 0; i < tasks.length; i++) {
        tasksCost.push(statisticsService.calculTaskTotalCost(tasks[i], vm.saveCollaborators));
        tasksName.push(tasks[i].libelle);
      }

      var dataChart = chartsService.calculDataChart(tasksCost, tasksName);

      var idChart = 'piechart-project';
      var titleChart = 'Répartition des coûts des tâches sur le projet';
      var pointFormatChart = 'Coût :<b>{point.y} €</b> <br> Soit :<b>{point.percentage:.1f}%</b>';

      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }


    function buildTasksCostProjectBudgetChart(projectId) {
      var project = searchProjectInProjects(projectId);

      var tasks = project.taches;
      var tasksCost = [];
      var tasksName = [];

      for (var i = 0; i < tasks.length; i++) {
        tasksCost.push(statisticsService.calculTaskTotalCost(tasks[i], vm.saveCollaborators));
        tasksName.push(tasks[i].libelle);
      }

      // Calcul du budget restant d'un projet selon sa ligne budgétaire
      var tasksTotalCost = utilsService.sumArrayValues(tasksCost);
      var indexProjectBudget = utilsService.arrayObjectIndexOf(vm.saveBudgets, project.ligne_budgetaire.id, '_id');
      var projectBudget = 0;
      if(indexProjectBudget > -1)
        projectBudget = vm.saveBudgets[indexProjectBudget];
      var leftBudget = projectBudget.montant - tasksTotalCost;

      tasksCost.push(leftBudget);
      tasksName.push('Budget restant sur le projet');

      var dataChart = chartsService.calculDataChart(tasksCost, tasksName);

      var idChart = 'piechart-project2';
      var titleChart = 'Répartition des coûts des tâches par rapport au budget du projet';
      var pointFormatChart = 'Coût :<b>{point.y} €</b> <br> Soit :<b>{point.percentage:.1f}%</b>';

      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    // Au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // On récupère tout ce dont on a besoin de la BDD et on stocke dans des variables
      databaseService.getAllObjects('projects').success(function (data){ vm.saveProjects = data;
        vm.zeroProject = ((data.length === 0) ? true : false );})
        .error(function(err) { console.log(err); });

      databaseService.getAllObjects('collaborators').success(function(data){ vm.saveCollaborators = data;})
        .error(function(err) { console.log(err); });

      databaseService.getAllObjects('budgets').success(function(data){ vm.saveBudgets = data.data; })
        .error(function(err){ console.log(err); });

      $timeout(function() {
        populatePage();
      }, 1000);

    });




    /**********************************************************************************************************
     Bar chart
     *********************************************************************************************************/
    /*
     function buildBarChart() {
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

     // Récupération des intitulés des statuts ainsi que du nombre de projets par statut

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
     */

  });


