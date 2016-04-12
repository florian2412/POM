'use strict';

/**
 * @ngdoc overview
 * @name pomApp
 * @description
 * # pomApp
 *
 * Main module of the application.
 */

var pomApp = angular.module('pomApp', ['ui.router', 'ngMaterial', 'ngMessages']);

pomApp.config(routerStateProvider);

function routerStateProvider($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('main');
    $stateProvider
    .state('main', {
            url: '/main',
            title : 'Home',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
    })
    .state('about', {
            url : '/about',
            title : 'A propos',
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
    })
    .state('projects', {
            url : '/projects',
            title : 'Projets',
            templateUrl: 'views/projects.views/projects.list.html',
            controller: 'ProjectsCtrl',
            controllerAs: 'projects'
    })
    .state('projects.details', {
            url : '/:id',
            title : 'Détails du projet',
            views: {
                '@': {
                  templateUrl: 'views/projects.views/projects.details.html',
                  controller: 'ProjectsDetailsCtrl'
                }
            }
    })
    .state('collaborators', {
            url : '/collaborators',
            title : 'Collaborateurs',
            templateUrl: 'views/collaborators.views/collaborators.list.html',
            controller: 'CollaboratorsCtrl',
            controllerAs: 'collaborators'
    })
    .state('collaborators.details', {
            url : '/:id',
            title : 'Détails du collaborateur',
            views: {
                '@': {
                  templateUrl: 'views/collaborators.views/collaborators.details.html',
                  controller: 'CollaboratorsDetailsCtrl'
                 }
            }
    })
    .state('login', {
            url : '/login',
            title : 'Se connecter',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'

    });
};

pomApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        $rootScope.title = toState.title;
      });
  }]
);


    /*
var pomApp = angular.module('pomApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

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
    .when('/projects/:_id', {
      title : 'Consultation d\'un projet',
      templateUrl: 'views/project.html',
      controller: 'ProjectCtrl',
      controllerAs: 'project'
    })
    .when('/collaborators/:_id', {
      title : 'Consultation d\'un collaborateur',
      templateUrl: 'views/collaborator.html',
      controller: 'CollaboratorCtrl',
      controllerAs: 'collaborator'
    })
    .when('/login', {
      title : 'Se connecter',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .when('/collaborators', {
      templateUrl: 'views/collaborators.html',
      controller: 'CollaboratorsCtrl',
      controllerAs: 'collaborators'
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
>>>>>>> 73a154b... Add datePicker for date_debut of a project
}]);
