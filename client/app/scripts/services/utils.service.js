/**
 * Created by sarra on 28/04/2016.
 */
'use strict';

/**
 * @ngdoc service
 * @name pomApp.utils
 * @description
 * # utils
 * Service in the pomApp for utils methods.
 */
angular.module('pomApp').factory('utilsService', Service);

function Service() {

  var service = {};

  service.convertDateStringsToDates = convertDateStringsToDates;
  service.arrayObjectIndexOf = arrayObjectIndexOf;
  service.dateDiff = dateDiff;
  service.capitalize = capitalize;
  service.calculProjectDuration = calculProjectDuration;
  service.calculProjectLeftDuration = calculProjectLeftDuration;
  service.calculTaskPassedDuration = calculTaskPassedDuration;
  service.calculTaskDuration = calculTaskDuration;

  return service;

  function convertDateStringsToDates(input) {
    var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
      if (!input.hasOwnProperty(key)) continue;

      var value = input[key];
      var match;
      // Check for string properties which look like dates.
      // TODO: Improve this regex to better match ISO 8601 date strings.
      if (typeof value === "string" && (match = value.match(regexIso8601))) {
        // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
          input[key] = new Date(milliseconds);
        }
      } else if (typeof value === "object") {
        // Recurse into object
        convertDateStringsToDates(value);
      }
    }
  };

  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  };

  function dateDiff(date1, date2){
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays === 1)
      return diffDays;
    else
      return diffDays + 1;
  }

  function capitalize(word){
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  }

  // Retourne la durée totale théorique d'une tache
  function calculTaskDuration(task) {
    var firstDate = new Date(task.date_debut);
    var endDate = new Date(task.date_fin_theorique);
    return dateDiff(firstDate, endDate);
  };

  // Retourne la durée restante théorique d'une tache
  /*function calculTaskLeftDuration(task) {
   var firstDate = new Date();
   var endDate = new Date(task.date_fin_theorique);
   return dateDiff(firstDate, endDate);
   };*/

  // Retourne la durée déjà passée théorique d'une tache
  function calculTaskPassedDuration(task) {
    var firstDate = new Date(task.date_debut);
    var endDate = new Date();

    // -2 car on enlève la date du jour et le +1 que ajoute au retour de la fonction dateDiff
    var diff = dateDiff(firstDate, endDate) - 2;

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
    return dateDiff(firstDate, endDate);
  };

  // Retourne la durée restante théorique d'un projet
  function calculProjectLeftDuration(project) {
    var firstDate = new Date();
    var endDate = new Date(project.date_fin_theorique);
    return dateDiff(firstDate, endDate);
  };





}

