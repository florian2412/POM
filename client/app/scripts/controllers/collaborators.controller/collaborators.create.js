'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCreateCtrl
 * @description
 * # CollaboratorsCreateCtrl
 * Controller of the collaborators.create
 */


angular.module('pomApp')
  .controller('CollaboratorsCreateCtrl', function ($scope, $state, $mdDialog, databaseService, flashService, localStorageService, utilsService) {

    var vm = this;
    var currentUser = localStorageService.get('currentUser');

    $scope.createCollaborator = function() {

      var lastName = $scope.collaborator.lastName;
      var firstName = $scope.collaborator.firstName;
      var manager = $scope.collaborator.manager;
      var fonction = $scope.collaborator.fonction;
      var role = $scope.collaborator.role;
      var login = $scope.collaborator.login;
      var password = $scope.collaborator.password;
      var cost = $scope.collaborator.cost;
      var email = $scope.collaborator.email;

      var data = {
        "nom": lastName,
        "prenom": firstName,
        "manager": manager,
        "pseudo": login,
        "mot_de_passe": password,
        "cout_horaire" : cost,
        "role": role,
        "email" : email,
        "fonction":fonction
      };

      databaseService.createObject('collaborators', data)
        .success(function (data) {
          flashService.Success("Création du collaborateur " + firstName + " " + lastName + " réussie.", "", "bottom-right", true, 4);
          $state.go("collaborators");
        })
        .error(function (err) {
          console.log(err);
        });
    };

    $scope.getAllRoles = function(id) {
      databaseService.getAllObjects('rolesCollaborator')
        .success(function (data) {
          // On récupère l'index du role d'admin pour le supprimer ensuite
          var indexToDelete = utilsService.arrayObjectIndexOf(data, 'admin', 'libelle_court');
          // On supprime le role admin de la liste des roles
          data.splice(indexToDelete, 1);
          // On affecte
          $scope.roles = data;
        });
    };

    $scope.getCollaboratorsByRole = function(role) {
      databaseService.getCollaboratorsByRole(role)
        .success(function (data) {
          if(data.length > 0) {
            data.push(currentUser);
            $scope.managers = data;
          }
          else {
            $scope.managers = [currentUser];
          }
        });
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {
      $scope.fonctions = ["Développeur", "Architecte", "Directeur", "Chef de projet"]
      
      // Si on est admin
      if(currentUser.role === 'admin') {
        $scope.getAllRoles();
        $scope.getCollaboratorsByRole('manager');
      }
      // Si on est manager, on doit sélectionner automatiquement le role et le manager
      else {
        $scope.roles = ['collaborateur'];
        $scope.role = 'collaborateur';

        $scope.managers = [currentUser];
        $scope.collaborator = currentUser;

        $scope.collaborator.role = $scope.role;
        $scope.collaborator.manager = currentUser._id;
      }

    });

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
