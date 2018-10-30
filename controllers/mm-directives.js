/* Muhammad Miftah s2757691
 * angular directives used in the app. most are wrappers for bootstrap elements.
 * most are used in index.html if one wants to see hwo they are used
 */

// http://stackoverflow.com/questions/2206892/jquery-convert-dom-element-to-different-type
/* private method */
var cloneAndConvert = function(tag, elem) {
    // console.log(tag);
    // console.log(elem);
    var newElem = document.createElement(tag),
        i, prop,
        attr = elem.attributes,
        attrLen = attr.length;

    // Copy children 
    elem = elem.cloneNode(true);
    while (elem.firstChild) {
        newElem.appendChild(elem.firstChild);
    }

    // Copy DOM properties
    for (i in elem) {
        try {
            prop = elem[i];
            if (prop && i !== 'outerHTML' && (typeof prop === 'string' || typeof prop === 'number')) {
                newElem[i] = elem[i];
            }
        } catch(e) { /* some props throw getter errors */ }
    }

    // Copy attributes
    for (i = 0; i < attrLen; i++) {
        newElem.setAttribute(attr[i].nodeName, attr[i].value);
    }

    // Copy inline CSS
    newElem.style.cssText = elem.style.cssText;

    return newElem;
};

function mmButton() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs, trans) {

            return function(scope, elem, attrs) {
            
            };
        },
        template: '<button class="btn" ng-transclude>' + '</button>',
        replace: true
    };
}

function mmNavlinks() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {
            elem.removeAttr('class');

            return function(scope, elem, attrs) {

            };
        },
        template: '<ul class="nav navbar-nav" ng-transclude>' + '</ul>',
        replace: false
    };
}

function mmNavlink() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {
            var anchor = elem.find('a').first();

            if (attrs['class'])     anchor.addClass(attrs['class']);
            if (attrs['href'])      anchor.attr('href', attrs['href']);
            if (attrs['uiSref'])    anchor.attr('ui-sref', attrs['uiSref']);
            // if (attrs['ngClick'])   anchor.attr('ng-click', attrs['ngClick']);
            
            elem.removeAllAttributes();

            return function(scope, elem, attrs) {

            };
        },
        template: '<li> <a ng-transclude>' + '</a> </li>',
        replace: true
    };
}

function mmNavlinkdivider() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {

            return function(scope, elem, attr) {

            };
        },
        template: '<li class="divider" ng-transclude>' + '</li>',
        replace: true
    }
}

function mmNavlinkdropdown() {
    var directive_def = {
        restrict: 'E',
        transclude: true,
        scope: false,
        compile: function(elem, attrs) {
            elem.removeAttr('text');

            return function(scope, elem, attrs) {
                scope.dropdowntext = attrs['text'];
            };
        },
        templateUrl: 'views/templates/mm-navbar-dropdown.html',
        replace: true
    };

    return directive_def;
}

function mmNav() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            brandtext:  '@',
            brandlink:  '@',
        },
        compile: function(elem, attrs) {
            // find the <nav> tag
            var nav = elem.find('nav').first();
            // add additional attributes and classes to the <nav> tag
            if (attrs['id'])    nav.attr('id', attrs['id']);
            if (attrs['class']) nav.addClass(attrs['class']);
            if (attrs['role'])  nav.attr('role', attrs['role']);

            // find the <a> for the brandlink
            var aBrandlink = elem.find('a').first();
            // add additional classes to the brandlink
            if (attrs['brandclass']) aBrandlink.addClass(attrs['brandclass']);

            // remove all other attributes from the root tag
            elem.removeAllAttributes(); 

            return function(scope, elem, attrs) {

            };
        },
        templateUrl: 'views/templates/mm-navbar.html',
        replace: false
    };
}

function mmNavbar() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs, trans) {
            var navbar = elem.find('ul').first();

            if (attrs['class']) navbar.addClass(attrs['class']);

            elem.removeAllAttributes();

            return function(scope, elem, attrs) {

                trans(scope, function(clone) {
                    var transclude_elem = elem.find("ul[ng-transclude]").first()
                    transclude_elem.children().first().replaceWith(clone);
                });
            };
        },
        template: '<ul class="nav navbar-nav" ng-transclude>' + '</ul>',
        replace: false
    };
}

/* usage: 
 * <mm:modal class="modal" id="" tabindex="" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> </mm:modal>
 */
function mmModal() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {
            var modal_div = elem.find('div[class="modal"]').first();

            if (attrs['id'])                modal_div.attr('id', attrs['id']);
            if (attrs['class'])             modal_div.addClass(attrs['class']);
            if (attrs['role'])              modal_div.attr('role', attrs['role']);
            if (attrs['tabindex'])          modal_div.attr('tabindex', attrs['tabindex']);
            if (attrs['ariaLabelledby'])    modal_div.attr('aria-labelledby', attrs['ariaLabelledby']);
            if (attrs['ariaHidden'])        modal_div.attr('aria-hidden', attrs['ariaHidden']);

            // console.log(modal_div);
            elem.removeAllAttributes();

            return function(scope, elem, attrs) {

            };
        },
        templateUrl: 'views/templates/mm-modal.html',
        replace: false,
    };
}

function mmModalheader() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {

            return function(scope, elem, attrs) {

            };
        },
        templateUrl: 'views/templates/mm-modal-header.html',
        replace: false
    };
}

function mmModalbody() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {

            return function(scope, elem, attrs) {

            };
        },
        templateUrl: 'views/templates/mm-modal-body.html',
        replace: false
    };
}

function mmModalfooter() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        compile: function(elem, attrs) {

            return function(scope, elem, attrs) {

            };
        },
        templateUrl: 'views/templates/mm-modal-footer.html',
        replace: false
    };
}

function mmPopover() {
    return {
        restrict: 'A',
        transclude: false,
        scope: true,
        compile: function(elem, attrs, trans) {
            // console.log("compile()");

            // console.log("elem:");
            // console.log(elem);
            // console.log("attrs:");
            // console.log(attrs);
            // console.log("trans:");
            // console.log(trans);

            var mmPopover_data = attrs.mmPopover.split(';');

            // bootstrap popover options, http://getbootstrap.com/javascript/#popovers
            var animation, container, content, delay, title, html, placement, selector, template, title, trigger, viewport;
            
            for (str in mmPopover_data) {
                if (str.indexOf('animation') !== -1)   animation = str;
                if (str.indexOf('container') !== -1)   container = str;
                if (str.indexOf('content') !== -1)     content = str;
                if (str.indexOf('delay') !== -1)       delay = str;
                if (str.indexOf('html') !== -1)        html = str;
                if (str.indexOf('placement') !== -1)   placement = str;
                if (str.indexOf('selector') !== -1)    selector = str;
                if (str.indexOf('template') !== -1)    template = str;
                if (str.indexOf('title') !== -1)       title = str;
                if (str.indexOf('trigger') !== -1)     trigger = str;
                if (str.indexOf('viewport') !== -1)    viewport = str;
            }

            jQuery(elem).popover({
                animation: (animation || true),
                container: (container || "body"),
                content:   (content   || ""),
                delay:     (delay     || 500),
                html:      (html      || false),
                placement: (placement || "bottom"),
                selector:  (selector  || false),
                template:  (template  || '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'),
                title:     (title     || ""),
                trigger:   (trigger   || 'click'),
                viewport:  (viewport  || { selector: 'body', padding: 0 }),
            });

            console.log(mmPopover_data);
            console.log("title: " + title);
            console.log("content: " + content);

            return function(scope, elem, attrs) {
                console.log("link():");

                console.log("scope");
                console.log(scope);
                console.log("elem");
                console.log(elem);
                console.log("attrs");
                console.log(attrs);

                trans(scope, function(clone) {
                    console.log("trans():");
                    
                    console.log("clone");
                    console.log(clone);
                });
            };
        },
        template: '',
        replace: false
    };
}

var app = angular.module("s2757691_2622ict_assignment_directives", [])
    .directive('mmButton', mmButton)
    .directive('mmNav', mmNav)
    .directive('mmNavbar', mmNavbar)
    .directive('mmNavlink', mmNavlink)
    .directive('mmNavlinkdivider', mmNavlinkdivider)
    .directive('mmNavlinkdropdown', mmNavlinkdropdown)
    .directive('mmNavlinks', mmNavlinks)
    .directive('mmModal', mmModal)
    .directive('mmModalheader', mmModalheader)
    .directive('mmModalbody', mmModalbody)
    .directive('mmModalfooter', mmModalfooter)
    .directive('mmPopover', mmPopover);