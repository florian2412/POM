'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCreateCtrl
 * @description
 * # CollaboratorsCreateCtrl
 * Controller of the collaborators.create
 */

CollaboratorsCreateCtrl.$inject = ['$scope', '$state', '$mdDialog', 'databaseService', 'flashService', 'localStorageService', 'utilsService'];

angular.module('pomApp').controller('CollaboratorsCreateCtrl', CollaboratorsCreateCtrl);

function CollaboratorsCreateCtrl($scope, $state, $mdDialog, databaseService, flashService, localStorageService, utilsService) {

    var vm = this;
    var currentUser = localStorageService.get('currentUser');

    vm.createCollaborator = createCollaborator;
    vm.showCancelDialog = showCancelDialog;


    function createCollaborator() {

      var data = {
        "nom": vm.collaborator.n_nom,
        "prenom": vm.collaborator.n_prenom,
        "manager": vm.collaborator.n_manager,
        "pseudo": vm.collaborator.n_pseudo,
        "mot_de_passe": vm.collaborator.n_mot_de_passe,
        "cout_horaire" : vm.collaborator.n_cout_horaire,
        "role": vm.collaborator.n_role,
        "email" : vm.collaborator.n_email,
        "fonction": vm.collaborator.n_fonction
      };

      databaseService.createObject('collaborators', data)
        .success(function (data) {
          console.log("Reponse du server : " + data.message);
          if(!data.success){
            flashService.Error("Erreur : ", data.message, "bottom-right", true, 4);
          }
          else{
            flashService.Success("Création du collaborateur " + vm.collaborator.n_nom + " " + vm.collaborator.n_prenom + " réussie.", "", "bottom-right", true, 4);
            $state.go("collaborators");
          }
        })
        .error(function (err) {
          console.log(err);
        });
    };


    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {
     
      databaseService.getSettings('fonctions')
        .success(function(data){ 
          vm.fonctions = data;
        });
      
      // Si on est admin
      if(currentUser.role === 'admin') {
        
        databaseService.getSettings('roles')
        .success(function(data){ 
          var i = data.indexOf('admin');
          data.splice(i, 1);
          for (var i = data.length - 1; i >= 0; i--) {
            data[i] = utilsService.capitalize(data[i]);
          }
          vm.roles = data;
        });

        databaseService.getCollaboratorsByRole('manager')
        .success(function (data) {
          if(data.length > 0) {
            data.push(currentUser);
            vm.managers = data;
          } else { vm.managers = [currentUser]; }
        });

      }
      // Si on est manager, on doit sélectionner automatiquement le role et le manager
      else {
        vm.roles = ['collaborateur'];
        vm.managers = [currentUser];
        vm.collaborator = currentUser;
        vm.collaborator.n_role = 'collaborateur';
        vm.collaborator.n_manager = currentUser._id;
      }

    });


    function showCancelDialog(event) {

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

  };
