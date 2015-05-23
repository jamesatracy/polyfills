/**
 * DOM Events Polyfill
 * ----------------------------------------------------------------------------
 * Polyfills for DOM Level 2 Event and EventTarget interfaces for compatibility
 * with older version of Internet Explorer.
 *
 * Native browser support for Event and EventTarget:
 *   Chrome     1.0+
 *   Firefox    1.6+
 *   IE         9.0+
 *   Opera      7.0+
 *   Safari     1.0+
 *
 * Adapted from:
 * https://github.com/nuxodin/EventListener/blob/master/EventListener.js
 *
 * @author James Tracy <jtracy@azaleahealth.com>
 */
(function (win, doc) {
  function addToEventTargetProto(name, method) {
    Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
  }

  /* --------------------------------------------------------------------------
   * EventTarget
   * ------------------------------------------------------------------------*/
  if (!win.addEventListener && win.attachEvent) {
    /**
     * addEventListener
     * @param  {String}   type     The name of the event
     * @param  {Function} callback Callback function or EventListener
     */
    addToEventTargetProto('addEventListener', function(type, callback) {
      var target = this,
          // map of event type => array of callbacks
          listeners = target.__listeners__ = target.__listeners__ || {},
          // array of callbacks for this event type
          typeListeners = listeners[type] = listeners[type] || [];

      // if there are no events then attach the listener
      if (!typeListeners.length) {
        typeListeners.handler = function (event) {
          event = event || window.event;
          var documentElement = doc.documentElement;

          // polyfill w3c properties
          event.target = event.srcElement || target;
          event.pageX = event.clientX + documentElement.scrollLeft;
          event.pageY = event.clientY + documentElement.scrollTop;
          event.relatedTarget = event.fromElement || null;
          event.currentTarget = target;
          event.timeStamp = new Date();
          // used to implement DOM Level 3 stopImmediatePropagation
          event.immediatePropagation = true;
          // polyfill w3c methods
          event.preventDefault = function () {
            event.defaultPrevented = true;
            event.returnValue = false;
          };
          event.stopPropagation = function () {
            event.cancelBubble = true;
          };
          // DOM Level 3 stopImmediatePropagation (bonus)
          event.stopImmediatePropagation = function () {
            event.immediatePropagation = false;
            event.cancelBubble = true;
          };

          // create a cached list of the master events list (to protect this
          // loop from breaking when an event is removed)
          var typeListenersCache = [].concat(typeListeners);
          // envoke each listener attached for this event type
          for (var i = 0, len1 = typeListenersCache.length; event.immediatePropagation && i < len1; i++) {
            // check to see if the cached event still exists in the master event list
            for (var j = 0, len2 = typeListeners.length, typeListener; j < len2; j++) {
              typeListener = typeListeners[j];
              if (typeListener === typeListenersCache[i]) {
                typeListener.call(target, event);
                break;
              }
            }
          }
        }

        target.attachEvent('on' + type, typeListeners.handler);
      }

      // add this event callback to the event list
      typeListeners.push(callback.handleEvent ? callback.handleEvent : callback);
    });

    /**
     * removeEventListener
     * @param  {String}   type     The name of the event
     * @param  {Function} callback Callback function or EventListener
     */
    addToEventTargetProto('removeEventListener', function(type, callback) {
      var target = this,
          // map of event type => array of callbacks
          listeners = target.__listeners__ = target.__listeners__ || {},
          // array of callbacks for this event type
          typeListeners = listeners[type] = listeners[type] || [];

      callback = callback.handleEvent ? callback.handleEvent : callback;

      // remove the newest matching event from the list
      for (var i = 0, len = typeListeners.length; i < len; i++) {
        var typeListener = typeListeners[i];
        if (typeListener === callback) {
          typeListeners.splice(i, 1);
          break;
        }
      }

      // if no events exist, detach the listener
      if (!typeListeners.length && typeListeners.handler) {
        target.detachEvent('on' + type, typeListeners.handler);
      }
    });

    /**
     * dispatchEvent
     * @param  {EventObject} eventObject
     */
    addToEventTargetProto('dispatchEvent', function(eventObject) {
      var target = this,
          type = eventObject.type,
          // map of event type => array of callbacks
          listeners = target.__listeners__ = target.__listeners__ || {},
          // array of callbacks for this event type
          typeListeners = listeners[type] = listeners[type] || [];

      try {
        return target.fireEvent('on' + type, eventObject);
      } catch (error) {
        if (typeListeners.handler) {
          typeListeners.handler(eventObject);
        }
      }
    });
  }
}(window, document));