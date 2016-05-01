'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsListCtrl
 * @description
 * # ProjectsListCtrl
 * Controller of the pomApp
 */

ProjectsListCtrl.$inject = ['$scope', 'databaseService'];

angular.module('pomApp').controller('ProjectsListCtrl', ProjectsListCtrl);

function ProjectsListCtrl($scope, databaseService) {
  var vm = this;

  vm.showAllProjects = showAllProjects;
  vm.deleteProject = deleteProject;
  vm.archiveProject = archiveProject;

  function showAllProjects(){
    databaseService.getAllObjects('projects')
      .success(function (data) {
        vm.projects = data;
      })
      .error(function (err) {
        console.error(err);
      });
  };

  function archiveProject(id){
    for (var i = vm.projects.length - 1; i >= 0; i--) {
      if(vm.projects[i]._id == id)
        vm.projects[i].statut = "Terminé";
      }  
    /*databaseService.updateObject('projects', idProject, data)
      .success(function (data) {
        flashService.Success("Le projet " + $scope.project.nom + " a bien été mis à jour !", "", "bottom-right", true, 4);
        $state.go("projects");
      })
      .error(function (err) {
        console.log(err);
    });*/
  }
   /* var getObjectById = function(collection, id) {
      databaseService.getObjectById(collection, id)
        .success(function (data) {
          return data;
        })
        .error(function (err) {
          return err;
        });
    };

    $scope.getCollaboratorById = function(id) {
      $scope.project.chef_projet = getObjectById('collaborators', id);
    };

    $scope.getProjectById = function(id){
      $scope.project.projectDetail = getObjectById('projects', id);
    };
*/

  function deleteProject(id) {
    databaseService.deleteObject('projects', id)
      .success(function (data) {
      // Update liste projets
        var index = -1;
        var comArr = eval( vm.projects );
        for( var i = 0; i < comArr.length; i++ ) {
          if( comArr[i]._id === id ) {
            index = i;
            break;
          }
        }

        //var index2 = $scope.projects._id.indexOf(id);

        if( index === -1 ) {
          alert( "Something gone wrong" );
        }
        vm.projects.splice( index, 1 );
        
      })
      .error(function(err) {
        console.log(err);
      });
  };

  // Permet de lancer au chargement de la page : récupère tous les projets
  $scope.$on('$viewContentLoaded', function() {
    vm.showAllProjects();
  });

};

