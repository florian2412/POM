'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('MainCtrl',MainCtrl);

function MainCtrl($scope, $state, $rootScope, $timeout, localStorageService, databaseService, utilsService, statisticsService, NgTableParams) {

  var vm = this;
  vm.showTasks = showTasks;
  vm.redirectTasksDetails = redirectTasksDetails;
  vm.redirectProjectsDetails = redirectProjectsDetails;
  //vm.isFiltersEnabled = false;

  var currentUser = localStorageService.get('currentUser');
  var idCurrentUser = localStorageService.get('currentUser')._id;

  function redirectTasksDetails(event,taskId, projectId){
    $state.go('projects.details.tasks.details',{"idtask":taskId, "id":projectId});
  }

  function allTasksDetails(projects){

    var urgent_tasks = [], completed_tasks = [], upcoming_tasks = [], new_tasks = [], canceled_tasks = [];
    var allUserTasks = [];

    for (var i = projects.length - 1; i >= 0; i--) {

      if(projects[i].statut === "En cours"){
        console.log(projects[i].nom);
        var tasks = projects[i].taches;

        for (var j = tasks.length - 1; j >= 0; j--) {

          if(tasks[j].collaborateurs.indexOf(idCurrentUser) > -1)
          {
            allUserTasks.push(tasks[j]);

            var diffUrgentTasks = utilsService.dateDiffWorkingDates(new Date(),new Date(tasks[j].date_fin_theorique));
            var diffUpcomingTasks = utilsService.dateDiffWorkingDates(new Date(),new Date(tasks[j].date_debut));
            switch (tasks[j].categorie)
            {
              case 'Etude de projet': tasks[j].categorie = utilsService.categoriesColors().etude;
                break;
              case 'Spécification': tasks[j].categorie = utilsService.categoriesColors().spec;
                break;
              case 'Développement': tasks[j].categorie = utilsService.categoriesColors().dev;
                break;
              case 'Recette': tasks[j].categorie = utilsService.categoriesColors().rec;
                break;
              case 'Mise en production': tasks[j].categorie = utilsService.categoriesColors().mep;
                break;
            }
            switch (tasks[j].statut){
              case "Initial":
              {
                new_tasks.push(tasks[j]);
                tasks[j].statut = utilsService.statusColors().initial;
                if(diffUpcomingTasks > 0 && diffUpcomingTasks < 7)
                  upcoming_tasks.push(tasks[j]);
                break;
              }
              case "En cours":
              {
                tasks[j].statut = utilsService.statusColors().en_cours;
                if (diffUrgentTasks <= 3){
                  urgent_tasks.push(tasks[j]);
                }
                break;
              }
              case "Terminé(e)":
              {
                tasks[j].statut = utilsService.statusColors().termine;
                completed_tasks.push(tasks[j]);
                break;
              }
              case "Annulé(e)":
              {
                tasks[j].statut = utilsService.statusColors().annule;
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

  function showTasks(tasks){
    vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: tasks });
  }

  function showProjects(projects){
    vm.tableProjectsParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: projects});
  }

  function showCollaboratorTasks(tasks) {
    vm.tableTasksParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: tasks });
  }

  // Récupère dans vm.collaboratorTasks, toutes les tâches auxquels le currentUser est affecté
  function allCollaboratorTasks() {
    var collaboratorTasks = [];
    for (var i = 0; i < vm.projects.length; i++) {
      // On récupère les taches du projet courant
      var projectTasks = vm.projects[i].taches;
      for (var j = 0; j < projectTasks.length; j++) {
        // On cherche l'index de l'id du user dans la listes des collaborateurs de la tache
        var indexCurrentUserInTask = projectTasks[j].collaborateurs.indexOf(idCurrentUser);
        // Si > -1 alors le current user est assigné à la tâche
        if (indexCurrentUserInTask > -1) {
          //projectTasks[j] = statisticsService.taskStats(projectTasks[j], vm.saveCollaborators);
          collaboratorTasks.push(projectTasks[j]);
        }
      }
    }
    vm.collaboratorTasks = collaboratorTasks;
  }

  function allProjectsDetails () {
    vm.numberProjects = vm.projects.length;
    for (var i = 0; i < vm.projects.length; i++) {
      // On calcule la durée du projet
      vm.projects[i].duration = statisticsService.getDuration(vm.projects[i]);

      // On récupère les taches du projet courant
      var projectTasks = vm.projects[i].taches;
      var sumTotalCostProject = 0;

      for (var j = 0; j < projectTasks.length; j++) {
        // On calcul le cout total de la tâche et la durée théorique
        // On calcule la durée du projet
        projectTasks[j].duration = statisticsService.getDuration(projectTasks[j]);
        projectTasks[j].totalCost = statisticsService.calculTaskTotalCost(projectTasks[j], vm.saveCollaborators);
        projectTasks[j] = statisticsService.taskStats(projectTasks[j], vm.saveCollaborators);
        sumTotalCostProject += projectTasks[j].totalCost;
      }
      vm.projects[i] = statisticsService.projectStats(vm.projects[i], vm.saveBudgets, sumTotalCostProject);
    }
  }

  function redirectProjectsDetails(event,id){
    $state.go('projects.details.info',{"id":id});
  }

// Au chargement de la page
  $scope.$on('$viewContentLoaded', function() {

    databaseService.getAllObjects('collaborators').success(function(data){ vm.saveCollaborators = data;})
      .error(function (err) { console.log(err); });

    databaseService.getAllObjects('budgets').success(function(data){ vm.saveBudgets = data.data; })
      .error(function(err){ console.log(err); });

    databaseService.getCollaboratorProjects(idCurrentUser).success(function(data){vm.projects = data;})
      .error(function(err){ console.log(err); });

    $timeout(function() {
      allProjectsDetails();
      allTasksDetails(vm.projects);
      allCollaboratorTasks();

      showTasks(vm.allTasks);
      showProjects(vm.projects);
      showCollaboratorTasks(vm.collaboratorTasks);

      utilsService.associateChefProjet(vm.projects, vm.saveCollaborators);
    });

  });

};
