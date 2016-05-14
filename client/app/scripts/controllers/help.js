'use strict';

/**
 * @ngdoc function
 * @name pomApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pomApp
 */
angular.module('pomApp').controller('HelpCtrl', HelpCtrl);

function HelpCtrl($scope) {
  var vm = this;

  vm.setContent = setContent;
  
  function setContent(page){
  	vm.page = 'views/help.views/'+ page +'.html';
  }

  $scope.$on('$viewContentLoaded', function() {
  	vm.page = 'views/help.views/compte.general.html';

  });
}
