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

    $urlRouterProvider.otherwise('/');
    $stateProvider    
    .state('/', {
            url: '/',
            title : 'Home',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            authorized: ["collaborator", "admin", "manager"]
    })
    .state('about', {
            url : '/about',
            title : 'A propos',
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about',
    })
    .state('projects', {
            url : '/projects',
            title : 'Projets',
            templateUrl: 'views/projects.views/projects.list.html',
            controller: 'ProjectsCtrl',
            controllerAs: 'projects',
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


pomApp.run(function($rootScope, $location,$state, authenticateService) {
    $rootScope.$on('$locationChangeSuccess', 
      function(event, toState, toParams, fromState, fromParams){ 
        $rootScope.title = toState.title;
        console.log(authenticateService.getCurrentUser());
        if (authenticateService.getCurrentUser() === null) {
            console.log("pas loggé");
            $location.path("/login");
        }
    });
});
