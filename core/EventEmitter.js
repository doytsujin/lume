/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    /**
     * EventEmitter represents a channel for events.
     *
     * @class EventEmitter
     * @constructor
     */
    function EventEmitter() {
        this.listeners = {};
        this._owner = this;
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} data event data
     * @return {Boolean}
     */
    EventEmitter.prototype.emit = function emit(type, data) {
        var handlers = this.listeners[type];
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].call(this._owner, data);
            }
            return true;
        }
        else return false;
    };

    /**
     * Alias for emit
     * @method trigger
     */
    EventEmitter.prototype.trigger = EventEmitter.prototype.emit;


    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
   EventEmitter.prototype.on = function on(type, handler) {
        if (!(type in this.listeners)) this.listeners[type] = [];
        var index = this.listeners[type].indexOf(handler);
        if (index < 0) this.listeners[type].push(handler);
    };

   /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method off
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventEmitter} this
     */
    EventEmitter.prototype.off = function off(type, handler) {
        var listener = this.listeners[type];
        if (listener !== undefined) {
            if (!handler) this.listeners[type] = []; // remove all listeners of given type
            else {
                var index = listener.indexOf(handler);
                if (index >= 0) listener.splice(index, 1);
            }
        }
    };

    /**
     * Call event handlers with this set to owner.
     *
     * @method bindThis
     *
     * @param {Object} owner object this EventEmitter belongs to
     */
    EventEmitter.prototype.bindThis = function bindThis(owner) {
        this._owner = owner;
    };

    module.exports = EventEmitter;
});