
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var ui = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z$4 = "button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86{border:none;font-weight:600;color:var(--wds-genuine-white);position:relative;padding:0;margin-bottom:8px}button.svelte-vb8w86>div.svelte-vb8w86.svelte-vb8w86{overflow:hidden;transition:transform 100ms cubic-bezier(0.4, 0.6, 0.8, 2), background-color 500ms cubic-bezier(1, 2.25, 0.1, -0.5);box-shadow:inset 0px 0px 0px 2px rgba(0, 0, 0, 0.1), inset 0px 4px 4px rgba(255, 255, 255, 0.25), inset 0px -4px 4px rgba(0, 0, 0, 0.15);border-radius:12px;padding:16px 32px;opacity:0.9;position:relative;z-index:1}button.svelte-vb8w86>div.svelte-vb8w86>span.svelte-vb8w86{opacity:0.95}button.svelte-vb8w86>div.svelte-vb8w86.svelte-vb8w86::after{content:\"\";position:absolute;inset:0;transition:opacity 50ms linear;background:radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.5) 31.77%, rgba(255, 255, 255, 0) 100%);opacity:0.5}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86::after{content:\"\";position:absolute;left:0;right:0;bottom:0;top:0;transform:translateY(8px);border-radius:12px;background:linear-gradient(90deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0.25) 100%)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86::before{content:\"\";position:absolute;left:0;right:0;bottom:0;top:0;transition:background-color 500ms cubic-bezier(1, 2.25, 0.1, -0.5);transform:translateY(8px);border-radius:12px;box-shadow:0 0 0 2px rgba(255, 255, 255, 0.25)}button.svelte-vb8w86:active:enabled>div.svelte-vb8w86.svelte-vb8w86{transform:translateY(6px)}button.svelte-vb8w86:active:enabled>div.svelte-vb8w86.svelte-vb8w86::after{opacity:0.9}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.blue > div{background:var(--wds-blue-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.blue::before{background:var(--wds-blue-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.neon > div{background:var(--wds-neon-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.neon::before{background:var(--wds-neon-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.green > div{background:var(--wds-green-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.green::before{background:var(--wds-green-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.yellow > div{background:var(--wds-yellow-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.yellow::before{background:var(--wds-yellow-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.red > div{background:var(--wds-red-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.red::before{background:var(--wds-red-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.orange > div{background:var(--wds-orange-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.orange::before{background:var(--wds-orange-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.pink > div{background:var(--wds-pink-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.pink::before{background:var(--wds-pink-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.purple > div{background:var(--wds-purple-50)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.purple::before{background:var(--wds-purple-70)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.neon > div{color:var(--wds-neon-90)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.green > div{color:var(--wds-green-90)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86.yellow > div{color:var(--wds-yellow-90)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.blue > div{background:var(--wds-blue-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.blue::before{background:var(--wds-blue-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.neon > div{background:var(--wds-neon-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.neon::before{background:var(--wds-neon-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.green > div{background:var(--wds-green-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.green::before{background:var(--wds-green-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.yellow > div{background:var(--wds-yellow-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.yellow::before{background:var(--wds-yellow-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.red > div{background:var(--wds-red-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.red::before{background:var(--wds-red-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.orange > div{background:var(--wds-orange-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.orange::before{background:var(--wds-orange-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.pink > div{background:var(--wds-pink-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.pink::before{background:var(--wds-pink-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.purple > div{background:var(--wds-purple-70);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled.purple::before{background:var(--wds-purple-90);transition:background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)}button.svelte-vb8w86:disabled>div.svelte-vb8w86>span.svelte-vb8w86{opacity:0.6}button.svelte-vb8w86:disabled>div.svelte-vb8w86.svelte-vb8w86::after{background:radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 31.77%, rgba(0, 0, 0, 0.2) 100%)}button.svelte-vb8w86.svelte-vb8w86.svelte-vb8w86:disabled::after{background:linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 10%, rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.5) 100%)}";
    styleInject(css_248z$4);

    /* src/components/arcade-button.svelte generated by Svelte v3.48.0 */

    const file$3 = "src/components/arcade-button.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let button;
    	let div0;
    	let span;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			div0 = element("div");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-vb8w86");
    			add_location(span, file$3, 19, 9, 607);
    			attr_dev(div0, "class", "svelte-vb8w86");
    			add_location(div0, file$3, 19, 4, 602);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*variant*/ ctx[0]) + " svelte-vb8w86"));
    			button.disabled = /*disabled*/ ctx[1];
    			add_location(button, file$3, 18, 2, 528);
    			add_location(div1, file$3, 17, 0, 520);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, div0);
    			append_dev(div0, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button, "submit", prevent_default(/*submit_handler*/ ctx[5]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*variant*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*variant*/ ctx[0]) + " svelte-vb8w86"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    var ButtonColor;

    (function (ButtonColor) {
    	ButtonColor["Blue"] = "blue";
    	ButtonColor["Neon"] = "neon";
    	ButtonColor["Green"] = "green";
    	ButtonColor["Yellow"] = "yellow";
    	ButtonColor["Red"] = "red";
    	ButtonColor["Orange"] = "orange";
    	ButtonColor["Pink"] = "pink";
    	ButtonColor["Purple"] = "purple";
    })(ButtonColor || (ButtonColor = {}));

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arcade_button', slots, ['default']);
    	let { variant = ButtonColor.Blue } = $$props;
    	let { disabled = undefined } = $$props;
    	const writable_props = ['variant', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arcade_button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('variant' in $$props) $$invalidate(0, variant = $$props.variant);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ButtonColor, variant, disabled });

    	$$self.$inject_state = $$props => {
    		if ('variant' in $$props) $$invalidate(0, variant = $$props.variant);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [variant, disabled, $$scope, slots, click_handler, submit_handler];
    }

    class Arcade_button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { variant: 0, disabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arcade_button",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get variant() {
    		throw new Error("<Arcade_button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Arcade_button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Arcade_button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Arcade_button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const idCounter = {};
    function uniqueId(prefix = '') {
        if (!idCounter[prefix]) {
            idCounter[prefix] = 0;
        }
        const id = ++idCounter[prefix];
        if (prefix === '') {
            return `${id}`;
        }
        return `${prefix}${id}`;
    }

    var css_248z$3 = "div.svelte-edxogh{display:flex;flex-direction:column;gap:4px}input.svelte-edxogh{padding:16px;background:var(--wds-dark-grey-50);border:1px solid var(--wds-genuine-black);box-shadow:inset 0px 0px 0px 1px rgba(255, 255, 255, 0.2);border-radius:8px}";
    styleInject(css_248z$3);

    /* src/components/text-field.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/components/text-field.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let label_1;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(label_1, "for", /*inputId*/ ctx[4]);
    			add_location(label_1, file$2, 9, 2, 212);
    			attr_dev(input, "id", /*inputId*/ ctx[4]);
    			attr_dev(input, "type", "input");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			input.disabled = /*disabled*/ ctx[2];
    			attr_dev(input, "class", "svelte-edxogh");
    			add_location(input, file$2, 10, 2, 251);
    			attr_dev(div, "class", "svelte-edxogh");
    			add_location(div, file$2, 8, 0, 204);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label_1);
    			append_dev(label_1, t0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*disabled*/ 4) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text_field', slots, []);
    	let { label } = $$props;
    	let { value = null } = $$props;
    	let { disabled = false } = $$props;
    	let { placeholder = null } = $$props;
    	const inputId = uniqueId('input');
    	const writable_props = ['label', 'value', 'disabled', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text_field> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({
    		uniqueId,
    		label,
    		value,
    		disabled,
    		placeholder,
    		inputId
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, label, disabled, placeholder, inputId, input_input_handler];
    }

    class Text_field extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			label: 1,
    			value: 0,
    			disabled: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text_field",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
    			console.warn("<Text_field> was created without expected prop 'label'");
    		}
    	}

    	get label() {
    		throw new Error("<Text_field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Text_field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Text_field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Text_field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Text_field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Text_field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Text_field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Text_field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Logo = "<svg width=\"331\" height=\"150\" viewBox=\"0 0 331 150\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M30.6092 138H12.6292C11.1599 138 10.0772 137.691 9.38122 137.072C8.76255 136.376 8.45322 135.293 8.45322 133.824V58.656C8.45322 57.1867 8.76255 56.1427 9.38122 55.524C10.0772 54.828 11.1599 54.48 12.6292 54.48H30.6092C32.0786 54.48 33.1226 54.828 33.7412 55.524C34.4372 56.1427 34.7852 57.1867 34.7852 58.656V85.336H39.4252L51.3732 58.308C51.9146 56.916 52.6492 55.9493 53.5772 55.408C54.5052 54.7893 55.7039 54.48 57.1732 54.48H75.0372C76.3519 54.48 77.2412 54.828 77.7052 55.524C78.1692 56.1427 78.1306 57.0707 77.5892 58.308L65.7572 85.336C70.0879 85.568 73.5292 87.1147 76.0812 89.976C78.7106 92.76 80.0252 96.472 80.0252 101.112V133.824C80.0252 135.293 79.6772 136.376 78.9812 137.072C78.3626 137.691 77.3186 138 75.8492 138H57.9852C56.5159 138 55.4332 137.691 54.7372 137.072C54.1186 136.376 53.8092 135.293 53.8092 133.824V111.204C53.8092 109.967 53.4999 109 52.8812 108.304C52.2626 107.608 51.3346 107.26 50.0972 107.26H34.7852V133.824C34.7852 135.293 34.4372 136.376 33.7412 137.072C33.1226 137.691 32.0786 138 30.6092 138ZM125.276 78.84L119.824 96.472H138.036L132.584 78.84C132.275 78.144 131.927 77.6413 131.54 77.332C131.231 77.0227 130.844 76.868 130.38 76.868H127.48C127.016 76.868 126.591 77.0227 126.204 77.332C125.895 77.6413 125.585 78.144 125.276 78.84ZM118.664 133.824C118.664 135.293 118.316 136.376 117.62 137.072C117.001 137.691 115.957 138 114.488 138H97.4361C95.9668 138 94.8841 137.691 94.1881 137.072C93.5694 136.376 93.2601 135.293 93.2601 133.824V103.2C93.2601 100.88 93.6081 98.212 94.3041 95.196C95.0774 92.18 96.2374 88.6613 97.7841 84.64L107.876 58.308C108.34 56.9933 109.036 56.0267 109.964 55.408C110.969 54.7893 112.245 54.48 113.792 54.48H144.996C146.465 54.48 147.664 54.7893 148.592 55.408C149.597 56.0267 150.332 56.9933 150.796 58.308L160.888 84.64C162.435 88.6613 163.556 92.18 164.252 95.196C165.025 98.212 165.412 100.88 165.412 103.2V133.824C165.412 135.293 165.064 136.376 164.368 137.072C163.749 137.691 162.705 138 161.236 138H143.72C142.173 138 141.013 137.691 140.24 137.072C139.544 136.376 139.196 135.293 139.196 133.824V117.584H118.664V133.824ZM205.95 75.36V90.208H214.65C216.661 90.208 218.014 89.7053 218.71 88.7C219.406 87.6173 219.754 86.3027 219.754 84.756V80.812C219.754 79.2653 219.406 77.9893 218.71 76.984C218.014 75.9013 216.661 75.36 214.65 75.36H205.95ZM201.774 138H183.91C182.441 138 181.358 137.691 180.662 137.072C180.044 136.376 179.734 135.293 179.734 133.824V58.656C179.734 57.1867 180.044 56.1427 180.662 55.524C181.358 54.828 182.441 54.48 183.91 54.48H222.538C231.2 54.48 237.154 56.2973 240.402 59.932C243.728 63.4893 245.39 68.1293 245.39 73.852V79.188C245.39 82.436 244.888 85.22 243.882 87.54C242.954 89.7827 241.292 91.4067 238.894 92.412C243.07 92.876 246.434 94.5773 248.986 97.516C251.616 100.455 252.93 104.36 252.93 109.232V133.824C252.93 135.293 252.582 136.376 251.886 137.072C251.268 137.691 250.224 138 248.754 138H230.774C229.305 138 228.222 137.691 227.526 137.072C226.908 136.376 226.598 135.293 226.598 133.824V116.076C226.598 114.375 226.25 113.137 225.554 112.364C224.936 111.513 223.814 111.088 222.19 111.088H205.95V133.824C205.95 135.293 205.602 136.376 204.906 137.072C204.288 137.691 203.244 138 201.774 138ZM301.87 138H283.078C281.608 138 280.526 137.691 279.83 137.072C279.211 136.376 278.902 135.293 278.902 133.824V76.868H261.85C260.38 76.868 259.298 76.5587 258.602 75.94C257.983 75.244 257.674 74.1613 257.674 72.692V58.656C257.674 57.1867 257.983 56.1427 258.602 55.524C259.298 54.828 260.38 54.48 261.85 54.48H323.098C324.567 54.48 325.611 54.828 326.23 55.524C326.926 56.1427 327.274 57.1867 327.274 58.656V72.692C327.274 74.1613 326.926 75.244 326.23 75.94C325.611 76.5587 324.567 76.868 323.098 76.868H306.046V133.824C306.046 135.293 305.698 136.376 305.002 137.072C304.383 137.691 303.339 138 301.87 138Z\" fill=\"url(#paint0_linear_14_6)\"/>\n<path d=\"M19.44 33.282C18.576 33.21 17.748 33.048 16.956 32.796C16.2 32.544 15.534 32.238 14.958 31.878C14.382 31.518 13.914 31.158 13.554 30.798C13.23 30.402 13.068 30.042 13.068 29.718C13.068 29.394 13.176 29.124 13.392 28.908C13.644 28.692 13.968 28.584 14.364 28.584C14.976 28.584 15.516 28.638 15.984 28.746C16.488 28.818 16.974 28.908 17.442 29.016C17.91 29.088 18.396 29.178 18.9 29.286C19.44 29.358 20.052 29.394 20.736 29.394C21.852 29.394 22.86 29.196 23.76 28.8C24.696 28.368 25.506 27.81 26.19 27.126C26.874 26.406 27.396 25.578 27.756 24.642C28.152 23.706 28.35 22.716 28.35 21.672C28.35 21.096 28.206 20.286 27.918 19.242C27.666 18.198 27.162 17.19 26.406 16.218C25.686 15.21 24.678 14.346 23.382 13.626C22.122 12.87 20.466 12.492 18.414 12.492C17.586 12.492 16.83 12.546 16.146 12.654C15.462 12.762 14.814 12.888 14.202 13.032C13.626 13.14 13.05 13.248 12.474 13.356C11.898 13.464 11.286 13.518 10.638 13.518C10.062 13.518 9.52204 13.374 9.01804 13.086C8.51404 12.762 8.08204 12.366 7.72204 11.898C7.36204 11.394 7.07404 10.818 6.85804 10.17C6.64204 9.522 6.53404 8.856 6.53404 8.172C6.53404 7.56 6.76804 7.092 7.23604 6.768C7.66804 6.408 8.22604 6.156 8.91004 6.012C9.63004 5.832 10.404 5.724 11.232 5.688C12.06 5.652 12.87 5.634 13.662 5.634C16.398 5.634 19.134 5.868 21.87 6.336C24.642 6.768 27.126 7.56 29.322 8.712C31.518 9.828 33.3 11.34 34.668 13.248C36.036 15.12 36.72 17.496 36.72 20.376C36.72 22.176 36.306 23.868 35.478 25.452C34.65 27.036 33.552 28.422 32.184 29.61C30.816 30.798 29.232 31.734 27.432 32.418C25.632 33.102 23.742 33.444 21.762 33.444C20.97 33.444 20.196 33.39 19.44 33.282ZM12.312 12.006C12.744 11.466 13.482 11.196 14.526 11.196C14.778 11.196 15.12 11.25 15.552 11.358C16.02 11.43 16.47 11.592 16.902 11.844C17.334 12.096 17.712 12.456 18.036 12.924C18.36 13.392 18.522 13.986 18.522 14.706C18.522 15.102 18.486 15.534 18.414 16.002C18.342 16.434 18.252 16.866 18.144 17.298C17.604 19.35 17.226 21.51 17.01 23.778C16.83 26.01 16.74 28.296 16.74 30.636C16.74 33.12 16.794 35.568 16.902 37.98C17.046 40.356 17.172 42.624 17.28 44.784C17.28 45.612 17.19 46.224 17.01 46.62C16.866 47.052 16.542 47.268 16.038 47.268C14.202 47.268 12.762 46.746 11.718 45.702C10.674 44.694 10.008 43.092 9.72004 40.896C9.07204 38.304 8.56804 35.712 8.20804 33.12C7.88404 30.528 7.72204 28.044 7.72204 25.668C7.72204 24.012 7.81204 22.446 7.99204 20.97C8.17204 19.458 8.44204 18.108 8.80204 16.92C9.19804 15.732 9.68404 14.724 10.26 13.896C10.836 13.032 11.52 12.402 12.312 12.006ZM65.6105 35.766C65.8265 36.558 65.6645 37.512 65.1245 38.628C64.6205 39.708 63.9005 40.77 62.9645 41.814C62.0645 42.822 61.0205 43.686 59.8325 44.406C58.6805 45.126 57.5825 45.486 56.5385 45.486C55.1345 45.486 53.9465 45.216 52.9745 44.676C52.0025 44.136 51.2465 43.128 50.7065 41.652C50.0585 43.02 49.1765 44.028 48.0605 44.676C46.9805 45.324 45.9185 45.684 44.8745 45.756C43.1105 45.756 41.5085 45.288 40.0685 44.352C38.6645 43.38 37.6205 41.868 36.9365 39.816C36.5045 38.556 36.3245 37.278 36.3965 35.982C36.4685 34.65 36.7205 33.354 37.1525 32.094C37.5845 30.834 38.1785 29.646 38.9345 28.53C39.6905 27.414 40.5365 26.442 41.4725 25.614C42.4085 24.75 43.3985 24.084 44.4425 23.616C45.5225 23.112 46.6025 22.86 47.6825 22.86C48.0785 22.86 48.4565 22.914 48.8165 23.022C49.2125 23.094 49.5545 23.184 49.8425 23.292L50.0585 21.834C50.0945 21.618 50.2565 21.438 50.5445 21.294C50.8325 21.15 51.1205 21.078 51.4085 21.078C51.8765 21.078 52.3985 21.15 52.9745 21.294C53.5865 21.438 54.1625 21.636 54.7025 21.888C55.2785 22.14 55.8005 22.446 56.2685 22.806C56.7365 23.166 57.0785 23.562 57.2945 23.994C57.3665 24.462 57.3665 25.65 57.2945 27.558C57.2225 29.466 57.0425 32.328 56.7545 36.144C56.6825 36.684 56.6465 37.224 56.6465 37.764C56.6465 38.304 56.6465 38.862 56.6465 39.438C56.7905 40.05 57.2405 40.356 57.9965 40.356C58.7885 40.356 59.5445 39.978 60.2645 39.222C60.9845 38.466 61.7225 37.512 62.4785 36.36L63.4505 34.74C63.7025 34.452 63.9905 34.308 64.3145 34.308C64.6025 34.308 64.8725 34.488 65.1245 34.848C65.3765 35.172 65.5385 35.478 65.6105 35.766ZM46.6565 39.87C47.4125 39.834 47.9885 39.69 48.3845 39.438C48.7805 39.15 49.0685 38.79 49.2485 38.358C49.4285 37.89 49.5545 37.368 49.6265 36.792C49.6985 36.18 49.7705 35.55 49.8425 34.902C49.8785 33.498 49.9325 32.13 50.0045 30.798C50.0765 29.43 50.1305 28.062 50.1665 26.694C49.9145 26.442 49.4825 26.352 48.8705 26.424C47.9345 26.64 47.1245 27.198 46.4405 28.098C45.7565 28.998 45.2165 30.042 44.8205 31.23C44.4245 32.418 44.1725 33.624 44.0645 34.848C43.9925 36.072 44.1005 37.116 44.3885 37.98C44.6045 38.7 44.8925 39.204 45.2525 39.492C45.6485 39.744 46.1165 39.87 46.6565 39.87ZM88.5368 36.09C88.6808 36.99 88.4648 37.98 87.8888 39.06C87.3128 40.14 86.5388 41.166 85.5668 42.138C84.6308 43.074 83.5508 43.866 82.3268 44.514C81.1388 45.126 79.9868 45.432 78.8708 45.432C77.2508 45.432 75.9188 45.108 74.8748 44.46C73.8308 43.812 73.0208 42.858 72.4448 41.598C72.1208 40.698 72.0488 39.708 72.2288 38.628C72.4448 37.548 72.6968 36.486 72.9848 35.442C73.3088 34.362 73.5608 33.336 73.7408 32.364C73.9568 31.356 73.9028 30.492 73.5788 29.772C73.4348 29.304 73.1468 28.998 72.7148 28.854C72.2828 28.674 71.7968 28.566 71.2568 28.53C70.7168 28.458 70.1588 28.422 69.5828 28.422C69.0428 28.422 68.6108 28.368 68.2868 28.26C68.1788 29.412 67.9628 30.636 67.6388 31.932C67.3508 33.228 66.9728 34.452 66.5048 35.604C66.0728 36.72 65.5868 37.692 65.0468 38.52C64.5068 39.312 63.9668 39.816 63.4268 40.032C63.1748 40.176 62.9048 40.212 62.6168 40.14C62.1488 40.14 61.7528 39.672 61.4288 38.736C61.3928 38.628 61.4288 38.466 61.5368 38.25C61.6088 38.034 61.6988 37.836 61.8068 37.656C62.2388 36.792 62.6348 35.946 62.9948 35.118C63.3188 34.254 63.6068 33.39 63.8588 32.526C64.1108 31.626 64.2728 30.69 64.3448 29.718C64.4168 28.746 64.3988 27.702 64.2908 26.586C63.9308 26.334 63.5168 25.956 63.0488 25.452C62.5808 24.912 62.2568 24.408 62.0768 23.94C61.7888 22.86 61.6628 21.888 61.6988 21.024C61.7348 20.16 61.8788 19.422 62.1308 18.81C62.3468 18.198 62.6708 17.73 63.1028 17.406C63.5348 17.046 64.0028 16.848 64.5068 16.812C64.9028 16.812 65.3888 16.866 65.9648 16.974C66.5768 17.082 67.1888 17.226 67.8008 17.406C68.4848 17.586 69.1148 17.856 69.6908 18.216C70.3028 18.54 70.6988 18.9 70.8788 19.296C70.9508 19.548 70.8968 19.836 70.7168 20.16C70.5728 20.484 70.3748 20.844 70.1228 21.24C69.9068 21.6 69.6908 21.996 69.4748 22.428C69.2588 22.86 69.1328 23.31 69.0968 23.778C69.6008 24.174 70.3028 24.462 71.2028 24.642C72.1388 24.786 72.9308 24.858 73.5788 24.858C74.1548 24.858 74.6948 24.75 75.1988 24.534C75.7028 24.282 76.1168 24.156 76.4408 24.156C76.8008 24.156 77.1968 24.246 77.6288 24.426C78.0968 24.57 78.5288 24.786 78.9248 25.074C79.3568 25.326 79.7168 25.614 80.0048 25.938C80.2928 26.262 80.4908 26.568 80.5988 26.856C80.9228 27.792 81.0128 28.872 80.8688 30.096C80.7248 31.32 80.5268 32.544 80.2748 33.768C80.0228 34.956 79.7888 36.09 79.5728 37.17C79.3928 38.214 79.4108 39.024 79.6268 39.6C79.6988 40.176 80.0948 40.464 80.8148 40.464C81.4268 40.464 82.1828 40.122 83.0828 39.438C83.9828 38.718 85.0628 37.35 86.3228 35.334C86.3948 35.262 86.4848 35.154 86.5928 35.01C86.7008 34.866 86.7908 34.794 86.8628 34.794C87.1868 34.83 87.5108 34.956 87.8348 35.172C88.1588 35.388 88.3928 35.694 88.5368 36.09ZM116.222 36.252C116.366 36.648 116.384 37.062 116.276 37.494C116.204 37.926 116.078 38.394 115.898 38.898C115.538 39.726 115.034 40.536 114.386 41.328C113.738 42.12 113 42.84 112.172 43.488C111.38 44.1 110.534 44.604 109.634 45C108.734 45.396 107.87 45.594 107.042 45.594C105.422 45.594 104.216 45.252 103.424 44.568C102.632 43.848 102.002 42.678 101.534 41.058C101.102 41.706 100.58 42.318 99.968 42.894C99.356 43.434 98.672 43.92 97.916 44.352C97.196 44.748 96.422 45.054 95.594 45.27C94.802 45.522 94.01 45.648 93.218 45.648C92.102 45.648 90.968 45.27 89.816 44.514C88.7 43.758 87.836 42.75 87.224 41.49C87.116 41.13 87.008 40.788 86.9 40.464C86.756 40.104 86.648 39.726 86.576 39.33C86.504 38.646 86.432 37.8 86.36 36.792C86.288 35.748 86.234 34.632 86.198 33.444C86.126 32.22 86.09 30.924 86.09 29.556C86.09 28.188 86.126 26.802 86.198 25.398C85.37 25.182 84.65 24.894 84.038 24.534C83.426 24.138 83.03 23.634 82.85 23.022C82.67 22.482 82.634 22.05 82.742 21.726C82.85 21.366 83.084 21.114 83.444 20.97C83.768 20.79 84.218 20.682 84.794 20.646C85.334 20.574 85.964 20.538 86.684 20.538C86.828 19.35 87.044 18.216 87.332 17.136C87.584 16.056 87.89 15.102 88.25 14.274C88.61 13.446 89.042 12.78 89.546 12.276C90.05 11.736 90.626 11.394 91.274 11.25C92.03 11.25 92.768 11.376 93.488 11.628C94.352 11.916 95.198 12.366 96.026 12.978C96.854 13.554 97.376 14.202 97.592 14.922C97.7 15.21 97.754 15.48 97.754 15.732C97.754 15.984 97.61 16.254 97.322 16.542C97.034 17.082 96.746 17.658 96.458 18.27C96.206 18.882 95.936 19.602 95.648 20.43H98.294C98.69 20.43 99.086 20.628 99.482 21.024C99.914 21.384 100.22 21.708 100.4 21.996C100.652 22.716 100.688 23.328 100.508 23.832C100.328 24.3 100.022 24.678 99.59 24.966C99.194 25.254 98.726 25.47 98.186 25.614C97.646 25.758 97.124 25.848 96.62 25.884C96.26 25.92 95.864 25.938 95.432 25.938C95.036 25.938 94.658 25.956 94.298 25.992C94.082 27.144 93.902 28.296 93.758 29.448C93.65 30.6 93.542 31.716 93.434 32.796C93.362 33.876 93.326 34.902 93.326 35.874C93.326 36.81 93.362 37.62 93.434 38.304C93.398 38.52 93.398 38.718 93.434 38.898C93.47 39.042 93.524 39.186 93.596 39.33C93.74 39.798 94.01 40.14 94.406 40.356C94.802 40.536 95.27 40.626 95.81 40.626C96.422 40.626 97.07 40.374 97.754 39.87C98.474 39.366 99.194 38.538 99.914 37.386C100.166 36.918 100.4 36.432 100.616 35.928C100.58 35.316 100.544 34.578 100.508 33.714C100.472 32.814 100.454 31.896 100.454 30.96C100.49 29.988 100.562 29.016 100.67 28.044C100.778 27.072 100.976 26.208 101.264 25.452C101.588 24.696 102.002 24.084 102.506 23.616C103.01 23.148 103.658 22.914 104.45 22.914C105.71 22.914 106.646 23.094 107.258 23.454C107.87 23.778 108.32 24.138 108.608 24.534C108.716 24.822 108.806 25.074 108.878 25.29C108.95 25.47 108.95 25.668 108.878 25.884H108.932C108.896 25.884 108.878 25.902 108.878 25.938C108.986 26.19 109.058 26.424 109.094 26.64C109.13 26.82 109.166 27 109.202 27.18C109.166 27.792 109.094 28.404 108.986 29.016C108.878 29.628 108.752 30.312 108.608 31.068C108.5 31.824 108.374 32.67 108.23 33.606C108.122 34.542 108.05 35.622 108.014 36.846C108.014 37.242 107.996 37.656 107.96 38.088C107.96 38.52 107.978 38.952 108.014 39.384C108.122 39.888 108.554 40.14 109.31 40.14C110.066 40.14 110.84 39.672 111.632 38.736C112.46 37.8 113.288 36.702 114.116 35.442C114.296 35.262 114.494 35.1 114.71 34.956C114.962 35.028 115.25 35.19 115.574 35.442C115.898 35.658 116.114 35.928 116.222 36.252ZM102.83 16.434C102.506 15.462 102.344 14.58 102.344 13.788C102.38 12.96 102.524 12.258 102.776 11.682C103.028 11.106 103.37 10.656 103.802 10.332C104.234 10.008 104.702 9.846 105.206 9.846C105.674 9.846 106.232 9.918 106.88 10.062C107.564 10.206 108.212 10.404 108.824 10.656C109.436 10.908 109.976 11.214 110.444 11.574C110.948 11.934 111.272 12.33 111.416 12.762C111.596 13.086 111.578 13.374 111.362 13.626L110.93 14.166C110.642 14.49 110.408 14.904 110.228 15.408C110.048 15.876 109.886 16.362 109.742 16.866L109.418 17.622C109.238 18.126 109.04 18.558 108.824 18.918C108.608 19.242 108.338 19.422 108.014 19.458H108.068C107.996 19.458 107.888 19.476 107.744 19.512C107.636 19.512 107.546 19.512 107.474 19.512C107.042 19.512 106.592 19.476 106.124 19.404C105.692 19.332 105.26 19.188 104.828 18.972C104.432 18.756 104.054 18.45 103.694 18.054C103.37 17.622 103.082 17.082 102.83 16.434ZM142.392 35.766C142.608 36.558 142.446 37.512 141.906 38.628C141.402 39.708 140.682 40.77 139.746 41.814C138.846 42.822 137.802 43.686 136.614 44.406C135.462 45.126 134.364 45.486 133.32 45.486C131.916 45.486 130.728 45.216 129.756 44.676C128.784 44.136 128.028 43.128 127.488 41.652C126.84 43.02 125.958 44.028 124.842 44.676C123.762 45.324 122.7 45.684 121.656 45.756C119.892 45.756 118.29 45.288 116.85 44.352C115.446 43.38 114.402 41.868 113.718 39.816C113.286 38.556 113.106 37.278 113.178 35.982C113.25 34.65 113.502 33.354 113.934 32.094C114.366 30.834 114.96 29.646 115.716 28.53C116.472 27.414 117.318 26.442 118.254 25.614C119.19 24.75 120.18 24.084 121.224 23.616C122.304 23.112 123.384 22.86 124.464 22.86C124.86 22.86 125.238 22.914 125.598 23.022C125.994 23.094 126.336 23.184 126.624 23.292L126.84 21.834C126.876 21.618 127.038 21.438 127.326 21.294C127.614 21.15 127.902 21.078 128.19 21.078C128.658 21.078 129.18 21.15 129.756 21.294C130.368 21.438 130.944 21.636 131.484 21.888C132.06 22.14 132.582 22.446 133.05 22.806C133.518 23.166 133.86 23.562 134.076 23.994C134.148 24.462 134.148 25.65 134.076 27.558C134.004 29.466 133.824 32.328 133.536 36.144C133.464 36.684 133.428 37.224 133.428 37.764C133.428 38.304 133.428 38.862 133.428 39.438C133.572 40.05 134.022 40.356 134.778 40.356C135.57 40.356 136.326 39.978 137.046 39.222C137.766 38.466 138.504 37.512 139.26 36.36L140.232 34.74C140.484 34.452 140.772 34.308 141.096 34.308C141.384 34.308 141.654 34.488 141.906 34.848C142.158 35.172 142.32 35.478 142.392 35.766ZM123.438 39.87C124.194 39.834 124.77 39.69 125.166 39.438C125.562 39.15 125.85 38.79 126.03 38.358C126.21 37.89 126.336 37.368 126.408 36.792C126.48 36.18 126.552 35.55 126.624 34.902C126.66 33.498 126.714 32.13 126.786 30.798C126.858 29.43 126.912 28.062 126.948 26.694C126.696 26.442 126.264 26.352 125.652 26.424C124.716 26.64 123.906 27.198 123.222 28.098C122.538 28.998 121.998 30.042 121.602 31.23C121.206 32.418 120.954 33.624 120.846 34.848C120.774 36.072 120.882 37.116 121.17 37.98C121.386 38.7 121.674 39.204 122.034 39.492C122.43 39.744 122.898 39.87 123.438 39.87ZM169.962 36.414C170.178 37.494 170.016 38.574 169.476 39.654C168.936 40.734 168.162 41.724 167.154 42.624C166.182 43.524 165.048 44.262 163.752 44.838C162.492 45.378 161.232 45.648 159.972 45.648C158.748 45.648 157.596 45.342 156.516 44.73C155.436 44.082 154.626 43.2 154.086 42.084C153.114 43.236 151.944 44.172 150.576 44.892C149.208 45.576 147.84 45.918 146.472 45.918C145.932 45.918 145.356 45.828 144.744 45.648C144.132 45.504 143.556 45.27 143.016 44.946C142.476 44.586 141.99 44.136 141.558 43.596C141.126 43.02 140.784 42.336 140.532 41.544C140.244 39.96 139.956 38.034 139.668 35.766C139.38 33.498 139.164 31.122 139.02 28.638C138.876 26.154 138.822 23.652 138.858 21.132C138.894 18.576 139.074 16.218 139.398 14.058C139.722 11.862 140.226 9.954 140.91 8.334C141.594 6.714 142.512 5.58 143.664 4.932C143.952 4.788 144.33 4.716 144.798 4.716C145.374 4.716 145.932 4.788 146.472 4.932C147.444 5.184 148.398 5.634 149.334 6.282C150.306 6.894 150.936 7.578 151.224 8.334C151.332 8.73 151.332 9.126 151.224 9.522C151.116 9.918 150.972 10.314 150.792 10.71C150.396 11.43 150 12.438 149.604 13.734C149.244 14.994 148.884 16.452 148.524 18.108C148.2 19.728 147.894 21.456 147.606 23.292C147.354 25.092 147.138 26.874 146.958 28.638C146.814 30.366 146.724 32.004 146.688 33.552C146.652 35.064 146.706 36.36 146.85 37.44C146.886 37.8 146.922 38.16 146.958 38.52C147.03 38.88 147.138 39.222 147.282 39.546C147.462 39.834 147.696 40.068 147.984 40.248C148.272 40.428 148.65 40.518 149.118 40.518C149.73 40.518 150.306 40.248 150.846 39.708C151.422 39.132 152.07 38.25 152.79 37.062L152.682 35.172C152.61 34.02 152.556 32.652 152.52 31.068C152.484 29.448 152.502 27.756 152.574 25.992C152.646 24.228 152.79 22.446 153.006 20.646C153.258 18.846 153.6 17.172 154.032 15.624C154.464 14.076 155.004 12.726 155.652 11.574C156.336 10.386 157.182 9.522 158.19 8.982C158.73 8.982 159.324 9.072 159.972 9.252C160.656 9.432 161.304 9.702 161.916 10.062C162.564 10.422 163.14 10.854 163.644 11.358C164.148 11.826 164.508 12.384 164.724 13.032C164.868 13.428 164.868 13.914 164.724 14.49C164.58 15.03 164.346 15.48 164.022 15.84C163.338 16.776 162.726 18.18 162.186 20.052C161.682 21.888 161.268 23.868 160.944 25.992C160.656 28.116 160.458 30.222 160.35 32.31C160.278 34.398 160.314 36.144 160.458 37.548C160.494 37.872 160.512 38.178 160.512 38.466C160.548 38.718 160.602 38.934 160.674 39.114C160.854 39.582 161.07 39.942 161.322 40.194C161.61 40.446 162.006 40.572 162.51 40.572C163.194 40.572 163.842 40.356 164.454 39.924C165.066 39.492 165.768 38.754 166.56 37.71C166.704 37.53 166.848 37.296 166.992 37.008C167.172 36.72 167.334 36.432 167.478 36.144C167.658 35.856 167.82 35.604 167.964 35.388C168.108 35.172 168.234 35.064 168.342 35.064C168.63 35.064 168.936 35.208 169.26 35.496C169.62 35.748 169.854 36.054 169.962 36.414ZM181.002 57.798C180.498 57.906 179.994 57.996 179.49 58.068C177.258 58.32 175.53 58.032 174.306 57.204C173.118 56.376 172.398 55.278 172.146 53.91C171.93 52.866 172.002 51.858 172.362 50.886C172.722 49.914 173.298 49.014 174.09 48.186C174.918 47.394 175.944 46.692 177.168 46.08C178.392 45.504 179.76 45.054 181.272 44.73C181.344 43.938 181.362 43.29 181.326 42.786C181.326 42.282 181.362 41.67 181.434 40.95C181.038 41.49 180.57 42.03 180.03 42.57C179.526 43.11 178.95 43.596 178.302 44.028C177.69 44.46 177.006 44.802 176.25 45.054C175.53 45.342 174.774 45.486 173.982 45.486C171.966 45.486 170.436 44.856 169.392 43.596C168.348 42.3 167.664 40.572 167.34 38.412C167.124 37.044 166.998 35.478 166.962 33.714C166.926 31.914 167.052 30.222 167.34 28.638C167.592 27.018 168.042 25.668 168.69 24.588C169.338 23.472 170.256 22.914 171.444 22.914C172.452 22.914 173.244 23.022 173.82 23.238C174.432 23.454 174.882 23.724 175.17 24.048C175.494 24.336 175.71 24.66 175.818 25.02C175.926 25.38 175.998 25.704 176.034 25.992C176.142 26.676 176.142 27.342 176.034 27.99C175.926 28.602 175.764 29.286 175.548 30.042C175.368 30.762 175.152 31.59 174.9 32.526C174.684 33.426 174.522 34.488 174.414 35.712C174.378 35.928 174.342 36.306 174.306 36.846C174.306 37.35 174.342 37.872 174.414 38.412C174.486 38.916 174.612 39.348 174.792 39.708C175.008 40.068 175.314 40.248 175.71 40.248C176.502 40.248 177.186 39.96 177.762 39.384C178.374 38.772 178.896 37.962 179.328 36.954C179.76 35.946 180.12 34.812 180.408 33.552C180.732 32.256 181.02 30.924 181.272 29.556C181.416 27.792 181.74 26.37 182.244 25.29C182.784 24.21 183.756 23.67 185.16 23.67C186.456 23.67 187.482 23.958 188.238 24.534C189.03 25.074 189.57 25.974 189.858 27.234C189.894 28.206 189.858 29.16 189.75 30.096C189.678 31.032 189.552 32.112 189.372 33.336C189.192 34.56 188.976 36.018 188.724 37.71C188.472 39.402 188.238 41.49 188.022 43.974C189.138 43.866 190.398 43.866 191.802 43.974C193.206 44.082 194.538 44.352 195.798 44.784C197.094 45.216 198.21 45.828 199.146 46.62C200.118 47.412 200.712 48.42 200.928 49.644C201.072 50.328 201.018 50.976 200.766 51.588C200.514 52.236 199.974 52.614 199.146 52.722C198.534 52.794 197.832 52.686 197.04 52.398C196.248 52.146 195.6 51.66 195.096 50.94C193.944 49.464 192.828 48.492 191.748 48.024C190.704 47.592 189.552 47.376 188.292 47.376L187.806 47.43C187.518 50.166 186.888 52.416 185.916 54.18C184.944 55.944 183.306 57.15 181.002 57.798ZM177.222 52.614C177.15 52.722 177.168 52.83 177.276 52.938C177.348 53.298 177.492 53.622 177.708 53.91C177.96 54.234 178.284 54.36 178.68 54.288C179.256 54.216 179.706 54.018 180.03 53.694C180.39 53.37 180.66 52.938 180.84 52.398C181.02 51.894 181.146 51.3 181.218 50.616C181.29 49.932 181.326 49.212 181.326 48.456C180.21 48.816 179.256 49.302 178.464 49.914C177.672 50.562 177.258 51.462 177.222 52.614Z\" fill=\"white\"/>\n<defs>\n<linearGradient id=\"paint0_linear_14_6\" x1=\"165.5\" y1=\"48.5\" x2=\"165.5\" y2=\"141.5\" gradientUnits=\"userSpaceOnUse\">\n<stop stop-color=\"#F5D700\"/>\n<stop offset=\"1\" stop-color=\"#EEBF01\"/>\n</linearGradient>\n</defs>\n</svg>";

    var css_248z$2 = "div.svelte-dzpldm{flex-direction:column;margin:32px;display:flex;gap:16px}";
    styleInject(css_248z$2);

    /* src/views/join.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/views/join.svelte";

    // (20:2) {#if error}
    function create_if_block$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[0]);
    			attr_dev(div, "class", "error svelte-dzpldm");
    			add_location(div, file$1, 20, 4, 594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 1) set_data_dev(t, /*error*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:2) {#if error}",
    		ctx
    	});

    	return block;
    }

    // (25:2) <ArcadeButton {disabled} on:click={join}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Join");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(25:2) <ArcadeButton {disabled} on:click={join}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let html_tag;
    	let t0;
    	let t1;
    	let textfield0;
    	let updating_value;
    	let t2;
    	let textfield1;
    	let updating_value_1;
    	let t3;
    	let arcadebutton;
    	let current;
    	let if_block = /*error*/ ctx[0] && create_if_block$1(ctx);

    	function textfield0_value_binding(value) {
    		/*textfield0_value_binding*/ ctx[5](value);
    	}

    	let textfield0_props = { label: "Room code" };

    	if (/*roomCode*/ ctx[1] !== void 0) {
    		textfield0_props.value = /*roomCode*/ ctx[1];
    	}

    	textfield0 = new Text_field({ props: textfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield0, 'value', textfield0_value_binding));

    	function textfield1_value_binding(value) {
    		/*textfield1_value_binding*/ ctx[6](value);
    	}

    	let textfield1_props = { label: "Your name" };

    	if (/*playerName*/ ctx[2] !== void 0) {
    		textfield1_props.value = /*playerName*/ ctx[2];
    	}

    	textfield1 = new Text_field({ props: textfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield1, 'value', textfield1_value_binding));

    	arcadebutton = new Arcade_button({
    			props: {
    				disabled: /*disabled*/ ctx[3],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	arcadebutton.$on("click", /*join*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			html_tag = new HtmlTag(false);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			create_component(textfield0.$$.fragment);
    			t2 = space();
    			create_component(textfield1.$$.fragment);
    			t3 = space();
    			create_component(arcadebutton.$$.fragment);
    			html_tag.a = t0;
    			attr_dev(div, "class", "svelte-dzpldm");
    			add_location(div, file$1, 17, 0, 555);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(Logo, div);
    			append_dev(div, t0);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t1);
    			mount_component(textfield0, div, null);
    			append_dev(div, t2);
    			mount_component(textfield1, div, null);
    			append_dev(div, t3);
    			mount_component(arcadebutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*error*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const textfield0_changes = {};

    			if (!updating_value && dirty & /*roomCode*/ 2) {
    				updating_value = true;
    				textfield0_changes.value = /*roomCode*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield0.$set(textfield0_changes);
    			const textfield1_changes = {};

    			if (!updating_value_1 && dirty & /*playerName*/ 4) {
    				updating_value_1 = true;
    				textfield1_changes.value = /*playerName*/ ctx[2];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textfield1.$set(textfield1_changes);
    			const arcadebutton_changes = {};
    			if (dirty & /*disabled*/ 8) arcadebutton_changes.disabled = /*disabled*/ ctx[3];

    			if (dirty & /*$$scope*/ 256) {
    				arcadebutton_changes.$$scope = { dirty, ctx };
    			}

    			arcadebutton.$set(arcadebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(arcadebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(arcadebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(textfield0);
    			destroy_component(textfield1);
    			destroy_component(arcadebutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let disabled;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Join', slots, []);
    	const dispatch = createEventDispatcher();
    	let { error = null } = $$props;
    	let roomCode = '';
    	let playerName = '';

    	function join() {
    		dispatch('join', { roomCode, playerName });
    	}

    	const writable_props = ['error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Join> was created with unknown prop '${key}'`);
    	});

    	function textfield0_value_binding(value) {
    		roomCode = value;
    		$$invalidate(1, roomCode);
    	}

    	function textfield1_value_binding(value) {
    		playerName = value;
    		$$invalidate(2, playerName);
    	}

    	$$self.$$set = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({
    		ArcadeButton: Arcade_button,
    		TextField: Text_field,
    		Logo,
    		createEventDispatcher,
    		dispatch,
    		error,
    		roomCode,
    		playerName,
    		join,
    		disabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    		if ('roomCode' in $$props) $$invalidate(1, roomCode = $$props.roomCode);
    		if ('playerName' in $$props) $$invalidate(2, playerName = $$props.playerName);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*roomCode, playerName*/ 6) {
    			$$invalidate(3, disabled = roomCode.length < 1 || playerName.length < 2 || playerName.length > 20);
    		}
    	};

    	return [
    		error,
    		roomCode,
    		playerName,
    		disabled,
    		join,
    		textfield0_value_binding,
    		textfield1_value_binding
    	];
    }

    class Join extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { error: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Join",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get error() {
    		throw new Error("<Join>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Join>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$1 = "div.svelte-dzpldm{flex-direction:column;margin:32px;display:flex;gap:16px}";
    styleInject(css_248z$1);

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (34:0) {#if view === 'join'}
    function create_if_block_1(ctx) {
    	let join_1;
    	let current;
    	join_1 = new Join({ $$inline: true });
    	join_1.$on("join", /*join*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(join_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(join_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(join_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(join_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(join_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(34:0) {#if view === 'join'}",
    		ctx
    	});

    	return block;
    }

    // (38:0) {#if view === 'lobby'}
    function create_if_block(ctx) {
    	let div;
    	let t1;
    	let ul;
    	let each_value = /*players*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Players";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-dzpldm");
    			add_location(div, file, 38, 2, 991);
    			add_location(ul, file, 39, 2, 1012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*players*/ 2) {
    				each_value = /*players*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(38:0) {#if view === 'lobby'}",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#each players as player}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*player*/ ctx[7].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file, 41, 6, 1053);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*players*/ 2 && t_value !== (t_value = /*player*/ ctx[7].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(41:4) {#each players as player}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*view*/ ctx[0] === 'join' && create_if_block_1(ctx);
    	let if_block1 = /*view*/ ctx[0] === 'lobby' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*view*/ ctx[0] === 'join') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*view*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*view*/ ctx[0] === 'lobby') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let view = 'join';
    	let paused = false;
    	let players = [];
    	let socket = null;
    	let error = null;

    	function join(e) {
    		error = null;
    		const { roomCode, playerName } = e.detail;

    		// create new url with search params
    		const host = 'ws://localhost:3000';

    		const url = new URL(`${host}/joinGame`);
    		url.searchParams.set('room', roomCode);
    		url.searchParams.set('name', playerName);
    		socket = new WebSocket(url);

    		socket.addEventListener('error', () => {
    			error = 'Failed to connect with server.';
    		});

    		socket.addEventListener('open', () => {
    			$$invalidate(0, view = 'lobby');
    		});

    		socket.addEventListener('message', e => {
    			const data = JSON.parse(e.data);
    			handleMessage(data);
    		});
    	}

    	function handleMessage(msg) {
    		if (msg.type === 'list_players') {
    			$$invalidate(1, players = msg.players);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Join,
    		view,
    		paused,
    		players,
    		socket,
    		error,
    		join,
    		handleMessage
    	});

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate(0, view = $$props.view);
    		if ('paused' in $$props) paused = $$props.paused;
    		if ('players' in $$props) $$invalidate(1, players = $$props.players);
    		if ('socket' in $$props) socket = $$props.socket;
    		if ('error' in $$props) error = $$props.error;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [view, players, join];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var css_248z = ":root {\n  --wds-genuine-white: rgba(253,253,253,1);\n  --wds-genuine-black: rgba(0,0,0,1);\n  --wds-light-grey-05: rgba(250,250,251,1);\n  --wds-light-grey-10: rgba(238,238,241,1);\n  --wds-light-grey-20: rgba(227,227,232,1);\n  --wds-light-grey-30: rgba(216,215,222,1);\n  --wds-light-grey-40: rgba(205,204,213,1);\n  --wds-light-grey-50: rgba(193,193,203,1);\n  --wds-light-grey-60: rgba(182,181,194,1);\n  --wds-light-grey-70: rgba(171,170,184,1);\n  --wds-light-grey-80: rgba(159,158,175,1);\n  --wds-light-grey-90: rgba(148,147,165,1);\n  --wds-dark-grey-05: rgba(78,76,98,1);\n  --wds-dark-grey-10: rgba(71,69,89,1);\n  --wds-dark-grey-20: rgba(64,63,81,1);\n  --wds-dark-grey-30: rgba(57,56,72,1);\n  --wds-dark-grey-40: rgba(50,49,63,1);\n  --wds-dark-grey-50: rgba(43,42,54,1);\n  --wds-dark-grey-60: rgba(36,36,46,1);\n  --wds-dark-grey-70: rgba(30,29,37,1);\n  --wds-dark-grey-80: rgba(23,22,28,1);\n  --wds-dark-grey-90: rgba(16,15,20,1);\n  --wds-blue-05: rgba(204,238,255,1);\n  --wds-blue-10: rgba(163,221,255,1);\n  --wds-blue-20: rgba(122,200,255,1);\n  --wds-blue-30: rgba(82,177,255,1);\n  --wds-blue-40: rgba(41,151,255,1);\n  --wds-blue-50: rgba(0,122,255,1);\n  --wds-blue-60: rgba(0,94,217,1);\n  --wds-blue-70: rgba(0,69,179,1);\n  --wds-blue-80: rgba(18,41,133,1);\n  --wds-blue-90: rgba(6,22,86,1);\n  --wds-neon-05: rgba(227,255,243,1);\n  --wds-neon-10: rgba(209,255,238,1);\n  --wds-neon-20: rgba(179,255,227,1);\n  --wds-neon-30: rgba(135,255,209,1);\n  --wds-neon-40: rgba(41,255,179,1);\n  --wds-neon-50: rgba(0,234,165,1);\n  --wds-neon-60: rgba(0,194,138,1);\n  --wds-neon-70: rgba(0,151,109,1);\n  --wds-neon-80: rgba(0,108,79,1);\n  --wds-neon-90: rgba(0,63,46,1);\n  --wds-green-05: rgba(245,250,234,1);\n  --wds-green-10: rgba(230,241,196,1);\n  --wds-green-20: rgba(216,230,159,1);\n  --wds-green-30: rgba(204,218,123,1);\n  --wds-green-40: rgba(193,206,88,1);\n  --wds-green-50: rgba(184,192,54,1);\n  --wds-green-60: rgba(147,158,42,1);\n  --wds-green-70: rgba(111,123,31,1);\n  --wds-green-80: rgba(76,87,21,1);\n  --wds-green-90: rgba(42,50,11,1);\n  --wds-yellow-05: rgba(255,255,230,1);\n  --wds-yellow-10: rgba(255,255,184,1);\n  --wds-yellow-20: rgba(255,248,138,1);\n  --wds-yellow-30: rgba(255,234,92,1);\n  --wds-yellow-40: rgba(253,215,46,1);\n  --wds-yellow-50: rgba(247,192,0,1);\n  --wds-yellow-60: rgba(223,143,0,1);\n  --wds-yellow-70: rgba(191,98,0,1);\n  --wds-yellow-80: rgba(159,59,0,1);\n  --wds-yellow-90: rgba(128,26,0,1);\n  --wds-red-05: rgba(255,233,234,1);\n  --wds-red-10: rgba(255,194,201,1);\n  --wds-red-20: rgba(255,136,151,1);\n  --wds-red-30: rgba(255,106,124,1);\n  --wds-red-40: rgba(251,81,102,1);\n  --wds-red-50: rgba(234,62,85,1);\n  --wds-red-60: rgba(199,46,66,1);\n  --wds-red-70: rgba(162,32,50,1);\n  --wds-red-80: rgba(122,21,34,1);\n  --wds-red-90: rgba(79,11,21,1);\n  --wds-orange-05: rgba(255,244,236,1);\n  --wds-orange-10: rgba(255,223,202,1);\n  --wds-orange-20: rgba(255,198,169,1);\n  --wds-orange-30: rgba(255,171,138,1);\n  --wds-orange-40: rgba(255,141,108,1);\n  --wds-orange-50: rgba(255,110,79,1);\n  --wds-orange-60: rgba(214,80,48,1);\n  --wds-orange-70: rgba(167,53,23,1);\n  --wds-orange-80: rgba(123,32,6,1);\n  --wds-orange-90: rgba(72,15,0,1);\n  --wds-pink-05: rgba(255,236,243,1);\n  --wds-pink-10: rgba(255,203,222,1);\n  --wds-pink-20: rgba(253,171,202,1);\n  --wds-pink-30: rgba(250,140,181,1);\n  --wds-pink-40: rgba(246,110,161,1);\n  --wds-pink-50: rgba(241,81,141,1);\n  --wds-pink-60: rgba(214,51,114,1);\n  --wds-pink-70: rgba(173,28,89,1);\n  --wds-pink-80: rgba(133,11,66,1);\n  --wds-pink-90: rgba(92,0,44,1);\n  --wds-purple-05: rgba(242,236,255,1);\n  --wds-purple-10: rgba(220,202,255,1);\n  --wds-purple-20: rgba(198,169,255,1);\n  --wds-purple-30: rgba(176,138,255,1);\n  --wds-purple-40: rgba(155,108,255,1);\n  --wds-purple-50: rgba(134,79,255,1);\n  --wds-purple-60: rgba(106,48,214,1);\n  --wds-purple-70: rgba(80,24,173,1);\n  --wds-purple-80: rgba(57,7,133,1);\n  --wds-purple-90: rgba(36,0,92,1);\n}\n\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 100;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Thin.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 100;\n  font-display: swap;\n  src: url(\"/fonts/Inter-ThinItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 200;\n  font-display: swap;\n  src: url(\"/fonts/Inter-ExtraLight.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 200;\n  font-display: swap;\n  src: url(\"/fonts/Inter-ExtraLightItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 300;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Light.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 300;\n  font-display: swap;\n  src: url(\"/fonts/Inter-LightItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Regular.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 400;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Italic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Medium.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 500;\n  font-display: swap;\n  src: url(\"/fonts/Inter-MediumItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/fonts/Inter-SemiBold.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 600;\n  font-display: swap;\n  src: url(\"/fonts/Inter-SemiBoldItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Bold.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 700;\n  font-display: swap;\n  src: url(\"/fonts/Inter-BoldItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 800;\n  font-display: swap;\n  src: url(\"/fonts/Inter-ExtraBold.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 800;\n  font-display: swap;\n  src: url(\"/fonts/Inter-ExtraBoldItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: normal;\n  font-weight: 900;\n  font-display: swap;\n  src: url(\"/fonts/Inter-Black.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Inter\";\n  font-style: italic;\n  font-weight: 900;\n  font-display: swap;\n  src: url(\"/fonts/Inter-BlackItalic.woff2\") format(\"woff2\");\n}\n@font-face {\n  font-family: \"Cascadia Mono\";\n  src: url(\"/fonts/CascadiaMono-Regular.woff2\") format(\"woff2\");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Cascadia Mono\";\n  src: url(\"/fonts/CascadiaMono-BoldItalic.woff2\") format(\"woff2\");\n  font-weight: bold;\n  font-style: italic;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Cascadia Mono\";\n  src: url(\"/fonts/CascadiaMono-Bold.woff2\") format(\"woff2\");\n  font-weight: bold;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Cascadia Mono\";\n  src: url(\"/fonts/CascadiaMono-Italic.woff2\") format(\"woff2\");\n  font-weight: normal;\n  font-style: italic;\n  font-display: swap;\n}\nbutton, input, textarea {\n  font-size: inherit;\n  font-family: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  color: inherit;\n  background: transparent;\n}\n\nbody {\n  background: var(--wds-dark-grey-70);\n  color: var(--wds-light-grey-05);\n  font-family: \"Inter\";\n  font-size: 20px;\n}";
    styleInject(css_248z);

    const app = new App({
        target: document.body,
    });

    return app;

})();
