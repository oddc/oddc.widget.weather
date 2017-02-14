(function () {
    'use strict';

    angular.module('oddc.widget.weather', ['widgetbuilder', 'angucomplete-alt'])
        .config(function stateConfig($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('index', {
                    url: '/',
                    template: '<weather />',
                    data: {
                        cssClassNames : 'index'
                    }
                })
                .state('config', {
                    url: '/config',
                    template: '<config />',
                    data: {
                        cssClassNames : 'config'
                    }
                });

            $urlRouterProvider.otherwise('/');
        });

})();