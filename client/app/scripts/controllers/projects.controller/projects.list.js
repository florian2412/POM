'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsListCtrl
 * @description
 * # ProjectsListCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('ProjectsListCtrl', ProjectsListCtrl);

function ProjectsListCtrl($scope, databaseService, utilsService) {
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
        vm.projects[i].statut = "Terminé(e)";
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

  function deleteProject(id) {
    databaseService.deleteObject('projects', id)
      .success(function (data) {
        var i = utilsService.arrayObjectIndexOf(vm.projects,id, '_id');
        if(i > -1){
          vm.projects.splice( i, 1 );
          flashService.success("Succés ! ", "Suppression du projet réussie.", 'bottom-right', true, 4);
        }
        else flashService.error("Erreur ! ", "Impossible de supprimer le projet.",'bottom-right', true,4);
      })
      .error(function(err) {
        console.log(err);
      });
  };

  // Affiche la liste des projets au chargement de la page
  $scope.$on('$viewContentLoaded', function() {
    vm.showAllProjects();
  });

};

