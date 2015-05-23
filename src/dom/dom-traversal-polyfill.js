/**
 * DOM Traversal Polyfill
 * ----------------------------------------------------------------------------
 * Polyfills for the ParentNode and ChildNode (formally ElementTraversal)
 * interfaces for compatibility with IE8.
 *
 * Native browser support:
 *   Chrome     1.0+
 *   Firefox    3.5+
 *   IE         9.0+
 *   Opera      10.0+
 *   Safari     4.0+
 *
 * @author James Tracy <jtracy@azaleahealth.com>
 */
(function (undefined){
  var ElementProto = Element.prototype;
  if (document.createElement('div').firstElementChild === undefined) {
    /** firstElementChild */
    Object.defineProperty(ElementProto, 'firstElementChild', {
      get: function () {
        for(var childNodes = this.childNodes || [], i = 0, len = childNodes.length; i < len; i++) {
          if (childNodes[i].nodeType === 1)  {
            return childNodes[i];
          }
        }
        return null;
      }
    });

    /** lastElementChild */
    Object.defineProperty(ElementProto, 'lastElementChild', {
      get: function () {
        for(var childNodes = this.childNodes || [], i = childNodes.length - 1; i >= 0; i--) {
          if (childNodes[i].nodeType === 1)  {
            return childNodes[i];
          }
        }
        return null;
      }
    });

    /** nextElementSibling */
    Object.defineProperty(ElementProto, 'nextElementSibling', {
      get: function () {
        var nextElementSibling = this.nextSibling;
        while (nextElementSibling && nextElementSibling.nodeType !== 1) {
          nextElementSibling = nextElementSibling.nextSibling;
        }
        return nextElementSibling;
      }
    });

    /** previousElementSibling */
    Object.defineProperty(ElementProto, 'previousElementSibling', {
      get: function () {
        var previousElementSibling = this.previousSibling;
        while (previousElementSibling && previousElementSibling.nodeType != 1) {
          previousElementSibling = previousElementSibling.previousSibling;
        }
        return previousElementSibling;
      }
    });

    /** childElementCount */
    Object.defineProperty(ElementProto, 'childElementCount', {
      get: function () {
        for (var i = 0, count = 0, childNodes = this.childNodes, len = childNodes.length; i < len; i++) {
          count += childNodes[i].nodeType === 1;
        }
        return count;
      }
    });
  }
}());