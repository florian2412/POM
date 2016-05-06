'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, $timeout, localStorageService, databaseService, utilsService, statisticsService) {

    var vm = this;
    var currentUser = localStorageService.get('currentUser');

    $scope.user = localStorageService.get('currentUser').pseudo;
    var idCurrentUser = localStorageService.get('currentUser')._id;

    function populatePage () {

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

      //  databaseService.getAllObjects('projects').success(function (data){ vm.saveProjects = data.data;})
      //  .error(function (err) { console.log(err); });

      databaseService.getAllObjects('collaborators').success(function(data){ vm.saveCollaborators = data;})
        .error(function (err) { console.log(err); });

      databaseService.getAllObjects('budgets').success(function(data){ vm.saveBudgets = data.data; })
        .error(function(err){ console.log(err); });

      databaseService.getCollaboratorProjects(idCurrentUser).success(function(data){ vm.projects = data; })
        .error(function(err){ console.log(err); });

      $timeout(function() {
        populatePage();


        //showProgressBars();




      });

    });

  });
