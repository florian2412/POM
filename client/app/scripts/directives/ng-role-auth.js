'use strict';

(function(){

  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.nra-hide { display: none !important; }';
  document.getElementsByTagName('head')[0].appendChild(style);

  var mod = angular.module("ngRoleAuth", []);

  mod.constant("NRA_MSG", {accessDenied : "nra.access_denied"});

  function run($rootScope, auth){
    $rootScope.$on("$stateChangeStart", auth.onChange);
  }

  mod.run(["$rootScope", "AuthService", run]);

})();
(function(){
	var dtCheck = 0;

	function Directive($interval, authService){

		function link(scope, element, attrs){

			var insertionElement = element.parent();
			var removed = false;

			function compile(){

				if(!authService.isAuthorized(scope.authorized)){
					if(!removed){
						element.addClass("nra-hide");
						removed = true;
					}
				}else{
					if(removed){
						element.removeClass("nra-hide");
						removed = false;
					}
				}
			}

			compile();

			$interval(compile, dtCheck);
		}

		var dir = {
			restrict: "A",
			scope: {
				authorized: "=nraAuth",
			},
			link: link
		};

		return dir;
	}

	angular.module("ngRoleAuth").directive("nraAuth", ["$interval", "AuthService", Directive]);
})();
(function(){

  function Service($rootScope, $state, $location, $window, NRA_MSG){

    var self = this;
    var role = null;

    this.getRole = function(){
      return role;
    };

    this.setRole = function(r){
      role = r;
    };

    this.isAuthorized = function(auth){
      if(typeof auth === "string"){
        auth = [auth];
      }

      var roles = self.getRole();
      if(typeof roles === "string"){
        roles = [roles];
      }

      var isAllowed = true;
      if(auth[0]){
        isAllowed = false;
        for(var i = 0; i < roles.length; i++){
          if(auth.indexOf(roles[i]) !== -1){
            isAllowed = true;
            break;
          }
        }
      }
      return isAllowed;
    };

    this.onChange = function(event, next, params, prev){
      var auth = next && next.authorized ? next.authorized : [];

      if(!self.isAuthorized(auth)){
        $rootScope.$broadcast(NRA_MSG.accessDenied,(next ? next.url : ""));
        console.error("Access denied on unauthorized root:", (next ? next.url : ""));
        event.preventDefault();
        $state.go('restricted');
      }
    };
  }

  angular.module("ngRoleAuth").service("AuthService", ["$rootScope", "$state", "$location", "$window", "NRA_MSG", Service]);
})();
