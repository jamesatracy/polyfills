/**
 * DOM CustomEvent Polyfill for IE browsers
 * ----------------------------------------------------------------------------
 * Polyfill for the CustomEvent constructor for IE. This patches both IE8 and
 * new versions of IE that support Event.initCustomEvent but not the
 * window.CustomEvent constructor function.
 *
 * Native browser support:
 *   Chrome     1.0+
 *   Firefox    6+
 *   IE         9+ (Event.initCustomEvent only!!!)
 *   Opera      ?
 *   Safari     Yes
 *
 * Adapted from:
 * https://github.com/ondras/ie8eventtarget/blob/master/customevent.js
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 *
 * @author James Tracy <jtracy@azaleahealth.com>
 */
(function() {
  if (!window.CustomEvent && document.createEventObject) {
    window.CustomEvent = function(type, props) {
      props = props || {};
      var def = {
        type: type,
        bubbles: props.bubbles || false,
        cancelable: props.cancelable || false,
        detail: props.detail || null
      }
      var event = document.createEventObject();
      for (var p in def) {
        event[p] = def[p];
      }
      return event;
    }
  } else {
    try {
      new CustomEvent('test');
    } catch (e) {
      // constructor version not supported or no window.CustomEvent
      var CustomEventPolyfill = function(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
       };

      CustomEventPolyfill.prototype = window.Event.prototype;
      window.CustomEvent = CustomEventPolyfill;
    }
  }
}());