/* Muhammad Miftah s2757691
 * associated view: mm-about-us.html
 */

var module_dependencies = [
    'facebook'
];

/* aboutusCtrlN: the same as the splashscreenCtrlFn
 * fetches dmsTravel description from facebook
 */
function aboutusCtrlFn($scope, $timeout, $notify, $dmsTravelDataSvc) {
    var self = this;

    this.fbPage = $dmsTravelDataSvc.getFbPage();
    this.pageDescription = this.fbPage.description || "DMS Travel is a mock travel/holiday company. ";

    /* setup notification listeners and $scope $watches */
    (function() {
        // switching to another route will cause all self.* variables to lose their references
        $scope.$watch(function() { return self.fbPage; }, function(newVal, oldVal) {
            if (typeof newVal === "undefined") {
                console.log("aboutusCtrl self.fbPage changed");
                // console.log(newVal);
                self.fbPage = $dmsTravelDataSvc.getFbPage();
                self.pageDescription = self.fbPage.description;
            }
        });

        $timeout(function() {
            if (!self.fbPage) self.pageDescription += "\n <br /> Could not retrieve fbPage object in time (10s)";
        }, 10000);

        // listen for fbPage: downlaoded message, and store a reference in this ctrlr.
        $notify.listen("fbPage: downloaded", function() {
            self.fbPage = $dmsTravelDataSvc.getFbPage();
            self.pageDescription = $dmsTravelDataSvc.getFbPage().description;
        });
    })();
}

var splash_mod = angular.module("s2757691_2622ict_assignment_aboutus", module_dependencies)
    .controller('aboutusCtrl', ['$scope','$timeout','$notify','$dmsTravelDataSvc', aboutusCtrlFn]);