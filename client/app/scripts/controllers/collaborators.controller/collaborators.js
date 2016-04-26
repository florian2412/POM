'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */

CollaboratorsCtrl.$inject = ['$scope','databaseService'];

angular.module('pomApp').controller('CollaboratorsCtrl', CollaboratorsCtrl);

function CollaboratorsCtrl($scope,databaseService) {
    var vm = this;
    
    vm.showAllCollaborators = function() {
      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          vm.collaborators = data;
        })
        .error(function (err) {
          console.error(err);
        });
    };

    vm.deleteCollaborator = function(id) {
      console.log(id);
      databaseService.deleteObject('collaborators', id)
        .success(function (data) {
          var index = -1;   
          var comArr = eval( vm.collaborators );
          for( var i = 0; i < comArr.length; i++ ) {
            if( comArr[i]._id === id ) {
              index = i;
              break;
            }
          }
          if( index === -1 ) { alert( "Something gone wrong" ); }
          vm.collaborators.splice( index, 1 );
        })
        .error(function(err) {
          console.log(err);
        });
    };

    // Se lance au chargement de la page : récupère tous les collaborateurs
    $scope.$on('$viewContentLoaded', function() {
      vm.showAllCollaborators();
    });

}
