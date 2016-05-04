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


    $scope.showPrompt = showCollaboratorPicker;
    $scope.user = localStorageService.get('currentUser');
    var idCurrentUser = localStorageService.get('currentUser')._id;
    console.log(idCurrentUser);

    $scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    databaseService.getProjectsCollaborator(idCurrentUser)
      .success(function (data) {
        console.log(data);
        var statuts = [];
        var projects = data;
        for (var i = 0; i < projects.length; i++)
        statuts.push(projects[i].statut);
        console.log(statuts);

        /* Récupération des intitulés des statuts ainsi que du nombre de projets par statut*/

        var numberProjectsByStatuts = statuts;

        function countProjects(numberProjectsByStatuts) {
          var a = [], b = [], prev;

          numberProjectsByStatuts.sort();
          for ( var j = 0; j < numberProjectsByStatuts.length; j++ ) {
            if ( numberProjectsByStatuts[j] !== prev ) {
              a.push(numberProjectsByStatuts[j]);
              b.push(1);
            } else {
              b[b.length-1]++;
            }
            prev = numberProjectsByStatuts[j];
          }
          return [a, b];
        }

        var nb = countProjects(numberProjectsByStatuts);

        /* Nombre de projets par statut*/
        $scope.doughnutData = nb[1];
        /* Intitulés des statuts */
        $scope.doughnutLabels = nb[0];
      });


        $scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.lineSeries = ['Théorique', 'Réel'];
        $scope.data = [
      [10, 20, 25, 35, 40, 50, 55, 60, 70, 75, 80, 85],
      [10, 23, 30, 37, 42, 48, 52, 62, 70, 73, 80, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
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

    function showCollaboratorPicker(ev) {

      $mdDialog.show({
        controller: _PasswordUpdateController,
        templateUrl: 'views/shared/updatePass.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false
      });
    };

    function _PasswordUpdateController($scope, $mdDialog) {
      $scope.cancel = function() { $mdDialog.hide(); }
      $scope.updpass = function(usr){
        var pass = [];
        if( usr.pass){
          pass.push( usr.pass);
        }
        if( usr.confirm){
          pass.push( usr.confirm);
        }
        if( pass.length > 1 && (pass[0] === pass[1])){
          process( localStorageService.get('currentUser'), pass[0]);
        }else{
          flashService.Error('Erreur ! ', 'Imposible de mettre à jour le mot de passe', 'bottom-right', true, 4);
        }
        $mdDialog.hide();
      }
    }

    function process( user, pass){
      processUpdatePass( user, pass);
    };
    var processUpdatePass = function (user, pass){
      if(user && pass){
        authenticateService.updatePassword( user, pass,
          function(response){
            if(response.success){
              flashService.Success("Mise à jour du mot de passe réussie ! ", response.message, "bottom-right", "true", 4);
            }else{ flashService.Error("Echec de la mise à jour du mot de passe ! ", response.message, "bottom-right", "true", 4);}
          });
      } else {flashService.Error('Erreur ! ', 'Veuillez entrer un nouveau mot de passe', 'bottom-right', true, 4);}
    }
  })
  .config(function(ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions('Doughnut',{
    colours: ['#FF0000', '#FF6600','#0000FF' , '#00FF00'],
    responsive: true
  });
});
