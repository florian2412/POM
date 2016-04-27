'use strict';

/**
 * @ngdoc overview
 * @name pomApp
 * @description
 * # pomApp
 *
 * Main module of the application.
 */

var pomApp = angular.module('pomApp', ['ui.router', 'ngMaterial', 'ngMessages', 'ngRoleAuth', 'ngSanitize', 'ngPassword', 'LocalStorageModule', 'mgcrea.ngStrap']);

function appConfig($stateProvider, $urlRouterProvider, $mdDateLocaleProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default').primaryPalette('green').accentPalette('blue');
  $mdDateLocaleProvider.formatDate = function(date) { return moment(date).format('DD/MM/YYYY');};
  $urlRouterProvider.otherwise('/');
  $stateProvider
  // Menu's routes
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
    .state('collaborators', {
      url : '/collaborators',
      title : 'Collaborateurs',
      templateUrl: 'views/collaborators.views/collaborators.list.html',
      controller: 'CollaboratorsCtrl',
      controllerAs: 'vm',
      authorized: ["collaborateur", "admin", "manager"]
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
      templateUrl: 'views/statistics.html',
      /* controller: 'LoginCtrl',
       controllerAs: 'login',*/
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
      templateUrl: 'views/help.html',
      /* controller: 'LoginCtrl',
       controllerAs: 'login',*/
      authorized: ["collaborateur", "admin", "manager"]
    })
    .state('restricted', {
      url : '/restricted',
      title : 'Accès refusé',
      templateUrl: 'views/partials/restricted.html',
      authorized: [ "public", "collaborateur", "admin", "manager"]
    })
    .state('budgets', {
      url : '/budgets',
      title : 'Lignes budgétaire',
      templateUrl: 'views/budgets.views/budgets.list.html',
      controller: 'BudgetsCtrl',
      controllerAs: 'budgets',
      authorized: [ "admin" ]
    })

    .state('projects.create', {
      url : '/create',
      title : 'Création d\'un nouveau projet',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/projects.views/projects.create.html',
          controller: 'ProjectsCreateCtrl'
        }
      }
    })
    .state('projects.details', {
      url : '/details/:id',
      abstract:true,
      title : 'Détails du projet',
      authorized: ["collaborateur", "admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/projects.views/projects.details.html',
          controller: 'ProjectsDetailsCtrl'
        }
      }
    })
    .state('projects.details.info', {
      url : '/info',
      title : 'Informations du projet',
      authorized: ["collaborateur", "admin", "manager"],
      templateUrl: 'views/projects.views/projects.details.info.html',
      controller: 'ProjectsDetailsCtrl'
    })

    .state('projects.details.tasks', {
      url : '/tasks',
      title : 'Tâches du projet',
      authorized: ["admin", "manager"],
      templateUrl: 'views/projects.views/projects.details.tasks.html',
      controller: 'TasksCtrl'
    })
    .state('projects.details.tasks.create', {
      parent:'projects.details',
      url : '/tasks/create',
      title : 'Création d\'une tâche',
      authorized: ["admin", "manager"],
      templateUrl: 'views/projects.views/projects.details.tasks.create.html',
      controller: 'ProjectsDetailsTasksCreateCtrl'
    })

    .state('projects.details.tasks.details', {
      parent:'projects.details',
      url : '/tasks/:idtask/details',
      title : 'Information de la Tâche',
      authorized: ["admin", "manager"],
      templateUrl: 'views/projects.views/projects.details.tasks.info.details.html',
      controller: 'TaskCtrl'
    })

    .state('collaborators.create', {
      url : '/create',
      title : 'Création d\'un nouveau collaborateur',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/collaborators.views/collaborators.create.html',
          controller: 'CollaboratorsCreateCtrl',
          controllerAs : 'createCollaborators'
        }
      }
    })
    .state('collaborators.details', {
      url : '/details/:id',
      title : 'Détails du collaborateur',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/collaborators.views/collaborators.details.html',
          controller: 'CollaboratorsDetailsCtrl'
        }
      }
    })

    .state('budgets.create', {
      url : '/create',
      title : 'Création d\'une ligne budgétaire',
      authorized: [ "admin" ],
      views: {
        '@': {
          templateUrl: 'views/budgets.views/budgets.create.html',
          controller: 'BudgetsCreateCtrl'
        }
      }
    });
}

function appRun($rootScope, $location, $state, $http, authenticateService, AuthService, localStorageService) {
  var cur_user = localStorageService.get('currentUser');
  getVersion();
  AuthService.setRole(((cur_user) ? cur_user.role : "public"));
  $rootScope.isAuthenticated = cur_user;
  if(cur_user){
    $rootScope.userFirstname = cur_user.prenom;
    $rootScope.userLastname = cur_user.nom;
  }
  // Fire when url changes
  $rootScope.$on('$locationChangeSuccess', function(){
    if (authenticateService.getCurrentUser() === null){
      $location.path("/login");
    }
  });

  // Fire when state changes
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    $rootScope.title = toState.title;
  });

  function getVersion(){
    var version = $http.get('http://localhost:3000/version')
      .then(function(res){
          $rootScope.apiVersion = res.data.api;
          $rootScope.appClientVersion = res.data.appClient;
        },function(err){ console.log("erreur get version : " + err);}
      );
  }
}

pomApp.config(appConfig);
pomApp.run(appRun);
