'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:TaskDetailsCtrl
 * @description
 * # TaskDetailsCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('TasksDetailsCtrl', TasksDetailsCtrl);

function TasksDetailsCtrl($scope, $state, $rootScope, $stateParams, $mdDialog, databaseService,  flashService, utilsService) {

  var vm = this;
  var collaborateursId = [];
  var currentProjectCollaborators = [];

  vm.updateTask = updateTask;
  vm.showCancelDialog = showCancelDialog;
  vm.showCollaboratorPicker = showCollaboratorPicker;
  vm.filterOnlyWeekDays = utilsService.filterOnlyWeekDays;
  vm.changedValue = changedValue;

  /**
   * Met à jour une tache d'un projet en base
   */
  function updateTask() {

    var updatedTask = vm.currentProject.taches[vm.currentIndexTask];
    updatedTask.libelle = vm.task.libelle;
    updatedTask.statut = vm.task.statut;
    updatedTask.description = vm.task.description;
    updatedTask.date_debut = vm.task.date_debut;
    updatedTask.date_fin_theorique = vm.task.date_fin_theorique;
    updatedTask.collaborateurs = collaborateursId;
    updatedTask.date_derniere_modif = new Date();

    if(updatedTask.statut === 'Terminé(e)') {
      updatedTask.date_fin_reelle = utilsService.returnValidDate(vm.task.date_fin_reelle);
    }

    databaseService.updateObject('projects', $stateParams.id, vm.currentProject)
      .success(function () {
        flashService.success("La tâche " + vm.task.libelle + " a été mise à jour.", "", "bottom-right", true, 4);
        $state.go("projects.details.tasks");
      });
  }

  /**
   * Affiche la boite de dialogue de confirmation d'annulation
   *
   * @param event
   */
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
  }

  /**
   * Affiche la boite de dialogue de sélection de collaborateurs a affecter à la tâche
   *
   * @param ev
   */
  function showCollaboratorPicker(ev) {

    $mdDialog.show({
      controller: _CollaboratorPickerController,
      templateUrl: 'views/shared/collaborators.picker.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false,
      locals: {
        collaborators: vm.collaborators
      }
    });
  }

  /**
   * Controller de la boite de dialogue de sélection de collaborateurs
   * @param $rootScope
   * @param $scope
   * @param $mdDialog
   * @param collaborators
     * @private
     */
  function _CollaboratorPickerController($rootScope, $scope, $mdDialog, collaborators) {

    $scope.collaborators = collaborators;
    $scope.selection = collaborateursId;
    $scope.hide = function() { $mdDialog.hide($scope.selection); };
    $scope.userRole = $rootScope.userRole;

    $scope.selectCollaborator = function (collaborator) {
      if(collaborateursId.indexOf(collaborator._id) < 0) {
        collaborateursId.push(collaborator._id);
        collaborator.checked = true;
      } else {
        collaborator.checked = false;
        var indexCol =  collaborateursId.indexOf(collaborator._id);
        if (indexCol > -1) { collaborateursId.splice(indexCol, 1); }
      }
    };
  }

  function changedValue(selected){
    vm.isDateReelleEnable = (selected === "Terminé(e)");
  }

  /**
   * Méthode lancée lorsque la page est chargée
   */
  $scope.$on('$viewContentLoaded', function() {

    databaseService.getObjectById('projects', $stateParams.id)
      .success(function (data) {

        var currentProjectColl = data.collaborateurs;
        var tasks = data.taches;
        var indexTaskToDisplay = utilsService.arrayObjectIndexOf(tasks, $stateParams.idtask, "_id");
        var task = tasks[indexTaskToDisplay];

        // Récupère les collaborateurs associés à la tâche
        for (var i = currentProjectColl.length - 1; i >= 0; i--) {
          databaseService.getObjectById('collaborators', currentProjectColl[i])
            .success(function(data){
              currentProjectCollaborators.push(data);
            });
        }
        vm.collaborators = currentProjectCollaborators;
        vm.currentProject = data;
        vm.minDate =  new Date(task.date_debut);
        vm.currentIndexTask = indexTaskToDisplay;
        vm.task = task;
        collaborateursId = task.collaborateurs;

        //calcul du cout
        vm.task_cost = utilsService.dateDiffWorkingDates(new Date(task.date_debut),new Date(task.date_fin_theorique));
        utilsService.convertDateStringsToDates(task);
      })
      .error(function (err) {
        console.log(err);
      });

    // On récupère les settings
    databaseService.getSettings('statuts').success(function(data){
      data.splice(data.indexOf("Archivé(e)"),1);
      for (var i = data.length - 1; i >= 0; i--) {

        switch (data[i]){
          case "Initial":
            data[i] = utilsService.statusColors().initial;
            break;
          case "En cours":
            data[i] = utilsService.statusColors().en_cours;
            break;
          case "Terminé(e)":
            data[i] = utilsService.statusColors().termine;
            break;
          case "Annulé(e)":
            data[i] = utilsService.statusColors().annule;
            break;
        }
      }
      vm.statuts = data;

    });
  });

}
