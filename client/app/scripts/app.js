'use strict';

/**
 * @ngdoc overview
 * @name pomApp
 * @description
 * # pomApp
 *
 * Main module of the application.
 */

var pomApp = angular.module('pomApp', ['ui.router', 'ngMaterial', 'ngMessages', 'ngRoleAuth']);

pomApp.config(routerStateProvider);

function routerStateProvider($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('DD/MM/YYYY');
    };
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('/', {
            url: '/',
            title : 'Home',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            authorized: [ "collaborateur", "admin", "manager"]
    })
    .state('about', {
            url : '/about',
            title : 'A propos',
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about',
            authorized: [ "collaborateur", "admin", "manager"]
    })
    .state('projects', {
            url : '/projects',
            title : 'Projets',
            templateUrl: 'views/projects.views/projects.list.html',
            controller: 'ProjectsCtrl',
            controllerAs: 'projects',
            authorized: ["admin", "manager"]
    })
    .state('projects.details', {
            url : '/:id',
            title : 'Détails du projet',
            authorized: ["collaborateur", "admin", "manager"],
            views: {
                '@': {
                  templateUrl: 'views/projects.views/projects.details.html',
                  controller: 'ProjectsDetailsCtrl'
                }
            }
    })
    .state('projects.create', {
      title : 'Création d\'un nouveau projet',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/projects.views/projects.create.html',
          controller: 'ProjectsCreateCtrl'
        }
      }
    })
    .state('collaborators', {
            url : '/collaborators',
            title : 'Collaborateurs',
            templateUrl: 'views/collaborators.views/collaborators.list.html',
            controller: 'CollaboratorsCtrl',
            controllerAs: 'collaborators',
            authorized: ["collaborateur", "admin", "manager"]
    })
    .state('collaborators.details', {
            url : '/:id',
            title : 'Détails du collaborateur',
            authorized: ["admin", "manager"],
            views: {
                '@': {
                  templateUrl: 'views/collaborators.views/collaborators.details.html',
                  controller: 'CollaboratorsDetailsCtrl'
                 }
            }
    })
    .state('collaborators.create', {
      title : 'Création d\'un nouveau collaborateur',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/collaborators.views/collaborators.create.html',
          controller: 'CollaboratorsCreateCtrl'
        }
      }
    })
    .state('login', {
            url : '/login',
            title : 'Se connecter',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login',
            authorized: ["collaborateur", "admin", "manager", "public"]
    })
    .state('statistics', {
            url : '/statistics',
            title : 'Statistiques',
           /* templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login',*/
            template: '<h4>stats des projets</h4>',
            authorized: ["collaborateur", "admin", "manager"]

    })
    .state('settings', {
            url : '/settings',
            title : 'Préférences',
           /* templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login',*/
            template: '<h4>Préférences ici</h4>',
            authorized: ["collaborateur", "admin", "manager"]

    })
    .state('help', {
            url : '/help',
            title : 'Aide',
           /* templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login',*/
            template: '<h4>Aide ici</h4>',
            authorized: ["public", "collaborateur", "admin", "manager"]
    })
    .state('restricted', {
            url : '/restricted',
            title : 'Accès refusé',
            template: '<h4>Vous n\'avez pas les droits d\'accès. Contactez votre manager.</h4>',
            authorized: [ "public", "collaborateur", "admin", "manager"]
    });
};



pomApp.run(function($rootScope, $location, $state, authenticateService,AuthService) {

    $rootScope.$on('$locationChangeSuccess', 
        function(event, toState, toParams, fromState, fromParams){ 
            if (authenticateService.getCurrentUser() === null) {
                $location.path("/login");
            }
    });

    AuthService.getRole = function(){
        if (authenticateService.getCurrentUser() === null)
            return "public";
    };
    $rootScope.$on('LoginSuccess', function(){
        AuthService.getRole = function(){
            return authenticateService.getCurrentUser().roles ;
        };
    });
    $rootScope.$on('LogoutSuccess', function(){
        AuthService.getRole = function(){
            return "public";
        };
    });
    $rootScope.$on('$stateChangeStart',

        function(event, toState, toParams, fromState, fromParams) {
            $rootScope.title = toState.title;
            /*if (authenticateService.getCurrentUser() !== null){
                if(toState.authorized.indexOf($rootScope.currentUser.roles) < 0)
                {
                    event.preventDefault();
                    $state.go('restricted');
                }
            }*/

    });
});
