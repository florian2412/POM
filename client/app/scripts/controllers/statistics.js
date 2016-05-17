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

    // Booléen définissant l'affichage de l'image de chargement
    $scope.loading = true;

    $('#statisticsCard').hide();
    $scope.user = localStorageService.get('currentUser');
    var vm = this;

    vm.updateChartProject = updateChartProject;

    /**
     * Peuple la page lorsque elle est chargée
     *
     */
    function populatePage() {
      buildProjectsStatusChart();
      buildProjectsByStatusBarChart();
      buildProjectsDurationBarChart();
      buildBarChartTasksByProjects();
    }

    /**
     * Met à jour les graphes concernant un projet dans le second onglet
     *
     */
    function updateChartProject() {
      var project = JSON.parse(vm.project);

      vm.zeroTasks = true;

      // On regarde si on a bien des tâche affecté sur le projet sinon, on cache les grahiques
      if(project.taches.length > 0)
        vm.zeroTasks = false;

      buildTasksCostChart(project._id);
      buildTasksCostProjectBudgetChart(project._id);
      buildTasksDurationBarChart(project._id);
      buildTasksCategoriesProject(project._id);
      buildTasksStatusChart(project._id);
      buildTasksByStatusBarChart(project._id);
    }

    /**
     * Construit le pie chart des projets en fonction de leurs status
     */
    function buildProjectsStatusChart() {
      var nbProjectsAndStatus = initDataProjectsStatus();
      var dataChart = chartsService.calculDataChart(nbProjectsAndStatus[1], nbProjectsAndStatus[0]);
      var idChart = 'piechart';
      var titleChart = 'Compte rendu des projets';
      var pointFormatChart = 'Nombre de projets :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    /**
     * Construit le bar chart des projets en fonction de leurs status
     */
    function buildProjectsByStatusBarChart() {
      var nbProjectsAndStatus = initDataProjectsStatus();
      var idChart = 'barchartstatus-projects';
      var titleChart = 'Nombre de projets en fonction du statut';
      var pointFormatChart = 'Nombre de projets';
      chartsService.buildBarChartProjectsByStatus(idChart, titleChart, pointFormatChart, nbProjectsAndStatus[0], nbProjectsAndStatus[1]);
    }

    /**
     * Construit le pie chart des tâches en fonction de leurs status
     *
     * @param projectId
     */
    function buildTasksStatusChart(projectId) {
      var project = searchProjectInProjects(projectId);
      var nbProjectsAndStatus = initDataTasksStatus(project);
      var dataChart = chartsService.calculDataChart(nbProjectsAndStatus[1], nbProjectsAndStatus[0]);
      var idChart = 'piechartstatus-tasksproject';
      var titleChart = 'Compte rendu des tâches';
      var pointFormatChart = 'Nombre de tâches :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    /**
     * Construit le bar chart des tâches en fonction de leurs status
     *
     * @param projectId
     */
    function buildTasksByStatusBarChart(projectId) {
      var project = searchProjectInProjects(projectId);
      var nbProjectsAndStatus = initDataTasksStatus(project);
      var idChart = 'barchartstatus-tasksproject';
      var titleChart = 'Nombre de tâches en fonction du statut';
      var pointFormatChart = 'Nombre de tâches';
      chartsService.buildBarChartProjectsByStatus(idChart, titleChart, pointFormatChart, nbProjectsAndStatus[0], nbProjectsAndStatus[1]);
    }

    /**
     * Initialise les données des projets pour la création de graphes
     *
     * @returns {*|*[]}
     */
    function initDataProjectsStatus() {
      var statuts = [];
      var projects = vm.saveProjects;
      for (var i = 0; i < projects.length; i++)
        statuts.push(projects[i].statut);
      return statisticsService.countObjectsByTermFromNbTerm(statuts);
    }

    /**
     * Initialise les données des tâches d'un projet pour la création de graphes sur les status
     *
     * @param project
     * @returns {*|*[]}
     */
    function initDataTasksStatus(project) {
      var statuts = [];
      var tasks = project.taches;
      for (var i = 0; i < tasks.length; i++)
        statuts.push(tasks[i].statut);
      return statisticsService.countObjectsByTermFromNbTerm(statuts);
    }

    /**
     * Initialise les données des tâches d'un projet pour la création de graphes sur les catégories
     *
     * @param project
     * @returns {*|*[]}
     */
    function initDataTasksCategorie(project) {
      var categories = [];
      var tasks = project.taches;
      for (var i = 0; i < tasks.length; i++)
        categories.push(tasks[i].categorie);
      return statisticsService.countObjectsByTermFromNbTerm(categories);
    }

    /**
     * Construit le bar chart des tâches d'un projet
     */
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

    /**
     * Retourne un projet d'une liste de projet selon un id de projet
     *
     * @param projectId
     * @returns {*}
     */
    function searchProjectInProjects(projectId) {
      var indexProject = utilsService.arrayObjectIndexOf(vm.saveProjects, projectId, '_id');
      if(indexProject > -1)
        return vm.saveProjects[indexProject];
      else
        return -1;
    }

    /**
     * Construit le pie chart des couts des tâches d'un projet
     *
     * @param projectId
     */
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
      var titleChart = 'Répartition des coûts des tâches du projet';
      var pointFormatChart = 'Coût :<b>{point.y} €</b> <br> Soit :<b>{point.percentage:.1f}%</b>';

      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    /**
     * Construit le pie chart des couts des tâches d'un projet en fonction du budget du projet
     *
     * @param projectId
     */
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

    /**
     * Construit le bar chart de la durée des tâches d'un projet
     *
     * @param projectId
     */
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

    /**
     * Construit le bar chart de la durée des projet
     *
     */
    function buildProjectsDurationBarChart() {
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

    /**
     * Construit le pie chart des catégories des tâches d'un projet
     *
     * @param projectId
     */
    function buildTasksCategoriesProject(projectId) {
      var project = searchProjectInProjects(projectId);
      var nbTasksAndCategories = initDataTasksCategorie(project);
      var dataChart = chartsService.calculDataChart(nbTasksAndCategories[1], nbTasksAndCategories[0]);
      var idChart = 'piecharttaskscat-project';
      var titleChart = 'Répartition des tâches par catégories';
      var pointFormatChart = 'Nombre de tâches :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>';
      chartsService.buildPieChart(idChart, titleChart, pointFormatChart, dataChart);
    }

    /**
     * Méthode lancée lorsqu la page est chargée
     */
    $scope.$on('$viewContentLoaded', function() {

      // On récupère tout ce dont on a besoin de la BDD et on stocke dans des variables
      databaseService.getAllObjects('projects')
        .success(function (data){
          vm.saveProjects = data;

          vm.zeroProject = (data.length === 0);

          if(!vm.zeroProject) {
            vm.zeroFinishedProject = true;
            for (var i = 0; i < vm.saveProjects.length; i++) {
              if(vm.saveProjects[i].statut === 'Terminé(e)')
                vm.zeroFinishedProject = false;
            }
          }
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


