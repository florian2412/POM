'use strict';

/**
 * @ngdoc overview
 * @name pomApp
 * @description
 * # pomApp
 *
 * Main module of the application.
 */
var pomApp = angular.module('pomApp', ['ngRoute']);

pomApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        title : 'Home',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        title : 'A propos',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/projects', {
        title : 'Projets',
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl',
        controllerAs: 'projects'
      })
      .when('/login', {
        title : 'Se connecter',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        title : 'Home',
        redirectTo: '/'
      });
});

pomApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        $rootScope.title = current.$$route.title;
    });
}]);
