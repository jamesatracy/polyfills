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