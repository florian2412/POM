'use strict';

/**
 * @ngdoc directive
 * @name pomApp.loading.directive
 * @description
 */

angular.module('pomApp')
  .directive('loading', function () {
    return {
      template: '<div>' +
      '<div ng-show="loading" class="loading-container">' +
      //'<img ng-src="../images/loader.gif"/>' +
      '</div>' +
      '<div ng-hide="loading" ng-transclude>' +
      '</div>' +
      '</div>',
      restrict: 'A',
      transclude: true,
      replace: true,
      scope:{
        loading: "=loading"
      },
      compile: function compile(element, attrs, transclude){
        var spinner = new Spinner().spin();
        var loadingContainer = element.find(".loading-container")[0];
        loadingContainer.appendChild(spinner.el);
      }
    };
  });
