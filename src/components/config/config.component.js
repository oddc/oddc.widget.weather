(function () {
    'use strict';

    angular.module('oddc.widget.weather')
        .component('config', {
            'templateUrl': 'src/components/config/config.component.html',
            'controller': configController,
            'controllerAs': 'configController'
        });

    configController.$inject = ['widgetState', 'weatherService', 'widgetServices', '$scope', '$state', '$timeout', '$log'];

    function configController(widgetState, weatherService, widgetServices, $scope, $state, $timeout, $log) {
        var self = this;

        self.$onInit = function() {
            widgetState.setBackButtonState('index');
        };

        self.locations = [];
        self.showNotingSelectedError = false;
        self.saveLocationError = false;
        self.selectedLocation = null;


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
            console.log(location, self.selectedLocation);
            if (self.selectedLocation === null) {
                self.showNotingSelectedError = true;
            } else {
                if (typeof location.title === 'undefined') {
                    location['title'] = location.label;
                }

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
