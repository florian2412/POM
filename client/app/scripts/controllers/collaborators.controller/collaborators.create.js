'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCreateCtrl
 * @description
 * # CollaboratorsCreateCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('CollaboratorsCreateCtrl', function ($scope, databaseService) {

    $scope.roles = ["Admin", "Manager", "Collaborateur"];

    databaseService.getAllObjects('collaborators')
      .success(function (data) {
        $scope.collaborators = data;
      })
      .error(function (err) {
        console.error(err);
      });

    $scope.createCollaborator = function() {

      var lastName = $scope.collaborator.lastName;
      var firstName = $scope.collaborator.firstName;
      var manager = $scope.collaborator.manager;
      var role = $scope.collaborator.role.toLowerCase();
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
        })
        .error(function (err) {
          console.log(err);
        });
    };



  });
