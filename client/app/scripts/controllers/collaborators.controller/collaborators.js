'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('CollaboratorsCtrl', function ($scope, collaboratorsService) {


    $scope.showAllCollaborators = function(){
      collaboratorsService.getAllCollaborators()
        .success(function (data) {
          $scope.collaborators = data;

        })
        .error(function (err) {
          console.error("Error !");
          console.error(err);
        });
    };





    $scope.createCollaborator = function() {
      // NC --> NewCollaborator
      var lastName = $scope.lastNameNC;
      var firstName = $scope.firstNameNC;
      var manager = $scope.managerNC
      var status = $scope.statusNC;
      var login = $scope.loginNC;
      var password = $scope.loginNC;
      var cost = $scope.costNC;


      // TODO Faire la validation du formulaire de création du collaborateur
      var data = "{ \"nom\": " + "\"" + lastName + "\" "
        + ", \"prenom\": " + "\"" + firstName + "\" "
        + ", \manager\": \"" + manager + "\" ";
        + ", \status\": \"" + status + "\" "
        + ", \login\": \"" + login+ "\" "
        + ", \password\": \"" +  + "\" ";
        + ", \cout_horaire\": \"" + cost + "\" } ";

      collaboratorsService.createCollaborator(data)
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
      collaboratorsService.deleteCollaborator(id)
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

      collaboratorsService.getAllCollaborators()
        .success(function (data) {
          $scope.collaborators = data;
        });


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
