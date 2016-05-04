'use strict';

/**
 * @ngdoc overview
 * @name pomApp
 * @description
 * # pomApp
 *
 * Main module of the application.
 */

var pomApp = angular.module('pomApp', ['ui.router', 'ngMaterial', 'ngMessages', 'ngRoleAuth', 'ngSanitize', 'ngPassword', 'LocalStorageModule', 'mgcrea.ngStrap', 'chart.js', 'ngImgCrop']);

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
      controllerAs: 'mainVm',
      authorized: [ "collaborateur", "admin", "manager"]
    })
    .state('about', {
      url : '/about',
      title : 'A propos',
      templateUrl: 'views/about.html',
      /*controller: 'AboutCtrl',*/
      controllerAs: 'aboutVm',
      authorized: [ "collaborateur", "admin", "manager"]
    })
    .state('account', {
      url : '/account',
      title : 'Mon compte',
      templateUrl: 'views/account.html',
      controller: 'AccountCtrl',
      controllerAs: 'accountVm',
      authorized: [ "collaborateur", "admin", "manager"]
    })
    .state('projects', {
      url : '/projects',
      title : 'Projets',
      templateUrl: 'views/projects.views/projects.list.html',
      controller: 'ProjectsListCtrl',
      controllerAs: 'projectsListVm',
      authorized: ["admin", "manager", "collaborateur"]
    })
    .state('collaborators', {
      url : '/collaborators',
      title : 'Collaborateurs',
      templateUrl: 'views/collaborators.views/collaborators.list.html',
      controller: 'CollaboratorsListCtrl',
      controllerAs: 'collaboratorsListVm',
      authorized: ["admin", "manager"]
    })
    .state('login', {
      url : '/login',
      title : 'Se connecter',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'loginVm',
      authorized: ["collaborateur", "admin", "manager", "public"]
    })
    .state('statistics', {
      url : '/statistics',
      title : 'Statistiques',
      authorized: ["collaborateur", "admin", "manager"],
      templateUrl: 'views/statistics.views/statistics.html',
      controller: 'StatisticsCtrl',
      controllerAs: 'statisticsVm'
    })
    .state('help', {
      url : '/help',
      title : 'Aide',
      templateUrl: 'views/help.html',
      authorized: ["collaborateur", "admin", "manager"],
      /*controller: 'HelpCtrl',*/
      controllerAs: 'helpVm'
    })
    .state('budgets', {
      url : '/budgets',
      title : 'Lignes budgétaire',
      templateUrl: 'views/budgets.views/budgets.list.html',
      controller: 'BudgetsListCtrl',
      controllerAs: 'budgetsListVm',
      authorized: [ "admin" ]
    })
    .state('projects.create', {
      url : '/create',
      title : 'Création d\'un nouveau projet',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/projects.views/projects.create.html',
          controller: 'ProjectsCreateCtrl',
          controllerAs: 'projectCreateVm'
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
      controller: 'ProjectsDetailsCtrl',
      controllerAs: 'projectsDetailsVm'
    })
    .state('projects.details.tasks', {
      url : '/tasks',
      title : 'Tâches du projet',
      authorized: ["admin", "manager", "collaborateur"],
      templateUrl: 'views/tasks.views/tasks.list.html',
      controller: 'TasksListCtrl',
      controllerAs: 'tasksListVm'
    })
    .state('projects.details.tasks.create', {
      parent:'projects.details',
      url : '/tasks/create',
      title : 'Création d\'une tâche',
      authorized: ["admin", "manager"],
      templateUrl: 'views/tasks.views/tasks.create.html',
      controller: 'TasksCreateCtrl',
      controllerAs: 'tasksCreateVm'
    })
    .state('projects.details.tasks.details', {
      parent:'projects.details',
      url : '/tasks/:idtask/details',
      title : 'Information de la Tâche',
      authorized: ["admin", "manager", "collaborateur"],
      templateUrl: 'views/tasks.views/tasks.details.html',
      controller: 'TasksDetailsCtrl',
      controllerAs: 'tasksDetailsVm'
    })
    .state('collaborators.create', {
      url : '/create',
      title : 'Création d\'un nouveau collaborateur',
      authorized: ["admin", "manager"],
      views: {
        '@': {
          templateUrl: 'views/collaborators.views/collaborators.create.html',
          controller: 'CollaboratorsCreateCtrl',
          controllerAs : 'collaboratorsCreateVm'
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
          controller: 'CollaboratorsDetailsCtrl',
          controllerAs: 'collaboratorsDetailsVm'
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
          controller: 'BudgetsCreateCtrl',
          controllerAs: 'budgetsCreateVm'
        }
      }
    })
    .state('restricted', {
      url : '/restricted',
      title : 'Accès refusé',
      templateUrl: 'views/shared/restricted.html',
      authorized: [ "public", "collaborateur", "admin", "manager"]
    });
}

function appRun($rootScope, $state, $location, $http,$mdSidenav, $mdDialog, authenticateService, AuthService, localStorageService) {
  var cur_user = localStorageService.get('currentUser');
  getVersion();
  AuthService.setRole(((cur_user) ? cur_user.role : "public"));
  $rootScope.isAuthenticated = cur_user;

  if(cur_user){
    $rootScope.userFirstname = cur_user.prenom;
    $rootScope.userLastname = cur_user.nom;
    $rootScope.userRole = cur_user.role;

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
    $rootScope.closeMenu('projectSideNav');
   // $mdSidenav('projectSideNav').close();
    $mdDialog.hide();
  });

  $rootScope.openMenu = function(sidenavID){ $mdSidenav(sidenavID).toggle(); };
  $rootScope.closeMenu = function (sidenavID) { $mdSidenav(sidenavID).close(); };

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
