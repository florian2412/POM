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

/**
 * Service donnant accès à des méthodes utilitaires utilisées dans tout le projet
 *
 * @param $filter
 * @returns {{}}
 * @constructor
 */
function Service($filter) {

  var service = {};

  service.convertDateStringsToDates = convertDateStringsToDates;
  service.arrayObjectIndexOf = arrayObjectIndexOf;
  service.dateDiff = dateDiff;
  service.dateDiffWorkingDates = dateDiffWorkingDates;
  service.capitalize = capitalize;
  service.addZero = addZero;
  service.getElementById = getElementById;
  service.sumArrayValues = sumArrayValues;
  service.filterOnlyWeekDays = filterOnlyWeekDays;
  service.statusColors = statusColors;
  service.categoriesColors = categoriesColors;
  service.associateChefProjet = associateChefProjet;
  service.returnValidDate = returnValidDate;

  return service;

  /**
   * Convertit des dates au format String en objet Date javascript
   *
   * @param input
   * @returns {*}
   */
  function convertDateStringsToDates(input) {
    var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
      if (!input.hasOwnProperty(key)) continue;

      var value = input[key];
      var match;
      // Check for string properties which look like dates.
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
  }

  /**
   * Retourne l'index d'un objet contenu dans une liste selon une propriété de cet objet
   *
   * @param myArray
   * @param searchTerm
   * @param property
   * @returns {number}
   */
  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  /**
   * Calcul le nombre de jours de différence entre deux dates
   *
   * @param date1
   * @param date2
   * @returns {number}
   */
  function dateDiff(date1, date2){
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays === 1)
      return diffDays;
    else
      return diffDays + 1;
  }

  /**
   * Calcul le nombre de jours ouvrés entre deux date
   *
   * @param start
   * @param end
   * @returns {number}
   */
  function dateDiffWorkingDates(start,end){
    if(dateDiff(start, end) === 1) return 1;

    var curDate, endDate;
    var count = 0, n = 1;

    if(start > end){
      curDate = end; endDate = start;
      n = -1;
    } else { curDate = start; endDate = end; }

    while (curDate <= endDate) {
      var dayOfWeek = curDate.getDay();
      if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
        count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return (count + 1)*n;
  }

  function capitalize(word){
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  }

  function addZero(str, max) {
    str = str.toString();
    return str.length < max ? addZero("0" + str, max) : str;
  }

  function getElementById(id, list){
    return $filter('filter')(list, function (d) {return d._id === id;})[0]
  }

  /**
   * Retourne la somme des valeurs d'un tableau
   *
   * @param array
   * @returns {number}
   */
  function sumArrayValues(array) {
    var count = 0;
    for (var i = array.length; i--;) {
      count += array[i];
    }
    return count;
  }

  /**
   * Permet de filrer les dates pour ne garder que les jours ouvrés
   *
   * @param date
   * @returns {boolean}
   */
  function filterOnlyWeekDays(date){
    var day = date.getDay();
    return (!(day === 0 || day === 6 ));
  }

  /**
   * Coloration en fonction d'un statut
   *
   * @returns {{initial: {color: string, class: string, statut: string}, en_cours: {color: string, class: string, statut: string}, termine: {color: string, class: string, statut: string}, annule: {color: string, class: string, statut: string}, archive: {color: string, class: string, statut: string}}}
   */
  function statusColors(){
    return {"initial": { "color": "blue", "class": "fa fa-info", "statut": "Initial" },
      "en_cours": { "color": "orange", "class": "fa fa-cog fa-spin fa-fw margin-bottom", "statut":"En cours" },
      "termine": { "color": "green", "class": "fa fa-check-circle","statut": "Terminé(e)" },
      "annule": { "color": "red", "class": "fa fa-times-circle", "statut": "Annulé(e)" },
      "archive": { "color": "gray", "class": "fa fa-file-archive-o", "statut": "Archivé" }
    };
  }

  /**
   * Coloration en fonction d'une catégorie
   *
   * @returns {{etude: {color: string, name: string}, spec: {color: string, name: string}, dev: {color: string, name: string}, rec: {color: string, name: string}, mep: {color: string, name: string}}}
   */
  function categoriesColors(){
    return {  "etude" : { "color" : "#EF5350", "name" : "Etude de projet" },
      "spec" : { "color" : "#FFA726", "name" : "Spécification" },
      "dev" : { "color" : "#29B6F6", "name" : "Développement" },
      "rec" : { "color" : "#FDD835", "name" : "Recette" },
      "mep" : { "color" : "#66BB6A", "name" : "Mise en production" }};
  }

  /**
   * Récupère le chef de projet d'un collaborateur selon son id
   *
   * @param data
   * @param allCollaborators
   */
  function associateChefProjet(data, allCollaborators){
    for (var i = data.length - 1; i >= 0; i--) {
      var cp = getElementById(data[i].chef_projet, allCollaborators);
      data[i].chef_projet = { "identite": cp.prenom + ' ' + cp.nom, "nom" : cp.nom, "prenom" : cp.prenom, "id": cp._id };

      switch (data[i].statut)
      {
        case 'Initial': data[i].statut = statusColors().initial;
          break;
        case 'En cours': data[i].statut = statusColors().en_cours;
          break;
        case 'Terminé(e)': data[i].statut = statusColors().termine;
          break;
        case 'Annulé(e)': data[i].statut = statusColors().annule;
          break;
        case 'Archivé': data[i].statut = statusColors().archive;
          break;
      }
    }
  }

  /**
   * Vérifie qu'une date javascript est valide, sinon retourne la date du jour
   *
   * @param date
   * @returns {*}
   */
  function returnValidDate(date) {
    if ( Object.prototype.toString.call(date) === "[object Date]" ) {
      if ( isNaN( date.getTime() ) ) {  // d.valueOf() could also work
        return new Date();
      }
      else {
        return date;
      }
    }
    else {
      return new Date();
    }
  }
}

