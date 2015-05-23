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