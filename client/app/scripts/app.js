'use strict';

/**
 * @ngdoc overview
 * @name pomApp
 * @description
 * # pomApp
 *
 * Main module of the application.
 */
angular
  .module('pomApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl',
        controllerAs: 'projects'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
