(function () {
    'use strict';

    angular.module('autocomplete', [])
        .component('autocomplete', {
            templateUrl: 'src/plugins/autocomplete/autocomplete.component.html',
            controller: autocompleteController,
            controllerAs: 'ctrl',
            bindings: {
                localData: '=',
                selectedItem: '=',
                searchField: '@',
                titleField: '@',
                inputChanged: '=',
                textSearching: '@',
                textNoResults: '@',
                placeholder: '@',
                pause: '<'
            }
        });

    autocompleteController.$inject = ['$timeout'];

    function autocompleteController($timeout) {
        var self = this;

        self.search = '';
        self.isSearching = false;

        var NOT_CHANGE_KEYCODES = [16, 17, 18, 20, 27, 37, 38, 39, 40, 91];
        var searchTimer = null;


        self.$onInit = function() {
        };


        self.onChange = function (e) {
            if (e === null || NOT_CHANGE_KEYCODES.indexOf(e.keyCode) === -1) {
                self.selectedItem = null;

                if (searchTimer) {
                    $timeout.cancel(searchTimer);
                }

                self.isSearching = true;

                searchTimer = $timeout(function() {
                    self.inputChanged(self.search);
                    self.isSearching = false;
                }, self.pause);
            }
        };


        self.onSelectItem = function(item) {
            self.selectedItem = item;
            self.search = self.getItemValue(item, self.titleField);
            self.data = [];
        };


        self.getItemValue = function(item, field) {
            return item[field];
        };

    }

})();
