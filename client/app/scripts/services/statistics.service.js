'use strict';

/**
 * @ngdoc service
 * @name pomApp.statistics
 * @description
 * # utils
 * Service in the pomApp for statstics methods.
 */
angular.module('pomApp').factory('statisticsService', Service);

/**
 * Service permettant de générer diverse statistiques
 *
 * @param utilsService
 * @returns {{}}
 * @constructor
 */
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

  /**
   * Génère des données de temps et de budget sur une tâche
   *
   * @param task
   * @param saveCollaborators
   * @returns {*}
   */
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

  /**
   * Génère des données de temps et de budget sur un projet
   *
   * @param project
   * @param saveBudgets
   * @param sumCostTasksProject
   * @returns {*}
   */
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
        project.passedDuration = project.duration;
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

  /**
   * Génère un format de données pour générer des graphiques
   *
   * @param numberObjectsByTerm
   * @returns {*[]}
   */
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

  /**
   * Retourne le cout total d'une tache par rapport à la durée et aux collaborateurs affecté
   *
   * @param task
   * @param saveCollaborators
   * @returns {number}
   */
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

  /**
   * Retoure la durée théorique déjà passée d'un projet ou d'une tâche
   *
   * @param object
   * @returns {*}
   */
  function getSpentTime(object) {
    var start = new Date(object.date_debut);
    var end = new Date();
    return utilsService.dateDiffWorkingDates(start, end);
  }

  /**
   * Retourne la durée total réelle d'un projet ou d'une tâche
   *
   * @param object
   * @returns {*}
   */
  function getTotalRealTime(object) {
    var start = new Date(object.date_debut);
    var end = new Date(object.date_fin_reelle);
    return utilsService.dateDiffWorkingDates(start,end);
  }

  /**
   * Retourne la durée totale théorique d'un projet ou d'une tâche
   *
   * @param object
   * @returns {*}
   */
  function getDuration(object) {
    var start = new Date(object.date_debut);
    var end = new Date(object.date_fin_theorique);
    return utilsService.dateDiffWorkingDates(start,end);
  }

  /**
   * Calcul le pourcentage d'une ligne budgétaire utilisé en fonction des projets qui y sont affectés
   *
   * @param budget
   * @param projects
   * @param collaborators
   * @returns {*}
   */
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
