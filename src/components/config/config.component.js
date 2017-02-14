(function () {
    'use strict';

    angular.module('oddc.widget.weather')
        .component('config', {
            'templateUrl': 'src/components/config/config.component.html',
            'controller': configController,
            'controllerAs': 'configController'
        });

    configController.$inject = ['widgetState', 'weatherService', 'widgetServices', '$state', '$timeout', '$log'];

    function configController(widgetState, weatherService, widgetServices, $state, $timeout, $log) {
        var self = this;

        self.$onInit = function() {
            widgetState.setBackButtonState('index');
        };

        self.locations = [];
        self.showNotingSelectedError = false;
        self.saveLocationError = false;


        self.onInputChanged = function(value) {
            $timeout.cancel(self.timer);
            self.timer = $timeout(function () {
                if (value.length) {
                    return widgetServices
                        .callService('loadLocations', {
                            search: encodeURIComponent(value)
                        })
                        .then(onLoadLocationsSuccess)
                        .catch(onLoadLocationsError);
                }
            }, 200);

            function onLoadLocationsSuccess(response) {
                if (!response.error) {
                    self.locations = response.data;
                } else {
                    $log.error(response.message);
                }

            }

            function onLoadLocationsError(error) {
                $log.error(error);
            }
        };

        self.submitWeatherLocation = function(location) {
            if (typeof self.selectedLocation == 'undefined' || typeof self.selectedLocation.title == 'undefined') {
                self.showNotingSelectedError = true;
            } else {
                weatherService.saveWeatherLocation(location)
                    .then(function(){
                        $state.go('index');
                    })
                    .catch(function saveWeatherLocationError(error) {
                        self.saveLocationError = true;
                        $log.debug(error);
                    })
            }
        };


    }

})();
