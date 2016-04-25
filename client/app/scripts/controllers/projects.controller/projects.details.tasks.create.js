/**
 * Created by sarra on 25/04/2016.
 */

'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:ProjectsDetailsTasksCreateCtrl
 * @description
 * # ProjectsDetailsTasksCreateCtrl
 * Controller of the projects.details.tasks.create
 */

angular.module('pomApp')
  .controller('ProjectsDetailsTasksCreateCtrl',
    function ($scope, $state, $mdDialog, $stateParams, databaseService, FlashService, authenticateService) {

    $scope.createTask = function() {
      var idProject = $stateParams.id

      /**if(!$scope.project.startDate)
       $scope.project.startDate = new Date();

       if(!$scope.project.endDate)
       $scope.project.endDate = new Date();*/

      var nom = $scope.task.name;
      /**var chef_projet = authenticateService.getCurrentUser()._id;
       var statut = $scope.project.statut;
       var date_debut = $scope.project.startDate;
       var date_fin_theorique = $scope.project.endDate;*/

      /*var date_debut = new Date();
       var date_fin_theorique = new Date();*/
      //var ligne_budgetaire = $scope.budget._id;

      // TODO Faire la validation du formulaire de création de projet
      /*var data = "{ \"nom\": " + "\"" + nom + "\" "
       + ", \"statut\": " + "\"" + statut + "\" "
       + ", \"chef_projet\": \"" + chef_projet + "\" "
       + ", \"date_debut\": \"" + date_debut + "\" "
       + ", \"date_fin_theorique\": \"" + date_fin_theorique + "\" }";
       /*+ ", \"collaborateurs\": \"" + collaborateurs + "\" "
       + ", \"collaborateurs\": \"" + collaborateurs + "\" } ";*/

      var task = {
        "libelle" : nom
        /**,"statut" : statut,
         "chef_projet" : chef_projet,
         "date_debut" : date_debut,
         "date_fin_theorique" : date_fin_theorique*/
      };

      var tasks = [task];

      var data = {
        "taches" : tasks
      };

      console.log(data);

      databaseService.updateObject('projects', idProject, data)
        .success(function (data) {
          console.log(data);
          //showSuccessDialog();
          FlashService.Success("Création de la tâche " + nom + " réussie.", "", "bottom-right", true, 4);
          $state.go("projects.details.tasks");
        })
        .error(function (err) {
          console.log(err);
        });
    };


    // Lancement au chargement de la page
    /*$scope.$on('$viewContentLoaded', function() {
     // Infos en dur pour le moment
     $scope.budgets = ["Ligne budget 1 : 30000€", "Ligne budget 2 : 50000€", "Ligne budget 3 : 100000€"];
     $scope.statuts = ["Initial", "En cours", "Annulé", "Terminé"]
     });*/

    function showSuccessDialog() {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Confirmation de création')
          .textContent('La tâche ' + $scope.task.name + ' a bien été créé !')
          .ariaLabel('Création de la tâche réussie')
          .ok('Ok'));
    };

    $scope.minDate = new Date();

    $scope.showCancelDialog = function(event) {

      var confirm = $mdDialog.confirm()
        .title('Alerte')
        .textContent('Etes-vous sûr d\'annuler la création de la tâche ?')
        .ariaLabel('Annulation')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(function() {
        $state.go("projects.details.tasks");
      }, function() {

      });
    };

  });

