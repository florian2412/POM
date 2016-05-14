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
    var projectToArchive = utilsService.getElementById(id, vm.projects);
    var allTasksAreDone = false;
    var nbProgressTask = 0;

    if(projectToArchive){
      if(projectToArchive.taches.length > 0){
        for (var i = projectToArchive.taches.length - 1; i >= 0; i--) {
          if(projectToArchive.taches[i].statut === "En cours" || projectToArchive.taches[i].statut === "Initial" ){
            nbProgressTask ++;
          }
        }
        if(nbProgressTask > 0){
          allTasksAreDone = false;
          flashService.error("Erreur ! ", "Il y a " +  nbProgressTask + " tâches à l'état En cours ou Initial sur ce projet.", "bottom-right", true, 4);
        } else allTasksAreDone = true;
      }
      else
        allTasksAreDone = true;
    }

    if(allTasksAreDone) {
      var cp = projectToArchive.chef_projet;

      projectToArchive.statut = "Archivé";
      projectToArchive.chef_projet = projectToArchive.chef_projet.id;

      databaseService.updateObject('projects', projectToArchive._id, projectToArchive)
        .success(function (data) {
          flashService.success("Le projet " + projectToArchive.nom + " a bien été mis à jour !", "", "bottom-right", true, 4); 
          projectToArchive.statut = utilsService.statusColors().archive;
          projectToArchive.chef_projet = cp;
          vm.tableParams.reload().then(function(data) {
            if (data.length === 0 && vm.tableParams.total() > 0) {
              vm.tableParams.page(vm.tableParams.page() - 1);
              vm.tableParams.reload();
            }
          }); 
      });    
    }   
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

