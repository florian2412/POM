'use strict';

/**
 * @ngdoc service
 * @name pomApp.utils
 * @description
 * # utils
 * Service in the pomApp for utils methods.
 */
angular.module('pomApp').factory('statisticsService', Service);

function Service(utilsService) {

  var service = {};

  service.projectStats = projectStats;
  service.taskStats = taskStats;

  return service;

  function taskStats(task, currentTask, saveCollaborators, totalCost) {

    task.duration = utilsService.calculTaskDuration(task);

    if (task.statut === 'Initial') {
      task.leftDuration = task.duration; // OK
      task.nowCost = 0; // OK
      task.totalCost = 0;
      task.passedDuration = 0; // OK
    }
    else if (task.statut === 'En cours') {
      task.passedDuration = utilsService.calculTaskPassedDuration(task);
      task.leftDuration = task.duration - task.passedDuration;
      task.totalCost = totalCost;

      var nowCost = 0;
      // Calcul du cout de la tâche à l'insant t = now
      for(var l = 0; l < currentTask.collaborateurs.length; l++) {
        var currentCollaboratorId = currentTask.collaborateurs[l];
        var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(saveCollaborators, currentCollaboratorId, '_id');
        var currentCollaborator = -1;
        if(indexCurrentCollaborator > -1)
          currentCollaborator = saveCollaborators[indexCurrentCollaborator];
        nowCost += currentCollaborator.cout_horaire * 7 * task.passedDuration;
      }

      task.nowCost = nowCost;

      // On arrondi au chiffre inférieur
      var advancement = Math.round((nowCost * 100) / totalCost);

      task.advancement = advancement;

    }
    else if (task.statut === 'Terminé(e)') {
      task.leftDuration = 0; // OK
      task.nowCost = 0; // OK
      task.totalCost = totalCost;
      task.passedDuration = task.duration; // OK
    }
    else if (task.statut === 'Annulé(e)') {
      task.leftDuration = 0; // OK
      task.nowCost = 0; // OK
      task.totalCost = 0;
      task.passedDuration = 0; // OK
    }

    return task;
  };


  function projectStats(project, saveBudgets, sumNowCostProject) {
    if (project.statut === 'Initial') {
      console.log('Statut projet : Initial')
    }


    else if (project.statut === 'En cours') {
      
      project.passedDuration = utilsService.calculTaskPassedDuration(project);
      project.timeAdvancement = Math.round((project.passedDuration * 100) / project.duration);
      project.leftDuration = project.duration - project.passedDuration;

      // Calcul de l'avancement du projet en pourcentage du budget et en pourcentage de date
      var indexBudgetLineProject = utilsService.arrayObjectIndexOf(saveBudgets, project.ligne_budgetaire.id, '_id');
      var budgetLine = 0;
      if(indexBudgetLineProject > -1)
        budgetLine = saveBudgets[indexBudgetLineProject];

      project.advancement = Math.round((sumNowCostProject * 100) / budgetLine.montant);

    }


    else if (project.statut === 'Terminé(e)') {
      console.log('Statut projet : Terminé(e)')
    }
    else if (project.statut === 'Annulé(e)') {
      console.log('Statut projet : Annulé(e)')
    }
    else if (project.statut === 'Archivé') {
      console.log('Statut projet : Archivé')
    }

    return project;
  };

}
