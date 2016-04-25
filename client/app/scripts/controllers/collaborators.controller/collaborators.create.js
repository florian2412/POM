'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCreateCtrl
 * @description
 * # CollaboratorsCreateCtrl
 * Controller of the collaborators.create
 */

angular.module('pomApp')
  .controller('CollaboratorsCreateCtrl', function ($scope, $state, $mdDialog, databaseService, FlashService) {

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

/*
      var data = "{ \"nom\": " + "\"" + lastName + "\" "
        + ", \"prenom\": " + "\"" + firstName + "\" "
        + ", \"manager\": \"" + manager + "\" "
        + ", \"role\": \"" + role + "\" "
        + ", \"pseudo\": \"" + login + "\" "
        + ", \"mot_de_passe\": \"" + password + "\" "
        + ", \"cout_horaire\": \"" + cost + "\" "
        + ", \"email\": \"" + email + "\" } ";
*/
      var data = {"nom": lastName,
                  "prenom": firstName,
                  "manager": manager,
                  "pseudo": login,
                  "mot_de_passe": password,
                  "statut" : "Président",
                  "cout_horaire" : cost,
                  "role": role,
                  "email" : email
                };

      console.log(data);

      databaseService.createObject('collaborators', data)
        .success(function (data) {
          console.log(data);
          //showSuccessDialog();
          FlashService.Success("Création du collaborateur " + firstName + " " + lastName + " réussie.", "", "bottom-right", true, 4);
          $state.go("collaborators");
        })
        .error(function (err) {
          console.log(err);
        });
    };

    $scope.getAllRoles = function(id) {
      databaseService.getAllObjects('rolesCollaborator')
        .success(function (data) {
          $scope.roles = data;
        });
    };

    $scope.getCollaboratorsByRole = function(role) {
      databaseService.getCollaboratorsByRole(role)
        .success(function (data) {
          $scope.collaborators = data;
        });
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {
      // Rôle proposé dans le combo du formulaire de création
      $scope.getAllRoles();
      $scope.getCollaboratorsByRole('manager');
    });

    /*
    function showSuccessDialog() {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Confirmation de création')
          .textContent('Le collaborateur ' + $scope.collaborator.firstName + ' ' + $scope.collaborator.lastName + ' a bien été créé !')
          .ariaLabel('Création du collaborateur réussie')
          .ok('Ok'));
    };
*/

    // Appelé depuis la view
    $scope.showCancelDialog = function(event) {

      var confirm = $mdDialog.confirm()
        .title('Alerte')
        .textContent('Etes-vous sûr d\'annuler la création du collaborateur ?')
        .ariaLabel('Annulation')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(function() {
        $state.go("collaborators");
      }, function() {

      });
    };

  });
