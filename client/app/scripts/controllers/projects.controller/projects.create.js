'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsCreateCtrl
 * @description
 * # ProjectsCreateCtrl
 * Controller of the projects.create
 */

ProjectsCreateCtrl.$inject = ['$scope', '$state', '$mdDialog', 'databaseService', 'flashService', 'authenticateService'];

angular.module('pomApp').controller('ProjectsCreateCtrl', ProjectsCreateCtrl);

function ProjectsCreateCtrl($scope, $state, $mdDialog, databaseService, flashService, authenticateService) {
    var vm = this;
    var collaborateursId = [];
    vm.minDate = new Date();

    vm.createProject = function() {

      if(!vm.project.startDate)
        vm.project.startDate = new Date();

      if(!vm.project.endDate)
        vm.project.endDate = new Date();

      var budget = JSON.parse(vm.project.ligne_budgetaire);

      var data = {
        "nom" : vm.project.name,
        "statut" : vm.project.statut,
        "chef_projet" : authenticateService.getCurrentUser()._id,
        "date_debut" : vm.project.startDate,
        "date_fin_theorique" : vm.project.endDate,
        "date_derniere_modif" : new Date(),
        "collaborateurs": collaborateursId,
        "ligne_budgetaire": {
            "id": budget._id,
            "montant_restant": budget.montant
        }
      };

      databaseService.createObject('projects', data)
        .success(function (data) {
          flashService.Success("Création du projet " + vm.project.name + " réussie.", "", "bottom-right", true, 4);
          $state.go("projects");
        })
        .error(function (err) {
          console.log(err);
        });
    };

    vm.selectCollaborator = function (collaborator) {
      if(!collaborator.checked) {
        collaborateursId.push(collaborator._id);
        collaborator.checked = true;
      } else {
        collaborator.checked = false;

        var indexCol = collaborateursId.indexOf(collaborator._id);
        if (indexCol > -1) {
          collaborateursId.splice(indexCol, 1);
        }
      }
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      databaseService.getAllObjects('budgets')
        .success(function (data) {
          vm.budgets = data;
        })
        .error(function (err) {
          console.log(err);
        });


      vm.statuts = ["Initial", "En cours", "Annulé", "Terminé"]

      databaseService.getAllObjects('collaborators')
        .success(function (data) {
          vm.collaborators = data;
          console.log("collaborators : " + data);
        })
        .error(function (err) {
          console.log(err);
        });

    });

    // Appelé depuis la view
    vm.showCancelDialog = function(event) {

      var confirm = $mdDialog.confirm()
        .title('Alerte')
        .textContent('Etes-vous sûr d\'annuler la création du projet ?')
        .ariaLabel('Annulation')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(function() {
        $state.go("projects");
      }, function() {

      });
    };

    var self = this;
    var cachedQuery;
    self.allContacts = loadContacts();
    self.contacts = [self.allContacts[0]];
    self.filterSelected = true;
    self.querySearch = querySearch;

    /**
     * Search for contacts; use a random delay to simulate a remote call
     */
    function querySearch (criteria) {
      cachedQuery = cachedQuery || criteria;
      return cachedQuery ? self.allContacts.filter(createFilterFor(cachedQuery)) : [];
    }

     /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);;
      };
    }


    function loadContacts() {
      var contacts = [
        'Marina Augustine',
        'Oddr Sarno',
        'Nick Giannopoulos',
        'Narayana Garner',
        'Anita Gros',
        'Megan Smith',
        'Tsvetko Metzger',
        'Hector Simek',
        'Some-guy withalongalastaname'
      ];
      return contacts.map(function (c, index) {
        var cParts = c.split(' ');
        var contact = {
          name: c,
          email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com',
          image: 'http://lorempixel.com/50/50/people?' + index
        };
        contact._lowername = contact.name.toLowerCase();
        return contact;
      });
    }
  
  };
