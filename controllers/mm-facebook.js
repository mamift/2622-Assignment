/* Muhammad Miftah s2757691
 * associated view: index.html
 */

var dependencies = [
    'facebook',
    's2757691_2622ict_assignment_notifications'
];

/* facebookLoginCtrl: handles all login functions related to Facebook, such as login etc
 * communicates with the $dmsTravelDataSvc (inside mm-facebookdmsTravel.js) using $notify
 */
function facebookLoginCtrlFn($scope, Facebook, $notify) {
    var self = this;

    this.fbLoggedIn = false;                    // determines if user is logged in
    this.fbAuthresponse = {};                   // saved for future reference
    this.fbUser = {};                           // the data returned by /me 

    /* List of $notify messages that this ctrlFn will dispatch()
     * [fbLoggedIn: true]
     * [fbLoggedOut: true]
     * [fbUser: downloaded]
     * [fbReady: true]
     * [fbReady: false]
     */

    /* setup notification listeners and $scope $watches */
    (function(){    
        // listen on succesful login event, and then get current user info and also the FB page for DMS travel 
        $notify.listen("fbLoggedIn: true", function() {
            self.performGetMe();
        });

        // listen when fbUser object has downloaded; now we can start requesting access tokens
        $notify.listen("fbReady: true", function() {
            self.performGetLoginStatus();
        });

        $scope.$watch(function() { return self.fbLoggedIn; }, function(newVal, oldVal) {
            if (newVal) $notify.dispatch("fbLoggedIn: true");
            else        $notify.dispatch("fbLoggedOut: true");
        });

        $scope.$watch(function() { return self.fbUser; }, function(newVal, oldVal) {
            if (newVal.hasOwnProperty('id')) $notify.dispatch("fbUser: downloaded", self.fbUser);
        });

        $scope.$watch(function() { return Facebook.isReady(); }, function(newVal, oldVal) {
            if (newVal === true) $notify.dispatch("fbReady: true");
            else              $notify.dispatch("fbReady: false");
        });
    })();

    /* performFbLogin: invokes Facebook.login to log in the user
     * invoked by control in the view (index.html)
     */
    this.performFbLogin = function() {
        if (!self.fbLoggedIn) {
            Facebook.login(function(response) {
                // console.log("facebookCtrl.performFbLogin(): peforming login");
                // console.log(response);
                if (response.status === 'connected') {
                    self.fbLoggedIn = true;
                    self.fbAuthresponse = response;
                }
            }, { scope: 'user_likes,publish_actions' } );
        } else {
            var c = confirm("Are you sure you want to logout out of Facebook?");
            if (c) {
                Facebook.logout(function() {
                    // console.log('facebookCtrl.performFbLogin(): performing logout');
                    self.fbLoggedIn = false;
                    self.fbUser = {};
                });
            }
        }
    };

    /* performGetLoginStatus: invokes Facebook.getLoginStatus to determine login status
     * invoked on controller startup
     */
    this.performGetLoginStatus = function() {
        Facebook.getLoginStatus(function(response) {
            // console.log("facebookCtrl.getLoginStatus()");
            // console.log(response);
            self.fbLoggedIn = (response.status === 'connected');
        });
    };

    /* getFbUsername: a function that returns the current user's username or the text "Log into Facebook"
     * used by the view
     */
    this.getFbUsername = function() {
        return (self.fbLoggedIn) ? ((self.fbUser.first_name || "") +' '+ (self.fbUser.last_name || "...")) : "Log into Facebook";
    };

    /* getFbLogtext: a function to determine the text displayed when the popover over the .fb-login-link shows
     * shows an appropraite message depending on whether the user is logged in or not
     * duh
     */
    this.getFbLogtext = function() {
        return (self.fbLoggedIn) ? ("Click here to logout") : ("Click here to login");
    };

    /* getUser: invokes the Facebook API (Facebook.api('me')) to retrieve info about the current user
     * invoked after Facebook.login has been completed successfully
     */
    this.performGetMe = function() {
        Facebook.api('/me', function(response) {
            // console.log("facebookCtrl.getMe()");
            // console.log(response);
            self.fbUser = response;
        });
    };
}

angular.module("s2757691_2622ict_assignment_facebook", dependencies)
.controller('facebookLoginCtrl', ['$scope','Facebook','$notify', facebookLoginCtrlFn]);