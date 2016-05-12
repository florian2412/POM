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
  
  function dateDiffWorkingDates(start,end){
    // if(start.getTime() == end.getTime()) return 1;
    if(dateDiff(start,end) === 1) return 1;

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

  function sumArrayValues(array) {
    var count = 0;
    for (var i = array.length; i--;) {
      count += array[i];
    }
    return count;
  }

  function filterOnlyWeekDays(date){
    var day = date.getDay();
    return (!(day === 0 || day === 6 ));
  }

}

