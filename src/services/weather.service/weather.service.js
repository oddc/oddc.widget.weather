(function () {

    'use strict';

    angular
        .module('oddc.widget.weather')
        .factory('weatherService', weatherServiceFactory);

    weatherServiceFactory.$inject = ['$log', '$q', 'widgetServices', 'widgetConfiguration'];

    function weatherServiceFactory($log, $q, widgetServices, widgetConfiguration) {
        var _data = null;
        var _currentLocation = null;

        var _service =   {
            loadWeather: loadWeather,
            saveWeatherLocation: saveWeatherLocation,
            getData: getData,
            getCurrentLocation: getCurrentLocation
        };

        function loadWeather() {
            return widgetServices
                .callService('loadCustomLocation')
                .then(function onLoadCustomLocationSuccess(response) {
                    // if there is no custom location set users location from widgetConfiguration:
                    if (response.error) {
                        $log.error(response.message);
                        _currentLocation = widgetConfiguration.location;
                    } else {
                        _currentLocation = response.propertyValueString;
                    }
                    return widgetServices.callService('loadWeather', {
                        location: encodeURIComponent(_currentLocation)
                    });
                })
                .then(function onLoadWeatherSuccess(response) {
                    _data = response.data;
                })
                .catch(function onError(error) {
                    return $q.reject(error);
                });
        }

        function saveWeatherLocation(location) {
            return widgetServices
                .callService('getCurrentUser')
                .then(function onGetCurrentUserSuccess(response) {
                    return widgetServices.callService('saveWeatherLocation', {
                        "id": {
                            "widgetIdentifier": "oddc.widget.weather",
                            "userId": response.openId,
                            "propertyKey": "location",
                            "globalProperty": false
                        },
                        "propertyValueString": location.title
                    });
                })
                .then(function onSaveWeatherLocationSuccess(response) {
                    _currentLocation = location.title;
                    return widgetServices.callService('loadWeather', {
                        location: encodeURIComponent(_currentLocation)
                    });
                })
                .then(function onLoadWeatherSuccess(response){
                    _data = response.data;
                    return true;
                })
                .catch(function onError(error) {
                    return $q.reject(error);
                });
        }

        function getData() {
            return _data;
        }

        function getCurrentLocation() {
            return _currentLocation;
        }

        return _service;
    }

})();