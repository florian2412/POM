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


    // Permet de lancer au chargement de la page : récupère tous les collaborateurs
    $scope.$on('$viewContentLoaded', function() {
      $scope.showAllCollaborators();
    });

  });
