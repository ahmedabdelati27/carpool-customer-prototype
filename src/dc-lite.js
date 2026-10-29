/*
 * dc-lite: a small runtime that renders the prototype outside Claude's design canvas.
 *
 * The screens are written as a canvas template:
 *   {{path}}                      value holes in text and attributes
 *   <sc-if value="{{flag}}">      conditional block
 *   <sc-for list="{{items}}" as="x">  repeated block
 *   onClick / onChange / onFocus / onBlur / onSubmit="{{handler}}"
 * and a `class Component extends DCLogic` that returns those values from renderVals().
 *
 * Every state change re-renders the template and morphs it into the live DOM (morphdom),
 * so focus and caret survive while typing. Events are delegated from the host element.
 */
(function () {
  'use strict';

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var SINGLE_HOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;
  var BOOLEAN_ATTRS = { disabled: 1, checked: 1, readonly: 1, required: 1, hidden: 1, selected: 1, multiple: 1, autofocus: 1, novalidate: 1 };
  var EVENT_ATTRS = { onclick: 'click', onchange: 'change', onfocus: 'focus', onblur: 'blur', onsubmit: 'submit', oninput: 'input' };
  var HTML_NS = 'http://www.w3.org/1999/xhtml';

  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }
    setState(update) {
      var patch = typeof update === 'function' ? update(this.state) : update;
      this.state = Object.assign({}, this.state, patch);
      if (this.__schedule) this.__schedule();
    }
  }
  window.DCLogic = DCLogic;

  function lookup(path, scopes) {
    var parts = path.split('.');
    for (var i = scopes.length - 1; i >= 0; i--) {
      var scope = scopes[i];
      if (scope && Object.prototype.hasOwnProperty.call(scope, parts[0])) {
        var value = scope[parts[0]];
        for (var j = 1; j < parts.length; j++) {
          if (value == null) return undefined;
          value = value[parts[j]];
        }
        return value;
      }
    }
    return undefined;
  }

  function raw(text, scopes) {
    var single = SINGLE_HOLE.exec(text.trim());
    if (single) {
      var expr = single[1].trim();
      if (expr === 'true') return true;
      if (expr === 'false') return false;
      return lookup(expr, scopes);
    }
    return interpolate(text, scopes);
  }

  function interpolate(text, scopes) {
    return text.replace(HOLE, function (_, expr) {
      var value = lookup(expr.trim(), scopes);
      return value == null ? '' : String(value);
    });
  }

  function mount(host, template, Component, props) {
    var registry = [];
    var live = null;
    var pending = false;
    var instance = new Component(props || {});

    function register(fn) {
      registry.push(fn);
      return String(registry.length - 1);
    }

    function renderNode(node, scopes, parent) {
      if (node.nodeType === 3) {
        parent.appendChild(document.createTextNode(interpolate(node.nodeValue, scopes)));
        return;
      }
      if (node.nodeType !== 1) return;
      var tag = node.localName;

      if (tag === 'sc-if') {
        if (raw(node.getAttribute('value') || '', scopes)) renderChildren(node, scopes, parent);
        return;
      }
      if (tag === 'sc-for') {
        var list = raw(node.getAttribute('list') || '', scopes);
        var as = node.getAttribute('as') || 'item';
        if (Array.isArray(list)) {
          for (var k = 0; k < list.length; k++) {
            var frame = {};
            frame[as] = list[k];
            renderChildren(node, scopes.concat([frame]), parent);
          }
        }
        return;
      }

      var ns = node.namespaceURI;
      var el = !ns || ns === HTML_NS ? document.createElement(tag) : document.createElementNS(ns, tag);
      var attrs = node.attributes;
      for (var a = 0; a < attrs.length; a++) {
        var name = attrs[a].name;
        var lower = name.toLowerCase();
        if (lower.indexOf('hint-') === 0) continue;
        var value = raw(attrs[a].value, scopes);
        if (EVENT_ATTRS[lower]) {
          if (typeof value === 'function') el.setAttribute('data-dc-' + EVENT_ATTRS[lower], register(value));
          continue;
        }
        if (BOOLEAN_ATTRS[lower]) {
          if (value && value !== 'false') el.setAttribute(name, '');
          continue;
        }
        if (value === undefined || value === null || typeof value === 'function') continue;
        if (lower === 'value' && tag === 'textarea') { el.textContent = String(value); continue; }
        el.setAttribute(name, String(value));
      }
      renderChildren(node, scopes, el);
      parent.appendChild(el);
    }

    function renderChildren(node, scopes, parent) {
      var kids = node.childNodes;
      for (var i = 0; i < kids.length; i++) renderNode(kids[i], scopes, parent);
    }

    function render() {
      pending = false;
      registry = [];
      var holder = document.createElement('div');
      renderChildren(template, [instance.renderVals()], holder);
      var next = holder.firstElementChild;
      if (!live) {
        host.appendChild(next);
        live = next;
      } else {
        window.morphdom(live, next, {
          onBeforeElUpdated: function (from, to) {
            // keep the caret where it is while the user types the same value we would render
            if (from === document.activeElement && (from.tagName === 'INPUT' || from.tagName === 'TEXTAREA') && from.value === to.value) {
              to.value = from.value;
            }
            return true;
          }
        });
      }
    }

    instance.__schedule = function () {
      if (pending) return;
      pending = true;
      (window.requestAnimationFrame || setTimeout)(render);
    };

    function handlerFor(target, kind) {
      var el = target;
      while (el && el !== host) {
        if (el.getAttribute && el.hasAttribute('data-dc-' + kind)) return registry[+el.getAttribute('data-dc-' + kind)];
        el = el.parentNode;
      }
      return null;
    }
    function isToggle(el) {
      return el && el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio');
    }

    host.addEventListener('click', function (e) {
      var fn = handlerFor(e.target, 'click');
      if (fn) fn(e);
    });
    // React-style onChange: text fields fire on every keystroke, toggles fire on change
    host.addEventListener('input', function (e) {
      if (isToggle(e.target)) return;
      var fn = e.target.hasAttribute && e.target.hasAttribute('data-dc-change') ? registry[+e.target.getAttribute('data-dc-change')] : null;
      if (fn) fn(e);
    });
    host.addEventListener('change', function (e) {
      if (!isToggle(e.target) && e.target.tagName !== 'SELECT') return;
      var fn = e.target.hasAttribute('data-dc-change') ? registry[+e.target.getAttribute('data-dc-change')] : null;
      if (fn) fn(e);
    });
    host.addEventListener('focusin', function (e) {
      var fn = e.target.hasAttribute && e.target.hasAttribute('data-dc-focus') ? registry[+e.target.getAttribute('data-dc-focus')] : null;
      if (fn) fn(e);
    });
    host.addEventListener('focusout', function (e) {
      var fn = e.target.hasAttribute && e.target.hasAttribute('data-dc-blur') ? registry[+e.target.getAttribute('data-dc-blur')] : null;
      if (fn) fn(e);
    });
    host.addEventListener('submit', function (e) {
      e.preventDefault();
      var fn = handlerFor(e.target, 'submit');
      if (fn) fn(e);
    });

    render();
    if (typeof instance.componentDidMount === 'function') instance.componentDidMount();
    return instance;
  }

  window.DCLite = { mount: mount };
})();
