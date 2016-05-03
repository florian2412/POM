'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('TasksDetailsCtrl', TasksDetailsCtrl);

function TasksDetailsCtrl($scope, $state, $stateParams, $mdDialog, databaseService,  flashService, utilsService) {

  var vm = this;

  vm.updateTask = updateTask;
  vm.showCancelDialog = showCancelDialog;

  function updateTask() {

    var tasksList = vm.currentProject.taches;
    var t = tasksList[vm.currentIndexTask];
    t.libelle = vm.task.libelle;
    t.statut = vm.task.statut;
    t.description = vm.task.description;
    t.date_debut = vm.task.date_debut;
    t.date_fin_theorique = vm.task.date_fin_theorique;
    t.date_fin_reelle = vm.task.date_fin_reelle;
    t.date_derniere_modif = new Date();

    databaseService.updateObject('projects', $stateParams.id, vm.currentProject)
      .success(function (data) {
        flashService.success("La tâche " + vm.task.libelle + " a été mise à jour.", "", "bottom-right", true, 4);
        $state.go("projects.details.tasks");
      })
      .error(function (err) {
        console.log(err);
      });
  };

  function showCancelDialog(event) {

    var confirm = $mdDialog.confirm()
      .title('Alerte')
      .textContent('Etes-vous sûr d\'annuler la modification de la tâche ?')
      .ariaLabel('Annulation')
      .targetEvent(event)
      .ok('Oui')
      .cancel('Non');

    $mdDialog.show(confirm).then(function() {
      $state.go("projects.details.tasks");
    }, function() {

    });
  };

  $scope.$on('$viewContentLoaded', function() {

    databaseService.getObjectById('projects', $stateParams.id)
      .success(function (data) {

        vm.currentProject = data;
        vm.minDateTask =  new Date(data.date_debut);

        var tasks = data.taches;

        var indexTaskToDisplay = utilsService.arrayObjectIndexOf(tasks, $stateParams.idtask, "_id");
        vm.currentIndexTask = indexTaskToDisplay;

        var task = tasks[indexTaskToDisplay];

        //calcul du cout
        vm.task_cost =  utilsService.dateDiff(new Date(task.date_debut),new Date(task.date_fin_theorique));

        utilsService.convertDateStringsToDates(task);
        vm.task = task;

      })
      .error(function (err) {
        console.log(err);
      });


    databaseService.getSettings('statuts').success(function(data){ vm.statuts = data; })
      .error(function(err){ console.log(err); });

  });

};
