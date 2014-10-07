/**
 *
 */
(function (angular) {

    angular.module("BrowserSync")

        .directive("ghostmode", function () {

            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "js/templates/ghostmode.html",
                controller: ["$scope", "Socket", "contentSections", ghostModeController]
            };
        });

    /**
     * @param $scope
     * @param Socket
     * @param contentSections
     */
    function ghostModeController($scope, Socket, contentSections) {

        var ghostMode = $scope.options.ghostMode;

        /**
         *
         */
        $scope.$watch(function () {
            return contentSections["ghostmode"].active
        }, function (data) {
            $scope.ui.active = data;
        });

        $scope.ui = {
            active: contentSections["ghostmode"].active
        };

        $scope.items = {};
        $scope.formItems = [];

        for (var item in ghostMode) {
            if (item !== "forms") {
                $scope.items[item] = ghostMode[item];
            }
        }

        for (item in ghostMode.forms) {
            $scope.formItems.push({
                name: item,
                key: "forms." + item,
                value: ghostMode.forms[item]
            })
        }

        /**
         * Toggle Options
         * @param key
         * @param value
         */
        $scope.toggle = function (key, value) {
            Socket.emit("cp:option:set", {key: prefixOption(key), value: value});
        };

        /**
         * Toggle Options
         */
        $scope.formToggle = function (item) {
            Socket.emit("cp:option:set", {key: prefixOption(item.key), value: item.value});
        };

        function prefixOption(key) {
            return "ghostMode." + key;
        }
    }

})(angular);