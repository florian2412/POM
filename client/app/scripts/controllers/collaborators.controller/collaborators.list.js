'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsListCtrl', CollaboratorsListCtrl);

function CollaboratorsListCtrl($scope, $filter, databaseService) {
    var vm = this;

    vm.showAllCollaborators = showAllCollaborators;
    vm.deleteCollaborator = deleteCollaborator;

    function showAllCollaborators() {
      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          for (var i = data.length - 1; i >= 0; i--) {

            if(data[i].manager && data[i].role != "admin"){
              var m = _getManager(data[i].manager,data);
              console.log("IIII");
              console.log(i);
              console.log("MMMMMM");
              console.log(m);
              console.log("DATAAAAA[IIII]");
              console.log(data[i]);
              console.log("_______________________________");
              data[i].manager = m.prenom + ' ' + m.nom ;
            }
          }
          vm.collaborators = data;
        })
        .error(function (err) {
          console.error(err);
        });
    };

    function _getManager(id, all){
      return $filter('filter')(all, function (d) {return d._id === id;})[0];
    };

    function deleteCollaborator(id) {
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
