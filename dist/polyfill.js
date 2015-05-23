/**
 * DOM Element.matches Polyfill
 * ----------------------------------------------------------------------------
 * Polyfill for the Element.matches method.
 *
 * The Element.matches() method returns true if the element would be selected
 * by the specified selector string; otherwise, returns false.
 *
 * Native browser support (non-prefixed):
 *   Chrome     34+
 *   Firefox    34+
 *   IE         ?
 *   Opera      ?
 *   Safari     7.1+
 *
 * Adapted from:
 * https://github.com/WebReflection/dom4
 *
 * Depends on:
 * Element.querySelectorAll
 *
 * @author James Tracy <jtracy@azaleahealth.com>
 */

 (function () {
    var ElementPrototype = Element.prototype,
        indexOf = [].indexOf || function (item, start) {
          for (var i = (start || 0), len = this.length; i < len; i++) {
            if (this[i] === item) {
              return i;
            }
          }
          return -1;
        };

    // http://www.w3.org/TR/dom/#dom-element-matches
    if (!('matches' in ElementPrototype)) {
        ElementPrototype.matches =
            ElementPrototype.matchesSelector ||
            ElementPrototype.webkitMatchesSelector ||
            ElementPrototype.khtmlMatchesSelector ||
            ElementPrototype.mozMatchesSelector ||
            ElementPrototype.msMatchesSelector ||
            ElementPrototype.oMatchesSelector ||
            function (selector) {
              var parentNode = this.parentNode;
              return !!parentNode && -1 < indexOf.call(
                parentNode.querySelectorAll(selector),
                this
              );
            };

        // most likely an IE9 only issue
        // see https://github.com/WebReflection/dom4/issues/6
        if (!document.createElement('a').matches('a')) {
            ElementPrototype.matches = (function (matches) {
              return function (selector) {
                return matches.call(
                  this.parentNode ?
                    this :
                    document.createDocumentFragment().appendChild(this),
                  selector
                );
              };
            }(ElementPrototype.matches));
        }
    }
}());
/**
 * DOM Element.closest Polyfill
 * ----------------------------------------------------------------------------
 * Polyfill for the Element.closest method.
 *
 * The Element.closest() method returns the closest ancestor of the current
 * element (or the current element itself) which matches the selectors given in
 * parameter. If there isn't such an ancestor, it returns null.
 *
 * Native browser support:
 *   Chrome     41+
 *   Firefox    35+
 *   IE         Not Supported
 *   Opera      28+
 *   Safari     ?
 *
 * Adapted from:
 * https://github.com/WebReflection/dom4
 *
 * Depends on:
 * Element.matches natively or the polyfill
 *
 * @author James Tracy <jtracy@azaleahealth.com>
 */

 (function () {
    var ElementPrototype = Element.prototype;

    // https://dom.spec.whatwg.org/#dom-element-closest
    if (!('closest' in ElementPrototype)) {
        ElementPrototype.closest = function (selector) {
            var parentNode = this, matches;
            // while document has no .matches
            while ((matches = parentNode && parentNode.matches) && !parentNode.matches(selector)) {
                parentNode = parentNode.parentNode;
            }
            return matches ? parentNode : null;
        };
    }
}());
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