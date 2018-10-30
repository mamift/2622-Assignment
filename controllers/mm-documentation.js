/* Muhammad Miftah s2757691
 * associated view: mm-about-us.html
 */

var module_dependencies = [
    'facebook'
];

/* documentationCtrl: the same as the splashscreenCtrlFn
 * fetches dmsTravel description from facebook
 */
function documentationCtrlFn($scope, $timeout, $notify, $dmsTravelDataSvc) {
    var self = this;

    this.fbPage = $dmsTravelDataSvc.getFbPage();
    this.pageDescription = this.fbPage.description || "DMS Travel is a mock travel/holiday company. ";

    /* setup notification listeners and $scope $watches */
    (function() {
        // switching to another route will cause all self.* variables to lose their references
        $scope.$watch(function() { return self.fbPage; }, function(newVal, oldVal) {
            if (typeof newVal === "undefined") {
                console.log("documentationCtrl self.fbPage changed");
                // console.log(newVal);
                self.fbPage = $dmsTravelDataSvc.getFbPage();
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

var splash_mod = angular.module("s2757691_2622ict_assignment_documentation", module_dependencies)
    .controller('documentationCtrl', ['$scope','$timeout','$notify','$dmsTravelDataSvc', documentationCtrlFn]);