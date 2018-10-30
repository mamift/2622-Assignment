/* Muhammad Miftah
 * associated view: mm-splash-screen.html
 */
var module_dependencies = [
    'facebook'
];

/* splashScreenCtrlFn: displays the page description on the page, fetching it from $dmsTravelDataSvc
 * $dmsTravelDataSvc must execute its constructor command before you see anything; there's a slight delay
 */
function splashScreenCtrlFn($scope, $timeout, $notify, $dmsTravelDataSvc, Facebook) {
    var self = this;

    this.fbPage = $dmsTravelDataSvc.getFbPage();
    this.pageDescription = this.fbPage.description || "To view photos, please login to Facebook (at the top right)";

    /* setup notification listeners and $scope $watches */
    (function() {
        // watch for when getFbPage() actually returns a fbPage object; it returns a string if it hasnt been downloaded
        $scope.$watch(function() { return self.fbPage; }, function(newVal, oldVal) {
            if (typeof newVal === "undefined") {
                console.log("splashScreenCtrl self.fbPage changed");
                // console.log(newVal);
                this.fbPage = $dmsTravelDataSvc.getFbPage();
                self.pageDescription = self.fbPage.description;
            }
        });

        // listen for fbPage: downlaoded message, and store a reference in this ctrlr.
        $notify.listen("fbPage: downloaded", function() {
            self.fbPage = $dmsTravelDataSvc.getFbPage();
            self.pageDescription = $dmsTravelDataSvc.getFbPage().description;
        });
    })();
}

var splash_mod = angular.module("s2757691_2622ict_assignment_splash", module_dependencies)
    .controller('splashScreenCtrl', ['$scope','$timeout','$notify','$dmsTravelDataSvc','Facebook', splashScreenCtrlFn]);