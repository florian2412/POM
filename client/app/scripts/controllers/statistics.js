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

    $scope.loading = true;

    $('#statisticsCard').hide();
    $scope.user = localStorageService.get('currentUser');
    var vm = this;
    vm.isLoadingDone = false;
    vm.updateChartProject = updateChartProject;

    function populatePage() {
      buildProjectsStatusChart();
      buildProjectsDurationBarChart();
      buildProjectsByStatusBarChart();
      buildBarChartTasksByProjects();

    }

    function updateChartProject() {
      var project = JSON.parse(vm.project);

      buildTasksCostChart(project._id);
      buildTasksCostProjectBudgetChart(project._id);
      buildTasksDurationBarChart(project._id);
      buildTasksCategoriesProject(project._id);

    }

    /**********************************************************************************************************
     Pie chart of all projects
     *********************************************************************************************************/
    function buildProjectsStatusChart() {
      var nbProjectsAndStatus = initDataProjectsStatus();
      var dataChart = chartsService.calculDataChart(nbProjectsAndStatus[1], nbProjectsAndStatus[0]);
      var idChart = 'piechart';
      var titleChart = 'Compte rendu des projets';
      var pointFormatChart = 'Nombre de projets :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    function buildProjectsByStatusBarChart() {
      var nbProjectsAndStatus = initDataProjectsStatus();
      var idChart = 'barchartstatus-projects';
      var titleChart = 'Nombre de projets en fonction du status';
      var pointFormatChart = 'Nombre de projets :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildBarChartProjectsByStatus(idChart, titleChart, pointFormatChart, nbProjectsAndStatus[0], nbProjectsAndStatus[1]);
    }

    function initDataProjectsStatus() {
      var statuts = [];
      var projects = vm.saveProjects;
      for (var i = 0; i < projects.length; i++)
        statuts.push(projects[i].statut);
      return statisticsService.countObjectsByTermFromNbTerm(statuts);
    }

    function initDataTasksCategorie(project) {
      var categories = [];
      var tasks = project.taches;
      for (var i = 0; i < tasks.length; i++)
        categories.push(tasks[i].categorie);
      return statisticsService.countObjectsByTermFromNbTerm(categories);
    }

    function buildBarChartTasksByProjects() {
      var projects = vm.saveProjects;
      var status = vm.saveStatus;

      // Contiendra 2 listes --> La première (nbProjectsAndStatus[0]) correspond aux status des taches, la deuxième (nbProjectsAndStatus[1]) au nombre de tache par statuts
      var nbProjectsAndStatus = [];
      var projectsName = [];
      var saveTasksProjects = [];
      var data = [];

      for (var i = 0; i < projects.length; i++) {
        projectsName.push(projects[i].nom);
        var projectTasks = projects[i].taches;
        var tasksStatus = [];
        for(var j = 0; j < projectTasks.length; j++) {
          tasksStatus.push(projectTasks[j].statut);
        }
        saveTasksProjects.push(tasksStatus);
        nbProjectsAndStatus[i] = statisticsService.countObjectsByTermFromNbTerm(tasksStatus);
      }

      for (var k = 0; k < status.length; k++) {
        var dataNewData = [];
        for (var l = 0; l < nbProjectsAndStatus.length; l++) {
          var dataProject = nbProjectsAndStatus[l];
          var index = dataProject[0].indexOf(status[k]);
          if(index > -1)
            dataNewData.push(dataProject[1][index]);
          else
            dataNewData.push(0);
        }
        var newData = {
          'name': status[k],
          'data': dataNewData
        };
        data.push(newData);
      }

      var idChart = 'barchartstatustasks-projects';
      var titleChart = 'Statut des tâches par projet';
      chartsService.buildBarChartTasksByProjects(idChart, titleChart, projectsName, data)
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

    function buildTasksDurationBarChart(projectId) {
      var project = searchProjectInProjects(projectId);
      var tasks = project.taches;
      var tasksTheoricDuration = [];
      var tasksRealDuration = [];
      var tasksName = [];

      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].statut === 'Terminé(e)') {
          tasksTheoricDuration.push(statisticsService.getDuration(tasks[i]));
          tasksRealDuration.push(statisticsService.getTotalRealTime(tasks[i]));
          tasksName.push(tasks[i].libelle);
        }
      }

      var idChart = 'barchart-project';
      var titleChart = 'Comparaison entre la durée théorique et réelle de chaque tâche terminée du projet';
      var pointFormatChart = 'Durée :<b>{point.y} €</b> <br> Soit :<b>{point.percentage:.1f}%</b>';

      chartsService.buildBarChartTasksDuration(idChart, titleChart, pointFormatChart, tasksName, tasksTheoricDuration, tasksRealDuration);
    }

    function buildProjectsDurationBarChart(projectId) {
      var projects = vm.saveProjects;
      var projectTheoricDuration = [];
      var projectRealDuration = [];
      var projectsName = [];

      for (var i = 0; i < projects.length; i++) {
        if (projects[i].statut === 'Terminé(e)') {
          projectTheoricDuration.push(statisticsService.getDuration(projects[i]));
          projectRealDuration.push(statisticsService.getTotalRealTime(projects[i]));
          projectsName.push(projects[i].nom);
        }
      }

      var idChart = 'barchart-projects';
      var titleChart = 'Comparaison entre la durée théorique et réelle de chaque projet terminé';
      var pointFormatChart = 'Durée :<b>{point.y} €</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildBarChartTasksDuration(idChart, titleChart, pointFormatChart, projectsName, projectTheoricDuration, projectRealDuration);
    }

    function buildTasksCategoriesProject(projectId) {
      var project = searchProjectInProjects(projectId);
      var nbTasksAndCategories = initDataTasksCategorie(project);
      var dataChart = chartsService.calculDataChart(nbTasksAndCategories[1], nbTasksAndCategories[0]);
      var idChart = 'piecharttaskscat-project';
      var titleChart = 'Classement des tâches par catégories';
      var pointFormatChart = 'Nombre de tâches :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }


    // Au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // On récupère tout ce dont on a besoin de la BDD et on stocke dans des variables
      databaseService.getAllObjects('projects')
        .success(function (data){
          vm.saveProjects = data;
          vm.zeroProject = ((data.length === 0) ? true : false);
        })
        .error(function(err) { console.log(err); });

      databaseService.getAllObjects('collaborators')
        .success(function(data){
          vm.saveCollaborators = data;
        })
        .error(function(err) { console.log(err); });

      databaseService.getAllObjects('budgets')
        .success(function(data){
          vm.saveBudgets = data.data;
        })
        .error(function(err){ console.log(err); });

      databaseService.getSettings('statuts')
        .success(function(data) {
          vm.saveStatus = data;
        })
        .error(function(err){ console.log(err); });

      $timeout(function() {
        $('#statisticsCard').show();
        $scope.loading = false;
        populatePage();
      }, 1000);

    });

  });


