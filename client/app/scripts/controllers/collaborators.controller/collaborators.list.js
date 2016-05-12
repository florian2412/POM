'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:CollaboratorsCtrl
 * @description
 * # CollaboratorsCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('CollaboratorsListCtrl', CollaboratorsListCtrl);

function CollaboratorsListCtrl($scope, $filter, $state, databaseService, utilsService, NgTableParams) {
    var vm = this;
   
    vm.showAllCollaborators = showAllCollaborators;
    vm.deleteCollaborator = deleteCollaborator;
    vm.redirectCollaboratorsDetails = redirectCollaboratorsDetails;
    vm.isFiltersEnabled = false;

    function redirectCollaboratorsDetails(event,id){
      $state.go('collaborators.details',{"id":id});
    }

    function showAllCollaborators() {
      databaseService.getAllObjects('collaborators')
        .success(function (data) { 
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].manager && data[i].role != "admin"){
              var id = data[i].manager;
              var m = _getManager(id, data);
              if(m)
                data[i].manager = {"id" : id, "prenom" : m.prenom , "nom" : m.nom };
            }
          }
          vm.collaborators = data;
         
          vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: data });

        });
    };
    
    function _getManager(id, all){
      return $filter('filter')(all, function (d) {return d._id === id;})[0];
    };

    function deleteCollaborator(id) {
      databaseService.deleteObject('collaborators', id)
        .success(function (data) {
          var i = utilsService.arrayObjectIndexOf(vm.collaborators,id,'_id');

          if(i>-1){
            vm.collaborators.splice( i, 1 );
            vm.tableParams.reload().then(function(data) {
              if (data.length === 0 && vm.tableParams.total() > 0) {
              vm.tableParams.page(vm.tableParams.page() - 1);
              vm.tableParams.reload();
            }
          });
          }
        });
    };

    // Se lance au chargement de la page : récupère tous les collaborateurs
    $scope.$on('$viewContentLoaded', function() {
      vm.showAllCollaborators(); 
    });

}
