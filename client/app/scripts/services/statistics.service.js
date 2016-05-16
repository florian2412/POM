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
  service.calculTaskTotalCost = calculTaskTotalCost;
  service.getSpentTime = getSpentTime;
  service.getDuration = getDuration;
  service.getTotalRealTime = getTotalRealTime;
  service.countObjectsByTermFromNbTerm = countObjectsByTermFromNbTerm;
  service.calculateBudgetConsumption = calculateBudgetConsumption;

  return service;

  function taskStats(task, saveCollaborators) {
    switch (task.statut) {
      case "Initial":
      {
        task.leftDuration = task.duration;
        task.passedDuration = 0;
        task.advancement = 0;
        task.timeAdvancement = 0;
        task.realDuration = 0;

        break;
      }
      case "En cours":
      {
        task.passedDuration = getSpentTime(task);
        task.leftDuration = task.duration - task.passedDuration;
        task.timeAdvancement = Math.round((task.passedDuration * 100) / task.duration);
        task.realDuration = task.passedDuration;

        var nowCost = 0;
        // Calcul du cout de la tâche à l'insant t = now
        for (var l = 0; l < task.collaborateurs.length; l++) {
          var currentCollaboratorId = task.collaborateurs[l];
          var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(saveCollaborators, currentCollaboratorId, '_id');
          var currentCollaborator = -1;
          if (indexCurrentCollaborator > -1)
            currentCollaborator = saveCollaborators[indexCurrentCollaborator];
          nowCost += currentCollaborator.cout_horaire * 7 * task.passedDuration;
        }

        task.nowCost = nowCost;

        // On arrondi au chiffre inférieur
        task.advancement = Math.round((nowCost * 100) / task.totalCost);

        break;
      }
      case "Terminé(e)":
      {
        task.leftDuration = 0;
        task.realDuration = getTotalRealTime(task);
        task.passedDuration = getTotalRealTime(task);
        task.timeAdvancement = Math.round((task.realDuration * 100) / task.duration);


        var nowCost = 0;
        // Calcul du cout de la tâche à l'insant t = now
        for (var l = 0; l < task.collaborateurs.length; l++) {
          var currentCollaboratorId = task.collaborateurs[l];
          var indexCurrentCollaborator = utilsService.arrayObjectIndexOf(saveCollaborators, currentCollaboratorId, '_id');
          var currentCollaborator = -1;
          if (indexCurrentCollaborator > -1)
            currentCollaborator = saveCollaborators[indexCurrentCollaborator];
          nowCost += currentCollaborator.cout_horaire * 7 * task.passedDuration;
        }

        task.nowCost = nowCost;
        task.advancement = Math.round((nowCost * 100) / task.totalCost);
        // Avancement par rapport au budget
        //task.advancement = 100;

        break;
      }
      case "Annulé(e)":
      {
        task.leftDuration = 0;
        task.passedDuration = 0;
        task.advancement = 0;
        task.timeAdvancement = 0;
        task.realDuration = 0;

        break;
      }
    }

    return task;
  }

  function projectStats(project, saveBudgets, sumCostTasksProject) {
    switch (project.statut){
      case "Initial":
      {
        project.passedDuration = 0;
        project.timeAdvancement = 0;
        project.leftDuration = project.duration;
        project.realDuration = 0;
        project.advancement = 0;

        break;
      }
      case "En cours":
      {
        project.passedDuration = getSpentTime(project);
        project.timeAdvancement = Math.round((project.passedDuration * 100) / project.duration);
        project.leftDuration = project.duration - project.passedDuration;

        // Calcul de l'avancement du projet en pourcentage du budget
        var indexBudgetLineProject = utilsService.arrayObjectIndexOf(saveBudgets, project.ligne_budgetaire.id, '_id');
        var budgetLine = 0;
        if(indexBudgetLineProject > -1)
          budgetLine = saveBudgets[indexBudgetLineProject];

        project.advancement = Math.round((sumCostTasksProject * 100) / budgetLine.montant);
        project.realDuration = project.passedDuration;

        break;
      }
      case "Terminé(e)":
      {
        project.passedDuration = getTotalRealTime(project);
        project.realDuration = getTotalRealTime(project);
        project.leftDuration = 0;
        project.timeAdvancement = Math.round((project.realDuration * 100) / project.duration);

        // Calcul de l'avancement du projet en pourcentage du budget
        var indexBudgetLineProject = utilsService.arrayObjectIndexOf(saveBudgets, project.ligne_budgetaire.id, '_id');
        var budgetLine = 0;
        if(indexBudgetLineProject > -1)
          budgetLine = saveBudgets[indexBudgetLineProject];

        project.advancement = Math.round((sumCostTasksProject * 100) / budgetLine.montant);

        break;
      }
      case "Annulé(e)":
      {
        project.passedDuration = 0;
        project.timeAdvancement = 0;
        project.leftDuration = 0;
        project.realDuration = 0;
        project.advancement = 0;

        break;
      }
    }
    return project;
  }

  function countObjectsByTermFromNbTerm(numberObjectsByTerm) {
    var a = [];
    var b = [];
    var prev;
    numberObjectsByTerm.sort();
    for (var j = 0; j < numberObjectsByTerm.length; j++) {
      if (numberObjectsByTerm[j] !== prev) {
        a.push(numberObjectsByTerm[j]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = numberObjectsByTerm[j];
    }
    return [a, b];
  }

  // Retourne le cout total d'une tache par rapport à la durée et aux collaborateurs affecté
  function calculTaskTotalCost(task, saveCollaborators) {
    var taskTotalCost = 0;
    var currentTaskDuration = getDuration(task);
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

  // Retourne la durée déjà passée théorique
  function getSpentTime(object) {
    var start = new Date(object.date_debut);
    var end = new Date();

    // -2 car on enlève la date du jour et le +1 que ajoute au retour de la fonction dateDiff
    var diff = utilsService.dateDiffWorkingDates(start, end) - 2;

    // Si la tache a commencé avant aujourd'hui
    if(diff > 0)
      return diff;
    // Si la tache commence aujourd'hui
    else
      return diff + 1;
  }

  // Retourne la durée déjà passée théorique
  function getTotalRealTime(object) {
    var start = new Date(object.date_debut);
    var end = new Date(object.date_fin_reelle);
    return utilsService.dateDiffWorkingDates(start,end);
  }

  // Retourne la durée totale théorique
  function getDuration(object) {
    var start = new Date(object.date_debut);
    var end = new Date(object.date_fin_theorique);
    return utilsService.dateDiffWorkingDates(start,end);
  }

  // Retourne la durée restante théorique
  /*function getLeftDuration(object) {
    var start = new Date();
    var end = new Date(object.date_fin_theorique);

    return utilsService.dateDiffWorkingDates(start, end);
  }*/

  function calculateBudgetConsumption(budget, projects, collaborators){
    var tasksCost = [];
    var tasksTotalCost;
    var budgetConsumption, result;

    for (var i = projects.length - 1; i >= 0; i--) {
      if(budget._id === projects[i].ligne_budgetaire.id)
      {
        if(projects[i].taches.length > 0){
          for (var j  = 0; j < projects[i].taches.length; j ++) {
            tasksCost.push(calculTaskTotalCost(projects[i].taches[j], collaborators));
          }
        }
        tasksTotalCost = utilsService.sumArrayValues(tasksCost);
        budgetConsumption = budget.montant - tasksTotalCost;
        result = 1 - (budgetConsumption / budget.montant);
      }

    }
    return result;
  }

}
