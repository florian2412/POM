'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('MainCtrl',MainCtrl);

function MainCtrl($scope, $state, $rootScope, $timeout, localStorageService, databaseService, utilsService, statisticsService,NgTableParams) {

  var vm = this;
  vm.showTasks = showTasks;
  vm.redirectTasksDetails = redirectTasksDetails;

  var currentUser = localStorageService.get('currentUser');
  var idCurrentUser = localStorageService.get('currentUser')._id;

  var statuts = {"initial": { "color": "blue", "class": "fa fa-info", "statut": "Initial" },
               "en_cours": { "color": "orange", "class": "fa fa-cog fa-spin fa-fw margin-bottom", "statut":"En cours" },
               "termine": { "color": "green", "class": "fa fa-check-circle","statut": "Terminé(e)" },
               "annule": { "color": "red", "class": "fa fa-times-circle", "statut": "Annulé(e)" },
               "archive": { "color": "gray", "class": "fa fa-file-archive-o", "statut": "Archivé" }
             };

  function redirectTasksDetails(event,taskId, projectId){
    $state.go('projects.details.tasks.details',{"idtask":taskId, "id":projectId});
  }

  function allTasksDetails(projects){
   
    var urgent_tasks = [], completed_tasks = [], upcoming_tasks = [], new_tasks = [], canceled_tasks = [];
    var allUserTasks = [];

    for (var i = projects.length - 1; i >= 0; i--) {
      // console.log(projects[i].statut);
      if(projects[i].statut === "En cours"){
        console.log(projects[i].nom);
        var tasks = projects[i].taches;

        for (var j = tasks.length - 1; j >= 0; j--) {
        
          if(tasks[j].collaborateurs.indexOf(idCurrentUser) > -1)
          {
            allUserTasks.push(tasks[j]);
        
            var diffUrgentTasks = utilsService.dateDiffWorkingDates(new Date(),new Date(tasks[j].date_fin_theorique));
            var diffUpcomingTasks = utilsService.dateDiffWorkingDates(new Date(),new Date(tasks[j].date_debut));
            switch (tasks[j].statut){
              case "Initial":
              {
                new_tasks.push(tasks[j]);
                if(diffUpcomingTasks > 0 && diffUpcomingTasks < 7)
                  upcoming_tasks.push(tasks[j]);
                break;
              }
              case "En cours":
              {
                if (diffUrgentTasks <= 3){
                  urgent_tasks.push(tasks[j]);
                }
                break;
              }
              case "Terminé(e)":
              {
                completed_tasks.push(tasks[j]);
                break;
              }
              case "Annulé(e)":
              {
                canceled_tasks.push(tasks[j]);
                break;
              }
            }
          }
        }
      }
    }
    vm.allTasks = allUserTasks;
    vm.urgentTasks = urgent_tasks;
    vm.upcomingTasks = upcoming_tasks;
    vm.completedTasks = completed_tasks;
    vm.canceledTasks = canceled_tasks;
    vm.newTasks = new_tasks;
  
    vm.nbNewTasks = new_tasks.length;
    vm.nbUrgentTasks = urgent_tasks.length;
    vm.nbUpcomingTasks = upcoming_tasks.length;
    vm.nbCompletedTasks = completed_tasks.length;
    vm.nbCanceledTasks = canceled_tasks.length;
    vm.nbTotalTasks = allUserTasks.length;
  
  }

  //vm.isFiltersEnabled = false;


  function showTasks(tasks){
    for (var i = tasks.length - 1; i >= 0; i--) {
      switch (tasks[i].statut)
        {
          case 'Initial': tasks[i].statut = statuts.initial;
          break;
          case 'En cours': tasks[i].statut = statuts.en_cours;
          break;
          case 'Terminé(e)': tasks[i].statut = statuts.termine;
          break;
          case 'Annulé(e)': tasks[i].statut = statuts.annule;
          break;
          case 'Archivé': tasks[i].statut = statuts.archive;
          break;
        }
      }
    vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: tasks });
  }


  function populatePage () {

    vm.numberProjects = vm.projects.length;

    var tasksCollaborator = [];

    for (var i = 0; i < vm.projects.length; i++) {

      // On calcule la durée du projet
      vm.projects[i].duration = statisticsService.getDuration(vm.projects[i]);

      vm.projects[i].leftDuration = statisticsService.getLeftDuration(vm.projects[i]);

      // On récupère les taches du projet courant
      var projectTasks = vm.projects[i].taches;

      var sumNowCostProject = 0;

      for (var j = 0; j < projectTasks.length; j++) {

        // On récupère la tache courante
        var currentTask = projectTasks[j];

        // On calcul le cout total de la tâche
        var totalCost = 0;
        var currentTaskDuration = statisticsService.getDuration(projectTasks[j]);

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
  }


  function showProgressBars() {
    var barConfig = {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1500,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: {width: '100%', height: '100%'},
        text: {
          style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#999',
            position: 'absolute',
            right: '0',
            top: '30px',
            padding: 0,
            margin: 0,
            transform: null
          },
          autoStyleContainer: false
        },
        from: {color: '#4caf50'},
        to: {color: '#ED6A5A'},
        step: (state, bar) => {
          bar.setText(Math.round(bar.value() * 100) + ' %');
          if(bar.value() > 1)
            bar.path.setAttribute('stroke', '#ED6A5A');
        }
    };

    // Projects
    var barBudgetProject = new ProgressBar.Line('#progressLineBudgetProject', barConfig);
    var barDateProject = new ProgressBar.Line('#progressLineDateProject', barConfig);

    // Tasks
    //var barBudgetTask = new ProgressBar.Line('#progressLineBudgetTask', barConfig);

    barBudgetProject.animate(1);
    barDateProject.animate(1);

    //barBudgetTask.animate(1);

  }


  // Au chargement de la page
  $scope.$on('$viewContentLoaded', function() {

    //  databaseService.getAllObjects('projects').success(function (data){ vm.saveProjects = data;})
    //  .error(function (err) { console.log(err); });

    databaseService.getAllObjects('collaborators').success(function(data){ vm.saveCollaborators = data;})
      .error(function (err) { console.log(err); });

    databaseService.getAllObjects('budgets').success(function(data){ vm.saveBudgets = data.data; })
      .error(function(err){ console.log(err); });

    databaseService.getCollaboratorProjects(idCurrentUser).success(function(data){ vm.projects = data;})
      .error(function(err){ console.log(err); });

    $timeout(function() {
      populatePage();
      allTasksDetails(vm.projects);
      showTasks(vm.allTasks);
      //showProgressBars();
    });

  });

};
