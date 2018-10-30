/* Muhammad Miftah s2757691
 * Angular service used for listening to and dispatching custom notification events. Can be used for: 
 * inter-controller communication;
 * executing commands after another async one has finished without having to use promises;
 * passing data between functions, objects or even controllers!
 * NOTE: a $notify.listen() statement must be executed before a matching $notify.dispatch() is executed!
 * Usage:
 * $notify.listen('event name', callback_function() {});
 * $notify.dispatch('event name', ...); 
 * ... to pass arguments like stirngs or objects ot share to the listener
 */

 function Notifications() {
    var $notify = {
        listen: function(ev, callback) {
            // Create _callbacks object, unless it already exists 
            var calls = this._callbacks || (this._callbacks = {});
            // Create an array for the given event key, unless it exists, then append the callback to the array
            (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback); 
            return this;
        },
        dispatch: function() {
            // console.log(arguments);
            // Turn arguments object into a real array
            var args = Array.prototype.slice.call(arguments, 0);
            // Extract the first argument, the event name 
            var ev = args.shift();
            // Return if there isn't a _callbacks object, or
            // if it doesn't contain an array for the given event 
            var list, calls, i, l;
            if (!(calls = this._callbacks)) return this;
            if (!(list = this._callbacks[ev])) return this;
            
            console.log("Notification: [" + ev + "] fired!");
            
            // Invoke the callbacks
            if (arguments[1] === 1) {
                console.log("Notification: [" + ev + "] dispatch firing once");
                list[0].apply(this, args);
            } else {
                for (i = 0, l = list.length; i < l; i++) {
                    list[i].apply(this, args);  // also pass along any extra arguments
                }
            }

            return this;
        } 
    };

    return $notify;
}

angular.module("s2757691_2622ict_assignment_notifications", []).factory('$notify', Notifications);
