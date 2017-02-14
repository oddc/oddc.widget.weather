(function () {
    'use strict';

    angular.module('oddc.widget.weather')
        .component('weather', {
            'templateUrl': 'src/components/weather/weather.component.html',
            'controller': weatherController,
            'controllerAs': 'weatherController'
        });

    weatherController.$inject = ['weatherService', '$log', '$state'];

    function weatherController(weatherService, $log, $state) {
        var self = this;

        self.weatherService = weatherService;

        self.actions = [
            {
                icon: 'icon-cog',
                title: 'Einstellungen',
                action: function() {
                    $state.go('config');
                }
            }
        ];

        self.$onInit = function() {
            if (weatherService.getData() === null) {
                weatherService.loadWeather().catch(function () {
                    $log.error('fehler');
                });
            }
        }

    }

})();