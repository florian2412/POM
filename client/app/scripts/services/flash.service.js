(function () {
    'use strict';

    angular.module('pomApp').factory('flashService', Service);

    function Service($rootScope, $alert) {
        var service = {};

        service.Success = Success;
        service.Error = Error;
        service.Info = Info;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(title, message, placement, dismissable, duration)  {
            $alert({
                title: title,
                content: message,
                placement: placement, 
                type: 'success', 
                keyboard: true, 
                container:'body',
                duration : duration,
                dismissable : dismissable
            });
        }

        function Error(title,message,placement, dismissable,duration)  {
            $alert({
                title: title,
                content: message,
                placement: placement, 
                type: 'danger', 
                keyboard: true, 
                container:'body',
                duration : duration,
                dismissable : dismissable
            });
        }

        function Info(title,message,placement, dismissable,duration) {
            $alert({
                title: title,
                content: message,
                placement: placement, 
                type: 'info', 
                keyboard: true, 
                container:'body',
                duration : duration,
                dismissable : dismissable
            });
        }
    }

})();
