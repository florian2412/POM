'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('CollaboratorsCtrl', function ($scope, collaboratorsService, databaseService) {


    $scope.showAllCollaborators = function() {
      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          $scope.collaborators = data;
          $scope.collaboratorsManager = data;
        })
        .error(function (err) {
          console.error(err);
        });
    };





    $scope.createCollaborator = function() {

      var lastName = $scope.collaborator.lastName;
      var firstName = $scope.collaborator.firstName;
      var manager = $scope.collaborator.manager;
      var role = $scope.collaborator.role;
      var login = $scope.collaborator.login;
      var password = $scope.collaborator.password;
      var confirmPassword = $scope.collaborator.confirmPassword;
      var cost = $scope.collaborator.cost;
      var email = $scope.collaborator.email;


      // TODO Faire la validation du formulaire de création du collaborateur
      var data = "{ \"nom\": " + "\"" + lastName + "\" "
        + ", \"prenom\": " + "\"" + firstName + "\" "
        + ", \"manager\": \"" + manager + "\" "
        + ", \"role\": \"" + role + "\" "
        + ", \"pseudo\": \"" + login + "\" "
        + ", \"mot_de_passe\": \"" + password + "\" "
        + ", \"cout_horaire\": \"" + cost + "\" "
        + ", \"email\": \"" + email + "\" } ";

      console.log(data);

      databaseService.createObject('collaborators', data)
        .success(function (data) {
          console.log(data);

          // Update liste projets
          $scope.showAllCollaborators();

          //  Cache le formulaire de création de projet et affiche la tableau des projets
          $scope.hideFormCreateCollaborator();

        })
        .error(function (err) {
          console.log(err);
        });
    };


    $scope.deleteCollaborator = function(id) {
      databaseService.deleteObject('collaborators', id)
        .success(function (data) {
          // Update liste projets
          $scope.showAllCollaborators();
        })
        .error(function(err) {
          console.log(err);
        });
    };



    $scope.showFormCreateCollaborator = function () {
      $scope.showForm = true;

      $scope.dateLaunchCollaboratorNewCollaborator = new Date();

      $scope.showAllCollaborators();

      /*
      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          $scope.collaborators = data;
        });
      */
    };

    $scope.hideFormCreateCollaborator = function () {
      $scope.showForm = false;
    };











    // Permet de lancer au chargement de la page : récupère tous les collaborateurs
    $scope.$on('$viewContentLoaded', function() {
      $scope.showAllCollaborators();

      // Default --> Cache le formulaire de création de projet et affiche la tableau des projets
      $scope.hideFormCreateCollaborator();

    });

  });
