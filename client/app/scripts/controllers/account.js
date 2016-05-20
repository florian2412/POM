'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the pomApp
 */
angular.module('pomApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $location, $mdDialog,localStorageService, databaseService, authenticateService, flashService) {

    $scope.showUpdatePassword = showUpdatePassword;
    $scope.user = localStorageService.get('currentUser');

    var idCurrentUser = localStorageService.get('currentUser')._id;

    var vm = this;

    //vm.updateCollaborator = updateCollaborator;
    //vm.showCancelDialog = showCancelDialog;



    /*
     function updateCollaborator() {

     // TODO UPLOAD IMAGE IN DB
     var currentUserFirstName = currentUser.prenom;
     var currentUserLastName = currentUser.nom;

     var imgPath = 'client/app/images/slogan.png';

     //      var dataImg = fs.readFileSync(imgPath);
     var contentTypeImg = 'image/png';

     var avatar = {
     //      "data": dataImg,
     "contentType": contentTypeImg
     };


     var data = {
     "avatar":avatar
     };

     databaseService.updateObject('collaborators', idCurrentUser, data)
     .success(function (data) {
     flashService.Success("Le collaborateur " + currentUserFirstName + " " + currentUserLastName + " a bien été mis à jour !", "", "bottom-right", true, 4);
     $state.go("collaborators");
     })
     .error(function (err) {
     console.log(err);
     });
     };
     */

    function getData(callback) {
      databaseService.getCollaboratorProjects(idCurrentUser)
        .success(function (data) {
          console.log(data);
          var statuts = [];
          var projects = data;
          for (var i = 0; i < projects.length; i++)
            statuts.push(projects[i].statut);
          //console.log(statuts);

          /* Récupération des intitulés des statuts ainsi que du nombre de projets par statut*/

          var numberProjectsByStatuts = statuts;

          function countProjects(numberProjectsByStatuts) {
            var a = [], b = [], prev;

            numberProjectsByStatuts.sort();
            for (var j = 0; j < numberProjectsByStatuts.length; j++) {
              if (numberProjectsByStatuts[j] !== prev) {
                a.push(numberProjectsByStatuts[j]);
                b.push(1);
              } else {
                b[b.length - 1]++;
              }
              prev = numberProjectsByStatuts[j];
            }
            return [a, b];
          }

          var nb = countProjects(numberProjectsByStatuts);
          console.log(nb[0]);
          console.log(nb[1]);

          var newData = [];
          for (var k = 0; k < nb[0].length; k++) {
            var dataJson = {
              'y': nb[1][k],
              'name': nb[0][k]
            };

            newData.push(dataJson);
          }
          callback(newData);

      });
    }
    /**********************************************************************************************************
     Pie chart of all projects
     *********************************************************************************************************/

    getData(function (newData) {


      $(function () {

        $(document).ready(function () {

          // Build the chart
          $('#piechart').highcharts({
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: true,
              type: 'pie'
            },
            title: {
              text: 'Compte rendu de vos projets'
            },
            tooltip: {
              pointFormat: 'Nombre de projets :<b>{point.y}</b> <br> Soit :<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false
                },
                showInLegend: true
              }
            },
            series: [{
              colorByPoint: true,
              data: newData
            }]
          })
        })
      });
    });
    /**********************************************************************************************************
     **********************************************************************************************************
     *********************************************************************************************************/


    function showPrompt(ev) {//todo hide password content for security
      var confirm = $mdDialog.prompt()
        .title('Changer votre mot de passe')
        .textContent('Entrer la nouvelle valeur : ')
        .placeholder('')
        .ariaLabel('Mot de passe')
        .targetEvent(ev)
        .ok('Changer')
        .cancel('Annuler');
      $mdDialog.show(confirm).then(function(result) {
        process( $scope.user, result);
      }, function() {});
    };

    function showUpdatePassword(ev) {

      $mdDialog.show({
        controller: _PasswordUpdateController,
        templateUrl: 'views/shared/update.password.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false
      });
    };

    function _PasswordUpdateController($scope, $mdDialog) {
      $scope.cancel = function() { $mdDialog.hide(); }
      $scope.updatePassword = function(user){

        if(user){
          authenticateService.updatePassword(user.confirmedNewPassword,
            function(response){
              if(response.success){
                flashService.success("Succés ! ", response.message, "bottom-right", "true", 4);
              }
              else {
                flashService.error("Echec ! ", response.message, "bottom-right", "true", 4);
              }
            });
        }
        else {
          flashService.error('Erreur ! ', 'Veuillez entrer un nouveau mot de passe', 'bottom-right', true, 4);
        }
        $mdDialog.hide();
      }
    }
  });



