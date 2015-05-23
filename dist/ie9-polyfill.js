/**
* @preserve HTML5 Shiv 3.7.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.2';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

}(this, document));

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
 * DOM DOMTokenList / classList Polyfill
 * ----------------------------------------------------------------------------
 * Polyfill for the classList DOMTokenList interface.
 *
 * Native browser support:
 *   Chrome     8.0+
 *   Firefox    3.6+
 *   IE         10.0+
 *   Opera      11.50+
 *   Safari     5.1+
 *
 * Adapted from:
 * https://github.com/nuxodin/polyfills/blob/master/classList.js
 *
 * @author James Tracy <jtracy@azaleahealth.com>
 */
(function () {
  if(!('classList' in document.documentElement)) {
    var slice = [].slice,
        push = [].push,
        splice = [].splice,
        join = [].join,
        indexOf = [].indexOf || function (item, start) {
          for (var i = (start || 0), len = this.length; i < len; i++) {
            if (this[i] === item) {
              return i;
            }
          }
          return -1;
        };

    function validateClassName(name) {
      function throwException(type, msg) {
        throw new Error(type + ': ' + msg);
      }
      // trim whitespace
      name = ('' + name).replace(/(?:^\s+|\s+$)/g, '');
      // className can't be an empty string
      if (name === '') {
        throwException('SYNTAX_ERR', 'An invalid or illegal string was specified');
      }
      // className can't contain whitespace
      if (/\s/.test(name)) {
        throwException('INVALID_CHARACTER_ERR', 'String contains an invalid character');
      }
      return name;
    }

    function updateClassName(el, classes) {
      el.className = classes.join(' ');
    }

    /**
     * DOMTokenList constructor
     * @param {Element} el The Element node
     */
    function DOMTokenList (el) {
      this.el = el;
      if (el.className != this.classCache) {
        this.classCache = el.className;
        if (!this.classCache) {
          return;
        }

        // className needs to be trimmed and split on whitespace
        var classes = this.classCache.replace(/^\s+|\s+$/g,'').split(/\s+/);
        for (var i = 0, len = classes.length; i < len; i++) {
          push.call(this, classes[i]);
        }
      }
    }

    DOMTokenList.prototype = {
      /**
       * adds token to the underlying string
       * @param  {String} token
       */
      add: function (token) {
        if (this.contains(token)) {
          return;
        }
        token = validateClassName(token);
        push.call(this, token);
        updateClassName(this.el, slice.call(this, 0));
      },

      /**
       * return true if the underlying string contains token, otherwise false
       * @param  {String} token
       * @return {Boolean}
       */
      contains: function (token) {
        return indexOf.call(this, token) !== -1;
      },

      /**
       * returns an item in the list by its index
       * @param  {Integer} index
       * @return {String}
       */
      item: function (index) {
        return this[index] || null;
      },

      /**
       * remove token from the underlying string
       * @param  {String} token
       */
      remove: function (token) {
        var i = indexOf.call(this, token);
        if (i === -1) {
          return;
        }
        splice.call(this, i , 1);
        updateClassName(this.el, slice.call(this, 0));
      },

      /**
       * removes token from string and returns false. If token doesn't exist
       * it's added and the function returns true
       * @param  {String} token
       */
      toggle: function (token) {
        if (indexOf.call(this, token) === -1) {
          this.add(token);
        } else {
          this.remove(token);
        }
      },

      /**
       * returns the string representation of the token list
       * @return {String}
       */
      toString: function () {
        return join.call(this, ' ');
      }
    };

    Object.defineProperty(Element.prototype, 'classList', {
      get: function () {
        return new DOMTokenList(this);
      }
    });
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