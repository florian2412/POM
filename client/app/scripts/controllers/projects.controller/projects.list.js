'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsListCtrl
 * @description
 * # ProjectsListCtrl
 * Controller of the pomApp
 */

angular.module('pomApp').controller('ProjectsListCtrl', ProjectsListCtrl);

function ProjectsListCtrl($scope,$state, NgTableParams, databaseService, utilsService, flashService, localStorageService) {
  
  var vm = this;
  
  vm.showAllProjects = showAllProjects;
  vm.deleteProject = deleteProject;
  vm.archiveProject = archiveProject;
  vm.redirectProjectsDetails = redirectProjectsDetails;
  vm.isFiltersEnabled = false;

  function redirectProjectsDetails(event,id){
    $state.go('projects.details.info',{"id":id});
  }

  function showAllProjects(){
    var currentUser = localStorageService.get('currentUser');
    
    databaseService.getAllObjects('collaborators').success(function(allCollaborators){
      
      if(currentUser.role === 'admin'){
        databaseService.getAllObjects('projects').success(function (data) {
          associateChefProjet(data,allCollaborators);
          vm.projects = data;

          vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { filterDelay: 0, data: data });

        });
      }
      else {
        databaseService.getCollaboratorProjects(currentUser._id)
          .success(function(data){ 
            associateChefProjet(data,allCollaborators);
            vm.projects = data;
            
            vm.tableParams = new NgTableParams({
              page: 1, // show first page
              count: 10 // count per page
              }, {
              filterDelay: 0,
              data: data
            });

        });
      }
    });
  };

  function associateChefProjet(data,allCollaborators){
    for (var i = data.length - 1; i >= 0; i--) {
      var cp = utilsService.getElementById(data[i].chef_projet, allCollaborators);
      data[i].chef_projet = { "identite": cp.prenom + ' ' + cp.nom, "nom" : cp.nom, "prenom" : cp.prenom, "id": cp._id };

      switch (data[i].statut)
      {
        case 'Initial': data[i].statut = utilsService.statusColors().initial;
        break;
        case 'En cours': data[i].statut = utilsService.statusColors().en_cours;
        break;
        case 'Terminé(e)': data[i].statut = utilsService.statusColors().termine;
        break;
        case 'Annulé(e)': data[i].statut = utilsService.statusColors().annule;
        break;
        case 'Archivé': data[i].statut = utilsService.statusColors().archive;
        break;
      }
    }
  }

  function archiveProject(id){
    for (var i = vm.projects.length - 1; i >= 0; i--) {
      if(vm.projects[i]._id == id){
        vm.projects[i].statut = utilsService.statusColors().archive;
        vm.tableParams.reload().then(function(data) {
            if (data.length === 0 && vm.tableParams.total() > 0) {
            vm.tableParams.page(vm.tableParams.page() - 1);
            vm.tableParams.reload();
          }
        });
        flashService.success("Succès ! ", "Le projet " +  vm.projects[i].nom + " a été archivé.", "bottom-right", true, 4);
      }
    }
    // Vérifier si toutes les tâches sont terminées avant d'archiver un projet

    /*databaseService.updateObject('projects', idProject, data)
      .success(function (data) {
        flashService.Success("Le projet " + $scope.project.nom + " a bien été mis à jour !", "", "bottom-right", true, 4);
        $state.go("projects");
      });
    });*/
  }

  function deleteProject(id) {
    databaseService.deleteObject('projects', id)
      .success(function (data) {
        var i = utilsService.arrayObjectIndexOf(vm.projects,id, '_id');
        if(i > -1){
          vm.projects.splice( i, 1 );
          flashService.success("Succés ! ", "Suppression du projet réussie.", 'bottom-right', true, 4);
          
          vm.tableParams.reload().then(function(data) {
              if (data.length === 0 && vm.tableParams.total() > 0) {
              vm.tableParams.page(vm.tableParams.page() - 1);
              vm.tableParams.reload();
            }
          });
     
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

