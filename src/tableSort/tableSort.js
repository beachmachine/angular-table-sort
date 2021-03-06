/**
 * Angular TableSort
 * Copyright 2016 Andreas Stocker
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


(function () {
    'use strict';

    var
        module = angular.module('ngTableSort');

    /**
     * Directive for client side table sorting.
     *
     * @name tableSort
     * @ngdoc directive
     */
    module.directive('tableSort',
        function () {
            return {
                restrict: 'A',
                scope: true,
                controller: 'TableSortController'
            };
        }
    );

    /**
     * Controller for client side table sorting.
     *
     * @name TableSortController
     * @ngdoc controller
     * @class
     */
    module.controller('TableSortController',
        function ($scope,
                  $filter) {
            'ngInject';

            var
                self = this,
                orderBy = $filter('orderBy'),
                tableSortField = null,
                tableSortReverse = null;

            /**
             * Gets the expression to sort on.
             *
             * @memberof TableSortController
             * @function getTableSortField
             * @return {*}
             * @instance
             */
            self.getTableSortField = function () {
                return tableSortField;
            };

            /**
             * Sets the expression to sort on.
             *
             * @memberof TableSortController
             * @function setTableSortField
             * @param config
             * @instance
             */
            self.setTableSortField = function (config) {
                tableSortField = config;
            };

            /**
             * Gets whether to sort in reverse order or not.
             *
             * @memberof TableSortController
             * @function getTableSortReverse
             * @return {boolean}
             * @instance
             */
            self.getTableSortReverse = function () {
                return !!tableSortReverse;
            };

            /**
             * Sets whether to sort in reverse order or not.
             *
             * @memberof TableSortController
             * @function setTableSortReverse
             * @param reverse
             * @instance
             */
            self.setTableSortReverse = function (reverse) {
                tableSortReverse = reverse;
            };

            /**
             * Sorts the given list by the sort configuration.
             *
             * @memberof TableSortController
             * @function tableSort
             * @param list
             * @return {*}
             * @instance
             */
            self.tableSort = function (list) {
                var
                    field = self.getTableSortField(),
                    reverse = self.getTableSortReverse();

                // Only sort when we have a field to sort on
                if (field) {
                    // Publish the scope on each item
                    for (var i = 0; i < list.length; i++) {
                        list[i].$$scope = $scope;
                        list[i].$$this = list[i];
                    }

                    list = orderBy(list, field, reverse);

                    // Remove the scope from each item
                    for (var j = 0; j < list.length; j++) {
                        delete list[j].$$scope;
                        delete list[j].$$this;
                    }
                }

                return list;
            };

            /*
             * Publish the API on the scope
             */
            $scope.getTableSortField = self.getTableSortField;
            $scope.setTableSortField = self.setTableSortField;
            $scope.getTableSortReverse = self.getTableSortReverse;
            $scope.setTableSortReverse = self.setTableSortReverse;
            $scope.tableSort = self.tableSort;
        }
    );

    /**
     * Directive for client side table sorting on a specific field.
     *
     * @name tableSortField
     * @ngdoc directive
     */
    module.directive('tableSortField',
        function () {
            return {
                require: '^tableSort',
                restrict: 'A',
                scope: true,
                controller: 'TableSortFieldController',
                link: function (scope, element, attrs, tableSortCtrl) {
                    scope.tableSortCtrl = tableSortCtrl;
                    scope.tableSortField = attrs.tableSortField;
                    scope.tableSortInitial = !angular.isUndefined(attrs.tableSortInitial);
                    scope.tableSortReverseInitial = !angular.isUndefined(attrs.tableSortReverseInitial);
                }
            };
        }
    );

    /**
     * Controller for client side table sorting.
     *
     * @name TableSortFieldController
     * @ngdoc controller
     * @class
     */
    module.controller('TableSortFieldController',
        function ($scope) {
            'ngInject';

            var
                self = this,
                reverse = false;

            // Set the constructor
            self.$onInit = init;

            /**
             * Calls the sort operation on the table sort directive.
             *
             * @memberof TableSortFieldController
             * @function tableSort
             * @instance
             */
            self.tableSort = function () {
                var
                    currentField = $scope.tableSortCtrl.getTableSortField(),
                    selfField = $scope.tableSortField;

                // Toggle reverse if we are already sorting on this field, else
                // do not reverse
                reverse = currentField === selfField ? !reverse : reverse;

                $scope.tableSortCtrl.setTableSortField(selfField);
                $scope.tableSortCtrl.setTableSortReverse(reverse);
            };

            /**
             * Checks if this is the field we are currently sorting on.
             *
             * @memberof TableSortFieldController
             * @function current
             * @return {boolean}
             * @instance
             */
            self.current = function () {
                var
                    currentField = $scope.tableSortCtrl.getTableSortField(),
                    selfField = $scope.tableSortField;

                return currentField === selfField;
            };

            /**
             * Checks if we are sorting on reverse order.
             *
             * @memberof TableSortFieldController
             * @function reverse
             * @return {boolean}
             * @instance
             */
            self.reverse = function () {
                return !!reverse;
            };

            /*
             * Publish the API on the scope
             */
            $scope.tableSort = self.tableSort;
            $scope.current = self.current;
            $scope.reverse = self.reverse;

            /**
             * Initializes the initial sorting on the field.
             *
             * @memberof TableSortFieldController
             * @function initInitial
             * @instance
             * @private
             */
            function initInitial () {
                var
                    unwatch = $scope.$watch(
                        function watcher () {
                            return $scope.tableSortField;
                        },
                        function callback (tableSortField) {
                            // Do nothing if we do not have the value yet
                            if (!tableSortField) {
                                return;
                            }

                            // De-register the watcher
                            unwatch();

                            // Reverse the initial sort if the reverse attribute is set on the
                            // directive.
                            if ($scope.tableSortReverseInitial) {
                                console.log("TableSortFieldController: Initial sort reversed on expression '" + tableSortField + "'.");

                                reverse = true;
                            }

                            // Sort if this field is configured as initial sort field and there is
                            // no sort configuration yet
                            if ($scope.tableSortInitial && !$scope.tableSortCtrl.getTableSortField()) {
                                console.log("TableSortFieldController: Initial sort on expression '" + tableSortField + "'.");

                                $scope.tableSort();
                            }
                        }
                    )
            }

            /**
             * Initializes the directive.
             *
             * @memberof TableSortFieldController
             * @function init
             * @instance
             * @private
             */
            function init () {
                initInitial();
            }
        }
    );
})();
