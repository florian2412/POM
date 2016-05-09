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
  service.countProjectsByStatusFromStatus = countProjectsByStatusFromStatus;
  service.calculTaskTotalCost = calculTaskTotalCost;
  service.calculTaskDuration = calculTaskDuration;
  service.calculTaskPassedDuration = calculTaskPassedDuration;
  service.calculProjectDuration = calculProjectDuration;
  service.calculProjectLeftDuration = calculProjectLeftDuration;

  return service;

  function taskStats(task, currentTask, saveCollaborators, totalCost) {

    task.duration = calculTaskDuration(task);

    if (task.statut === 'Initial') {
      task.leftDuration = task.duration; // OK
      task.nowCost = 0; // OK
      task.totalCost = 0;
      task.passedDuration = 0; // OK
    }
    else if (task.statut === 'En cours') {
      task.passedDuration = calculTaskPassedDuration(task);
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

      project.passedDuration = calculTaskPassedDuration(project);
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



  function countProjectsByStatusFromStatus(numberProjectsByStatuts) {
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

  // Retourne le cout total d'une tache par rapport à la durée et aux collaborateurs affecté
  function calculTaskTotalCost(task, saveCollaborators) {
    var taskTotalCost = 0;
    var currentTaskDuration = calculProjectDuration(task);
    for (var l = 0; l < task.collaborateurs.length; l++) {
      var currentCollaboratorId = task.collaborateurs[l];
      var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(saveCollaborators, currentCollaboratorId, '_id');
      var currentCollaborator = -1;
      if (indexCurrentCollaborator > -1)
        currentCollaborator = saveCollaborators[indexCurrentCollaborator];
      taskTotalCost += currentCollaborator.cout_horaire * 7 * currentTaskDuration;
    }
    return taskTotalCost;
  }

  // Retourne la durée totale théorique d'une tache
  function calculTaskDuration(task) {
    var firstDate = new Date(task.date_debut);
    var endDate = new Date(task.date_fin_theorique);
    return utilsService.dateDiff(firstDate, endDate);
  };

  // Retourne la durée restante théorique d'une tache
  /*function calculTaskLeftDuration(task) {
   var firstDate = new Date();
   var endDate = new Date(task.date_fin_theorique);
   return utilsService.dateDiff(firstDate, endDate);
   };*/

  // Retourne la durée déjà passée théorique d'une tache
  function calculTaskPassedDuration(task) {
    var firstDate = new Date(task.date_debut);
    var endDate = new Date();

    // -2 car on enlève la date du jour et le +1 que ajoute au retour de la fonction dateDiff
    var diff = utilsService.dateDiff(firstDate, endDate) - 2;

    // Si la tache a commencé avant aujourd'hui
    if(diff > 0)
      return diff;
    // Si la tache commence aujourd'hui
    else
      return diff + 1;
  };

  // Retourne la durée totale théorique d'un projet
  function calculProjectDuration(project) {
    var firstDate = new Date(project.date_debut);
    var endDate = new Date(project.date_fin_theorique);
    return utilsService.dateDiff(firstDate, endDate);
  };

  // Retourne la durée restante théorique d'un projet
  function calculProjectLeftDuration(project) {
    var firstDate = new Date();
    var endDate = new Date(project.date_fin_theorique);
    return utilsService.dateDiff(firstDate, endDate);
  };

}
