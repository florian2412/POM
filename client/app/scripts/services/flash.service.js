(function () {
  'use strict';

  angular.module('pomApp').factory('flashService', Service);

  /**
   * Service permettant d'afficher une petite boite de validation (Toast) lors de la création d'un projet par exemple
   *
   * @param $alert
   * @returns {{}}
   * @constructor
   */
  function Service($alert) {
    var service = {};

    service.success = success;
    service.error = error;
    service.info = info;

    return service;

    function success(title, message, placement, dismissable, duration)  {
      $alert({
        title: title,
        content: message,
        placement: placement,
        type: 'success',
        keyboard: true,
        container:'body',
        duration : duration,
        dismissable : dismissable
      });
    }

    function error(title,message,placement, dismissable,duration)  {
      $alert({
        title: title,
        content: message,
        placement: placement,
        type: 'danger',
        keyboard: true,
        container:'body',
        duration : duration,
        dismissable : dismissable
      });
    }

    function info(title,message,placement, dismissable,duration) {
      $alert({
        title: title,
        content: message,
        placement: placement,
        type: 'info',
        keyboard: true,
        container:'body',
        duration : duration,
        dismissable : dismissable
      });
    }
  }

})();
