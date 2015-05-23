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