/**
 *
 */
(function (angular) {

    angular.module("BrowserSync")

        .directive("locations", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "js/templates/locations.html",
                controller: ["$scope", "$rootScope", "Socket", "contentSections", locationsController]
            };
        });

    /**
     * Controller for the URL sync
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function locationsController($scope, $rootScope, Socket, contentSections) {

        /**
         *
         */
        $scope.$watch(function() { return contentSections["locations"].active }, function (data) {
            $scope.ui.active = data;
        });

        /**
         * @type {{loading: boolean}}
         */
        $scope.ui = {
            loading: false,
            active: contentSections["locations"].active
        };

        /**
         * @type {{local: *, current: string}}
         */
        $scope.urls = {
            local: $scope.options.urls.local,
            current: "",
            visited: $scope.options._visited
        };

        $scope.selectedUrl = null;

        /**
         * Emit the socket event
         */
        $scope.sendAllTo = function (path) {

            $scope.ui.loading   = true;
            $scope.urls.current = "";

            if (!path || path === "undefined") {
                $scope.ui.loading = false;
                return;
            }

            Socket.emit("urls:browser:url", {
                path: path
            });

            window.setTimeout(function () {
                $scope.$apply(function () {
                    $rootScope.$broadcast("notify:flash", {
                        heading: "Instruction Sent:",
                        message: "Send all browsers to " + path,
                        status: "success",
                        timeout: 2000
                    });
                    $scope.ui.loading = false;
                })
            }, 200);
        };

        /**
         * Emit the reload-all event
         */
        $scope.reloadAll = function () {

            $scope.ui.loading = true;

            Socket.emit("urls:browser:reload");

            window.setTimeout(notify.bind(null, $scope, $rootScope), 200);
        };

        /**
         *
         */
        $scope.updateVisited = function (data) {
            $scope.$apply(function () {
                $scope.urls.visited = data;
            });
        };

        Socket.addEvent("cp:urls:update", $scope.updateVisited);
    }

    /**
     * Let the user know shit is happening
     */
    function notify($scope, $rootScope) {

        $scope.$apply(function () {

            $scope.ui.loading = false;

            $rootScope.$broadcast("notify:flash", {
                heading: "Instruction Sent:",
                message: "Reload all browsers..",
                status: "error",
                timeout: 2000
            });
        });
    }

})(angular);
