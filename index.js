/* Muhammad Mifah s2757691
 * index.js: it brings all the other modules together
 * here be the routes and facebook provider config
 */

// dependencies object, see the end of this file to see the angular.module() statemnet
var dependencies = [
    'ui.bootstrap',
    'ngRoute',
    'ngAnimate',
    'ngFx',
    'facebook',
    's2757691_2622ict_assignment_notifications',
    's2757691_2622ict_assignment_directives',
    's2757691_2622ict_assignment_dmsTravel',
    's2757691_2622ict_assignment_facebook',
    's2757691_2622ict_assignment_splash',
    's2757691_2622ict_assignment_gallery',
    's2757691_2622ict_assignment_aboutus',
    's2757691_2622ict_assignment_documentation',
];

/* mainCtrl: provides only a few debugging parameters 
 * 
 */
function mainCtrlFn($route, $routeParams, $location) {
    var self = this;

    // debugging
    self.$route = $route;   
    self.$routeParams = $routeParams;
    self.$location = $location;
}

/* routes: routing configuration 
 *
 */
function routesProviderFn($routeProvider, $locationProvider) {
    $routeProvider
    .when('/about', {
        templateUrl: 'views/mm-about-us.html',
        controller: 'aboutusCtrl',
        controllerAs: 'a',
    })
    .when('/gallery', {
        templateUrl: 'views/mm-photo-gallery.html',
        controller: 'photogalleryScreenCtrl',
        controllerAs: 'p',
    })
    .when('/splash', {
        templateUrl: 'views/mm-splash-screen.html',
        controller: 'splashScreenCtrl',
        controllerAs: 's',
    })
    .when('/documentation', {
        templateUrl: 'views/mm-documentation.html',
        controller: 'documentationCtrl',
        controllerAs: 'd',
    })
    .otherwise('/splash');
}

/* facebook: Facebook API configuration
 *
 */
function facebookProviderFn(FacebookProvider) {
    var appID = '584471748350915';

    FacebookProvider.init(appID);
    console.log("Facebook Provider init(appID: " + appID + ");");
}

// app module declaration
var app = angular.module("s2757691_2622ict_assignment", dependencies)
    .controller('mainCtrl', ['$route','$routeParams','$location', mainCtrlFn])
    .config(['$routeProvider','$locationProvider', routesProviderFn])
    .config(['FacebookProvider', facebookProviderFn]);
