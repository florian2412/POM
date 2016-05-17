'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('AccountCtrl',AccountCtrl);


function AccountCtrl($scope, $mdDialog,utilsService, localStorageService, databaseService, authenticateService, flashService) {

  var vm = this;

  vm.showUpdatePassword = showUpdatePassword;

  /**
   * Méthode lancée lorsque la page est chargée
   */
  $scope.$on('$viewContentLoaded', function() {

    vm.user = localStorageService.get('currentUser');

    if(vm.user.manager){
    databaseService.getAllObjects('collaborators')
      .success(function (data) {

        if(vm.user.manager){
          var m = utilsService.getElementById(vm.user.manager, data);
          vm.user.manager = {"id" : m._id, "prenom" : m.prenom , "nom" : m.nom };
        }
      });
    }
  });

  /**
   * Ouvre la boite de dialog permettant de changer le mot de passe d'un utilisateur
   *
   * @param ev
   */
  function showUpdatePassword(ev) {

    $mdDialog.show({
      controller: _PasswordUpdateController,
      templateUrl: 'views/shared/update.password.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false
    });
  };

  /**
   * Change le mot de passe d'un utilisateur
   *
   * @param $scope
   * @param $mdDialog
   * @private
   */
  function _PasswordUpdateController($scope, $mdDialog) {
    $scope.cancel = function() { $mdDialog.hide(); }
    $scope.updatePassword = function(user){

      if(user){
        authenticateService.updatePassword(user.confirmedNewPassword,
          function(response){
            if(response.success){
              flashService.success("Succés ! ", response.message, "bottom-right", "true", 4);
            }
            else {
              flashService.error("Echec ! ", response.message, "bottom-right", "true", 4);
            }
          });
      }
      else {
        flashService.error('Erreur ! ', 'Veuillez entrer un nouveau mot de passe', 'bottom-right', true, 4);
      }
      $mdDialog.hide();
    }
  }
};



