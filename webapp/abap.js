// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function(g) {
    var l;
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(c, t) {
            var T, k, n;
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }
            if (typeof c !== "function") {
                throw new TypeError(c + ' is not a function');
            }
            if (arguments.length > 1) {
                T = t;
            }
            n = this.length;
            for (k = 0; k < n; ++k) {
                c.call(T, this[k], k, this);
            }
        }
        ;
    }
    if (typeof define === "function") {
        l = define;
    } else {
        if ((typeof jQuery !== "undefined") && jQuery.sap) {
            l = function(m, d, a) {
                var b = [];
                d.forEach(function(c) {
                    jQuery.sap.require(c);
                    b.push(jQuery.sap.getObject(c));
                });
                jQuery.sap.setObject(m, a.apply(g, b));
            }
            ;
        } else {
            l = function(m, d, a) {
                if (d && (d.length > 0)) {
                    throw new Error("Cannot resolve dependencies");
                }
                a();
            }
            ;
        }
    }
    l("sap.net.xhr", [], function() {
        "use strict";
        var p, a, b, c, N, _, X, L, E, C, I, d, u = 0;
        if (XMLHttpRequest._SAP_ENHANCED) {
            return {};
        }
        p = ["loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
        a = p.concat("readystatechange");
        function m(e, h) {
            var k, n, i, t, x, B;
            n = h.length;
            for (k = 0; k < n; ++k) {
                i = h[k];
                B = e[i];
                if (B) {
                    x = "_" + i;
                    t = e[x];
                    if (!t) {
                        e[x] = B;
                    }
                }
            }
        }
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(e, h) {
                h = h || 0;
                return (this.substr(h, e.length) === e);
            }
        }
        if (!String.prototype.trim) {
            d = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(d, "");
            }
            ;
        }
        function f(x, e) {
            return (typeof x[e] === "function");
        }
        function j(x, e) {
            var h, i, n;
            h = true;
            n = e.length;
            for (i = 0; i < n; ++i) {
                h = h && f(x, e[i]);
                if (!h) {
                    break;
                }
            }
            return h;
        }
        function o(x) {
            return (typeof x === "object") && (x !== null) && j(x, ["error", "warning", "info", "debug"]);
        }
        function q(e) {
            this.logger = e;
        }
        L = q.prototype;
        L.error = function(h) {
            try {
                this.logger.error(h);
            } catch (e) {}
        }
        ;
        L.warning = function(h) {
            try {
                this.logger.warning(h);
            } catch (e) {}
        }
        ;
        L.info = function(h) {
            try {
                this.logger.info(h);
            } catch (e) {}
        }
        ;
        L.debug = function(h) {
            try {
                this.logger.debug(h);
            } catch (e) {}
        }
        ;
        N = function() {}
        ;
        c = {
            error: N,
            warning: N,
            info: N,
            debug: N
        };
        b = new q(c);
        function r(x) {
            var t;
            t = typeof x;
            return (t === "function") || ((t === "object") && (x !== null) && (typeof x.handleEvent === "function"));
        }
        function s(x, e, h) {
            try {
                if (typeof x === "function") {
                    x.call(e.currentTarget, e);
                } else {
                    x.handleEvent(e);
                }
            } catch (i) {
                if (h) {
                    h.warning("Exception in " + e.type + " event handler: " + i.message);
                }
                throw i;
            }
        }
        function v(e) {
            var i, n;
            n = e.length;
            for (i = 0; i < n; ++i) {
                this[e[i]] = [];
            }
            this.subscriptions = {};
            this.bufferedEvents = [];
        }
        E = v.prototype;
        E.add = function(t, e) {
            var k, h, i, n;
            if (r(e)) {
                h = this[t];
                if (h) {
                    k = true;
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        if (h[i] === e) {
                            k = false;
                            break;
                        }
                    }
                    if (k) {
                        h.push(e);
                    }
                }
            }
        }
        ;
        E.remove = function(t, e) {
            var h, i, n;
            if (r(e)) {
                h = this[t];
                if (h) {
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        if (h[i] === e) {
                            if (n === 1) {
                                this[t] = [];
                            } else {
                                h.splice(i, 1);
                            }
                            break;
                        }
                    }
                }
            }
        }
        ;
        E.dispatch = function(e) {
            var h, k, t, i, n;
            if (this.suspend) {
                this.bufferedEvents.push(e);
            } else {
                t = e.type;
                h = this[t];
                if (h) {
                    h = h.slice();
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        s(h[i], e, b);
                    }
                }
                k = this["on" + t];
                if (k) {
                    try {
                        k.call(e.currentTarget, e);
                    } catch (x) {
                        b.warning("Exception in on" + t + " callback: " + x.message);
                        throw x;
                    }
                }
            }
        }
        ;
        E.clearEvents = function() {
            this.bufferedEvents = [];
        }
        ;
        E.releaseEvents = function() {
            var k, n, e;
            e = this.bufferedEvents;
            n = e.length;
            if (n > 0) {
                this.clearEvents();
                for (k = 0; k < n; ++k) {
                    this.dispatch(e[k]);
                }
            }
        }
        ;
        E.hasSubscribers = function(t) {
            var h, e;
            h = this[t];
            if (h) {
                e = (h.length > 0) || this["on" + t];
            } else {
                e = false;
            }
            return e;
        }
        ;
        E.subscribed = function(t) {
            return (this.subscriptions[t] ? true : false);
        }
        ;
        E.subscribe = function(t) {
            this.subscriptions[t] = true;
        }
        ;
        E.unsubscribe = function(t) {
            delete this.subscriptions[t];
        }
        ;
        _ = XMLHttpRequest;
        XMLHttpRequest._SAP_ENHANCED = true;
        X = _.prototype;
        _.EventHandlers = v;
        m(X, ["abort", "open", "setRequestHeader", "send", "addEventListener", "removeEventListener"]);
        X._saveOnEvent = function(t) {
            var e, h, i, k;
            e = "on" + t;
            i = this[e];
            h = this._getHandlers();
            if (h[e]) {
                k = (i !== N);
            } else {
                k = !!i;
            }
            if (k) {
                h[e] = i;
                this[e] = N;
            }
        }
        ;
        X._getHandlers = function() {
            var h;
            h = this._handlers;
            if (!h) {
                h = new v(a);
                this._handlers = h;
            }
            return h;
        }
        ;
        X.handleEvent = function(e) {
            if ((e.type === "readystatechange") && (this.readyState > 2)) {
                this._checkEventSubscriptions();
            }
            this._getHandlers().dispatch(e);
        }
        ;
        X.suspendEvents = function() {
            this._getHandlers().suspend = true;
        }
        ;
        X.resumeEvents = function(e) {
            var h;
            h = this._getHandlers();
            h.suspend = false;
            if (e) {
                h.releaseEvents();
            }
        }
        ;
        X.getEventHandler = function() {
            var x, h;
            h = this._fnHandler;
            if (!h) {
                x = this;
                h = function(e) {
                    x.handleEvent(e);
                }
                ;
                this._fnHandler = h;
            }
            return h;
        }
        ;
        X._checkEventSubscription = function(t, h) {
            h = h || this._getHandlers();
            this._saveOnEvent(t);
            if (h.hasSubscribers(t)) {
                if (!h.subscribed(t)) {
                    this._addEventListener(t, this.getEventHandler());
                    h.subscribe(t);
                }
            } else {
                if (h.subscribed(t)) {
                    this._removeEventListener(t, this.getEventHandler());
                    h.unsubscribe(t);
                }
            }
        }
        ;
        X._checkEventSubscriptions = function() {
            var h, i, n;
            h = this._getHandlers();
            n = a.length;
            for (i = 0; i < n; ++i) {
                this._checkEventSubscription(a[i], h);
            }
        }
        ;
        X.addEventListener = function(t, e) {
            this._getHandlers().add(t, e);
            this._checkEventSubscription(t);
        }
        ;
        X.removeEventListener = function(t, e) {
            this._getHandlers().remove(t, e);
            this._checkEventSubscription(t);
        }
        ;
        X.abort = function() {
            var e;
            try {
                e = this._channel;
                if (e) {
                    b.debug("Aborting request " + e.method + " " + e.url);
                    e.aborting();
                    this._abort();
                    e.aborted();
                } else {
                    b.debug("Aborting request");
                    this._abort();
                }
                this._getHandlers().clearEvents();
            } catch (h) {
                b.warning("Failed to abort request: " + h.message);
                if (e) {
                    e["catch"](h);
                } else {
                    throw h;
                }
            }
        }
        ;
        X.open = function(e, h, i, k, n) {
            var t, x, B, D;
            this._id = ++u;
            b.debug("Opening request #" + this._id + " " + e + " " + h);
            x = arguments.length;
            if (x <= 2) {
                i = true;
            }
            B = e;
            D = h;
            this._getHandlers().clearEvents();
            t = _.channelFactory.create(this, e, h, i, k, n);
            this._channel = t;
            this._checkEventSubscription("readystatechange");
            try {
                this._clearParams();
                t.opening();
                e = t.method;
                h = t.url;
                if ((D !== h) || (B !== e)) {
                    b.debug("Rewriting request #" + this._id + " to " + e + " " + h);
                }
                if (x <= 2) {
                    this._open(e, h);
                } else {
                    this._open(e, h, i, k, n);
                }
                t.opened();
                this._addEventListener("readystatechange", this.getEventHandler());
            } catch (F) {
                b.warning("Failed to open request #" + this._id + " " + e + " " + h + ": " + F.message);
                t["catch"](F);
            }
        }
        ;
        X.setRequestHeader = function(h, e) {
            var i, n;
            this._setRequestHeader(h, e);
            n = h.toLowerCase();
            i = this.headers;
            if (i[n]) {
                i[n] += ", " + e;
            } else {
                i[n] = e;
            }
        }
        ;
        X.setRequestHeaders = function(h) {
            var e, k, i, n;
            if (typeof h === "object") {
                k = Object.getOwnPropertyNames(h);
                n = k.length;
                for (i = 0; i < n; ++i) {
                    e = k[i];
                    this.setRequestHeader(e, h[e]);
                }
            }
        }
        ;
        X.send = function(e) {
            var h, i, k;
            this._checkEventSubscriptions();
            try {
                h = this._channel;
                if (h) {
                    i = h.method;
                    k = h.url;
                    b.debug("Sending request #" + this._id + " " + i + " " + k);
                    h.sending();
                }
                this._saveParams(e);
                this._send(e);
                if (h) {
                    h.sent();
                }
            } catch (n) {
                if (i) {
                    b.warning("Failed to send request #" + this._id + " " + i + " " + k + ": " + n.message);
                } else {
                    b.warning("Failed to send request #" + this._id + ": " + n.message);
                }
                if (h) {
                    h["catch"](n);
                } else {
                    throw n;
                }
            }
        }
        ;
        X.getRequestHeader = function(h) {
            return this.headers[h.toLowerCase()];
        }
        ;
        X.deleteRepeatHeader = function(h) {
            delete this.headers[h.toLowerCase()];
        }
        ;
        X.setRepeatHeader = function(h, e) {
            this.headers[h.toLowerCase()] = e;
        }
        ;
        X.reopen = function() {
            var e;
            e = this._channel;
            if (e) {
                b.debug("Reopening request #" + this._id + " " + e.method + " " + e.url);
            } else {
                throw new TypeError("Cannot reopen request");
            }
            this._checkEventSubscription("readystatechange");
            try {
                e.reopening();
                e.opening();
                this._open(e.method, e.url, e.async, e.username, e.password);
                e.opened();
                this._restoreParams();
            } catch (h) {
                b.warning("Failed to reopen request #" + this._id + " " + method + " " + url + ": " + h.message);
                e["catch"](h);
            }
        }
        ;
        X.repeat = function() {
            var e = this._channel;
            if (!e) {
                throw new TypeError("Cannot repeat request");
            }
            this.reopen();
            this.send(this._data);
        }
        ;
        X.toString = function() {
            var e = this._channel
              , h = "[object XMLHttpRequest]";
            if (e) {
                h += "#" + this._id + " " + e.method + " " + e.url;
            }
            return h;
        }
        ;
        Object.defineProperties(X, {
            "channel": {
                get: function() {
                    return this._channel;
                }
            },
            "headers": {
                get: function() {
                    var h;
                    h = this._headers;
                    if (!h) {
                        h = {};
                        this._headers = h;
                    }
                    return h;
                }
            },
            "id": {
                get: function() {
                    return this._id;
                }
            }
        });
        X._clearParams = function() {
            delete this._headers;
            delete this._withCredentials;
            delete this._timeout;
            delete this._data;
        }
        ;
        X._restoreParams = function() {
            var t, h;
            if (this._headers) {
                h = this._headers;
                this._headers = {};
                this.setRequestHeaders(h);
            }
            if (this._withCredentials) {
                this.withCredentials = true;
            }
            t = this._timeout;
            if (t) {
                this.timeout = t;
            }
        }
        ;
        X._saveParams = function(e) {
            var t;
            if ((e !== undefined) && (e !== null)) {
                this._data = e;
            }
            if (this.withCredentials) {
                this._withCredentials = true;
            }
            t = this.timeout;
            if (t) {
                this._timeout = t;
            }
        }
        ;
        Object.defineProperties(XMLHttpRequest, {
            "logger": {
                get: function() {
                    return b;
                },
                set: function(e) {
                    if (o(e)) {
                        b.logger = e;
                    } else {
                        b.logger = c;
                    }
                }
            }
        });
        function w(x, e, h, i, k, n) {
            this.filters = [];
            this.xhr = x;
            this.method = e;
            this.url = h;
            this.async = !!i;
            if (k !== undefined) {
                this.username = k;
            }
            if (n !== undefined) {
                this.password = n;
            }
        }
        C = w.prototype;
        C._process = function(e) {
            var h, k, i, n;
            h = this.filters;
            n = h.length;
            for (i = 0; i < n; ++i) {
                k = h[i];
                if (typeof k[e] === "function") {
                    k[e](this);
                }
            }
        }
        ;
        C.aborting = function() {
            this._process("aborting");
        }
        ;
        C.aborted = function() {
            this._process("aborted");
        }
        ;
        C.opening = function() {
            this._process("opening");
        }
        ;
        C.opened = function() {
            this._process("opened");
        }
        ;
        C.sending = function() {
            this._process("sending");
        }
        ;
        C.sent = function() {
            this._process("sent");
        }
        ;
        C.reopening = function() {
            this._process("reopening");
        }
        ;
        C["catch"] = function(e) {
            var h, i, n;
            h = this.filters;
            n = h.length;
            for (i = 0; i < n; ++i) {
                if (typeof h[i]["catch"] === "function") {
                    try {
                        h[i]["catch"](e, this);
                        e = null;
                        break;
                    } catch (k) {
                        e = k;
                    }
                }
            }
            if (e) {
                throw e;
            }
        }
        ;
        function y() {
            this.p = [];
            this.r = [];
            this.f = [];
        }
        I = y.prototype;
        I.add = function(i) {
            switch (typeof i) {
            case "string":
                this.p.push(i);
                break;
            case "object":
                if (i instanceof RegExp) {
                    this.r.push(i);
                } else {
                    throw new TypeError("Unsupported ignore type");
                }
                break;
            case "function":
                this.f.push(i);
                break;
            default:
                throw new TypeError("Unsupported ignore type");
            }
        }
        ;
        I.ignored = function(i) {
            var e;
            e = this._prefix(i) || this._regexp(i) || this._function(i);
            return e;
        }
        ;
        I.clear = function() {
            this.p = [];
            this.r = [];
            this.f = [];
        }
        ;
        I._prefix = function(i) {
            var e, k, n, h;
            h = false;
            e = this.p;
            n = e.length;
            for (k = 0; k < n; ++k) {
                if (i.startsWith(e[k])) {
                    h = true;
                    break;
                }
            }
            return h;
        }
        ;
        I._regexp = function(i) {
            var e, k, n, h;
            h = false;
            e = this.r;
            n = e.length;
            for (k = 0; k < n; ++k) {
                if (e[k].test(i)) {
                    h = true;
                    break;
                }
            }
            return h;
        }
        ;
        I._function = function(i) {
            var e, k, n, h;
            h = false;
            e = this.f;
            n = e.length;
            for (k = 0; k < n; ++k) {
                try {
                    if (e[k](i)) {
                        h = true;
                        break;
                    }
                } catch (t) {}
            }
            return h;
        }
        ;
        function z(x) {
            var t;
            t = typeof x;
            return (t === "function") || ((t === "object") && (x !== null) && (typeof x.addFilter === "function"));
        }
        function A(x, e) {
            if (typeof x === "function") {
                x(e);
            } else {
                x.addFilter(e);
            }
        }
        function S() {
            this._filterFactories = [];
            this.ignore = new y();
        }
        S.prototype.reset = function() {
            this._filterFactories = [];
            this.ignore = new y();
        }
        ;
        S.prototype.addFilterFactory = function(e) {
            var h, k, i, n;
            if (!z(e)) {
                throw new TypeError("addFilterFactory expects a FilterFactory or a function parameter");
            }
            k = this._filterFactories;
            h = true;
            n = k.length;
            for (i = 0; i < n; ++i) {
                if (k[i] === e) {
                    h = false;
                    break;
                }
            }
            if (h) {
                this._filterFactories.push(e);
            }
        }
        ;
        S.prototype.removeFilterFactory = function(e) {
            var h, i, n;
            h = this._filterFactories;
            n = h.length;
            for (i = 0; i < n; ++i) {
                if (h[i] === e) {
                    h.splice(i, 1);
                    break;
                }
            }
        }
        ;
        S.prototype.getFilterFactories = function() {
            return this._filterFactories.slice();
        }
        ;
        S.prototype.create = function(x, e, h, k, t, B) {
            var D, F, i, n;
            D = new w(x,e,h,k,t,B);
            if (!this.ignore.ignored(h)) {
                F = this._filterFactories;
                n = F.length;
                for (i = 0; i < n; ++i) {
                    A(F[i], D);
                }
            }
            return D;
        }
        ;
        XMLHttpRequest.channelFactory = new S();
        return {};
    });
}
)(this);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if (window.jQuery && window.jQuery.sap && window.jQuery.sap.declare) {
    window.jQuery.sap.declare("sap.ui.Device", false);
}
if (typeof window.sap !== "object" && typeof window.sap !== "function") {
    window.sap = {};
}
if (typeof window.sap.ui !== "object") {
    window.sap.ui = {};
}
(function() {
    "use strict";
    if (typeof window.sap.ui.Device === "object" || typeof window.sap.ui.Device === "function") {
        var c = "1.52.1";
        window.sap.ui.Device._checkAPIVersion(c);
        return;
    }
    var d = {};
    function p(i, w) {
        return ("000" + String(i)).slice(-w);
    }
    var F = 0
      , E = 1
      , W = 2
      , I = 3
      , D = 4
      , T = 5;
    var g = function() {
        this.defaultComponent = 'DEVICE';
        this.sWindowName = (window.top == window) ? "" : "[" + window.location.pathname.split('/').slice(-1)[0] + "] ";
        this.log = function(i, s, a) {
            a = a || this.defaultComponent || '';
            var b = new Date()
              , e = {
                time: p(b.getHours(), 2) + ":" + p(b.getMinutes(), 2) + ":" + p(b.getSeconds(), 2),
                date: p(b.getFullYear(), 4) + "-" + p(b.getMonth() + 1, 2) + "-" + p(b.getDate(), 2),
                timestamp: b.getTime(),
                level: i,
                message: s || "",
                component: a || ""
            };
            if (window.console) {
                var f = e.date + " " + e.time + " " + this.sWindowName + e.message + " - " + e.component;
                switch (i) {
                case F:
                case E:
                    console.error(f);
                    break;
                case W:
                    console.warn(f);
                    break;
                case I:
                    console.info ? console.info(f) : console.log(f);
                    break;
                case D:
                    console.debug ? console.debug(f) : console.log(f);
                    break;
                case T:
                    console.trace ? console.trace(f) : console.log(f);
                    break;
                }
            }
            return e;
        }
        ;
    };
    var l = new g();
    l.log(I, "Device API logging initialized");
    d._checkAPIVersion = function(s) {
        var v = "1.52.1";
        if (v != s) {
            l.log(W, "Device API version differs: " + v + " <-> " + s);
        }
    }
    ;
    var h = {};
    function j(e, f, a) {
        if (!h[e]) {
            h[e] = [];
        }
        h[e].push({
            oListener: a,
            fFunction: f
        });
    }
    function k(e, f, a) {
        var b = h[e];
        if (!b) {
            return this;
        }
        for (var i = 0, q = b.length; i < q; i++) {
            if (b[i].fFunction === f && b[i].oListener === a) {
                b.splice(i, 1);
                break;
            }
        }
        if (b.length == 0) {
            delete h[e];
        }
    }
    function n(e, a) {
        var b = h[e], f;
        if (b) {
            b = b.slice();
            for (var i = 0, q = b.length; i < q; i++) {
                f = b[i];
                f.fFunction.call(f.oListener || window, a);
            }
        }
    }
    var O = {
        "WINDOWS": "win",
        "MACINTOSH": "mac",
        "LINUX": "linux",
        "IOS": "iOS",
        "ANDROID": "Android",
        "BLACKBERRY": "bb",
        "WINDOWS_PHONE": "winphone"
    };
    function o(a) {
        a = a || navigator.userAgent;
        var b, e;
        function f() {
            var s = navigator.platform;
            if (s.indexOf("Win") != -1) {
                var t = /Windows NT (\d+).(\d)/i;
                var v = a.match(t);
                var w = "";
                if (v[1] == "6") {
                    if (v[2] == 1) {
                        w = "7";
                    } else if (v[2] > 1) {
                        w = "8";
                    }
                } else {
                    w = v[1];
                }
                return {
                    "name": O.WINDOWS,
                    "versionStr": w
                };
            } else if (s.indexOf("Mac") != -1) {
                return {
                    "name": O.MACINTOSH,
                    "versionStr": ""
                };
            } else if (s.indexOf("Linux") != -1) {
                return {
                    "name": O.LINUX,
                    "versionStr": ""
                };
            }
            l.log(I, "OS detection returned no result");
            return null;
        }
        b = /Windows Phone (?:OS )?([\d.]*)/;
        e = a.match(b);
        if (e) {
            return ({
                "name": O.WINDOWS_PHONE,
                "versionStr": e[1]
            });
        }
        if (a.indexOf("(BB10;") > 0) {
            b = /\sVersion\/([\d.]+)\s/;
            e = a.match(b);
            if (e) {
                return {
                    "name": O.BLACKBERRY,
                    "versionStr": e[1]
                };
            } else {
                return {
                    "name": O.BLACKBERRY,
                    "versionStr": '10'
                };
            }
        }
        b = /\(([a-zA-Z ]+);\s(?:[U]?[;]?)([\D]+)((?:[\d._]*))(?:.*[\)][^\d]*)([\d.]*)\s/;
        e = a.match(b);
        if (e) {
            var i = /iPhone|iPad|iPod/;
            var q = /PlayBook|BlackBerry/;
            if (e[0].match(i)) {
                e[3] = e[3].replace(/_/g, ".");
                return ({
                    "name": O.IOS,
                    "versionStr": e[3]
                });
            } else if (e[2].match(/Android/)) {
                e[2] = e[2].replace(/\s/g, "");
                return ({
                    "name": O.ANDROID,
                    "versionStr": e[3]
                });
            } else if (e[0].match(q)) {
                return ({
                    "name": O.BLACKBERRY,
                    "versionStr": e[4]
                });
            }
        }
        b = /\((Android)[\s]?([\d][.\d]*)?;.*Firefox\/[\d][.\d]*/;
        e = a.match(b);
        if (e) {
            return ({
                "name": O.ANDROID,
                "versionStr": e.length == 3 ? e[2] : ""
            });
        }
        return f();
    }
    function r(a) {
        d.os = o(a) || {};
        d.os.OS = O;
        d.os.version = d.os.versionStr ? parseFloat(d.os.versionStr) : -1;
        if (d.os.name) {
            for (var b in O) {
                if (O[b] === d.os.name) {
                    d.os[b.toLowerCase()] = true;
                }
            }
        }
    }
    r();
    d._setOS = r;
    var B = {
        "INTERNET_EXPLORER": "ie",
        "EDGE": "ed",
        "FIREFOX": "ff",
        "CHROME": "cr",
        "SAFARI": "sf",
        "ANDROID": "an"
    };
    var u = navigator.userAgent;
    /*!
	 * Taken from jQuery JavaScript Library v1.7.1
	 * http://jquery.com/
	 *
	 * Copyright 2011, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 * Copyright 2011, The Dojo Foundation
	 * Released under the MIT, BSD, and GPL Licenses.
	 *
	 * Date: Mon Nov 21 21:11:03 2011 -0500
	 */
    function y(a) {
        var b = (a || u).toLowerCase();
        var e = /(webkit)[ \/]([\w.]+)/;
        var f = /(opera)(?:.*version)?[ \/]([\w.]+)/;
        var i = /(msie) ([\w.]+)/;
        var q = /(trident)\/[\w.]+;.*rv:([\w.]+)/;
        var s = /(edge)[ \/]([\w.]+)/;
        var t = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var v = s.exec(b) || q.exec(b) || e.exec(b) || f.exec(b) || i.exec(b) || b.indexOf("compatible") < 0 && t.exec(b) || [];
        var w = {
            browser: v[1] || "",
            version: v[2] || "0"
        };
        w[w.browser] = true;
        return w;
    }
    function z(a, e) {
        var b = y(a);
        var f = a || u;
        var i = e || window.navigator;
        var q;
        if (b.mozilla) {
            q = /Mobile/;
            if (f.match(/Firefox\/(\d+\.\d+)/)) {
                var v = parseFloat(RegExp.$1);
                return {
                    name: B.FIREFOX,
                    versionStr: "" + v,
                    version: v,
                    mozilla: true,
                    mobile: q.test(f)
                };
            } else {
                return {
                    mobile: q.test(f),
                    mozilla: true,
                    version: -1
                };
            }
        } else if (b.webkit) {
            var s = f.toLowerCase().match(/webkit[\/]([\d.]+)/);
            var w;
            if (s) {
                w = s[1];
            }
            q = /Mobile/;
            if (f.match(/(Chrome|CriOS)\/(\d+\.\d+).\d+/)) {
                var v = parseFloat(RegExp.$2);
                return {
                    name: B.CHROME,
                    versionStr: "" + v,
                    version: v,
                    mobile: q.test(f),
                    webkit: true,
                    webkitVersion: w
                };
            } else if (f.match(/FxiOS\/(\d+\.\d+)/)) {
                var v = parseFloat(RegExp.$1);
                return {
                    name: B.FIREFOX,
                    versionStr: "" + v,
                    version: v,
                    mobile: true,
                    webkit: true,
                    webkitVersion: w
                };
            } else if (f.match(/Android .+ Version\/(\d+\.\d+)/)) {
                var v = parseFloat(RegExp.$1);
                return {
                    name: B.ANDROID,
                    versionStr: "" + v,
                    version: v,
                    mobile: q.test(f),
                    webkit: true,
                    webkitVersion: w
                };
            } else {
                var t = /(Version|PhantomJS)\/(\d+\.\d+).*Safari/;
                var x = i.standalone;
                if (t.test(f)) {
                    var w1 = t.exec(f);
                    var v = parseFloat(w1[2]);
                    return {
                        name: B.SAFARI,
                        versionStr: "" + v,
                        fullscreen: false,
                        webview: false,
                        version: v,
                        mobile: q.test(f),
                        webkit: true,
                        webkitVersion: w,
                        phantomJS: w1[1] === "PhantomJS"
                    };
                } else if (/iPhone|iPad|iPod/.test(f) && !(/CriOS/.test(f)) && !(/FxiOS/.test(f)) && (x === true || x === false)) {
                    return {
                        name: B.SAFARI,
                        version: -1,
                        fullscreen: x,
                        webview: !x,
                        mobile: q.test(f),
                        webkit: true,
                        webkitVersion: w
                    };
                } else {
                    return {
                        mobile: q.test(f),
                        webkit: true,
                        webkitVersion: w,
                        version: -1
                    };
                }
            }
        } else if (b.msie || b.trident) {
            var v;
            if (document.documentMode && !a) {
                if (document.documentMode === 7) {
                    v = 8.0;
                } else {
                    v = parseFloat(document.documentMode);
                }
            } else {
                v = parseFloat(b.version);
            }
            return {
                name: B.INTERNET_EXPLORER,
                versionStr: "" + v,
                version: v,
                msie: true,
                mobile: false
            };
        } else if (b.edge) {
            var v = v = parseFloat(b.version);
            return {
                name: B.EDGE,
                versionStr: "" + v,
                version: v,
                edge: true
            };
        }
        return {
            name: "",
            versionStr: "",
            version: -1,
            mobile: false
        };
    }
    d._testUserAgent = z;
    function A() {
        d.browser = z();
        d.browser.BROWSER = B;
        if (d.browser.name) {
            for (var b in B) {
                if (B[b] === d.browser.name) {
                    d.browser[b.toLowerCase()] = true;
                }
            }
        }
    }
    A();
    d.support = {};
    d.support.touch = !!(('ontouchstart'in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
    if (d.browser.phantomJS) {
        d.support.touch = false;
    }
    d.support.pointer = !!window.PointerEvent;
    d.support.matchmedia = !!window.matchMedia;
    var m = d.support.matchmedia ? window.matchMedia("all and (max-width:0px)") : null;
    d.support.matchmedialistener = !!(m && m.addListener);
    if (d.browser.safari && d.browser.version < 6 && !d.browser.fullscreen && !d.browser.webview) {
        d.support.matchmedialistener = false;
    }
    d.support.orientation = !!("orientation"in window && "onorientationchange"in window);
    d.support.retina = (window.retina || window.devicePixelRatio >= 2);
    d.support.websocket = ('WebSocket'in window);
    d.support.input = {};
    d.support.input.placeholder = ('placeholder'in document.createElement("input"));
    d.media = {};
    var R = {
        "SAP_3STEPS": "3Step",
        "SAP_4STEPS": "4Step",
        "SAP_6STEPS": "6Step",
        "SAP_STANDARD": "Std",
        "SAP_STANDARD_EXTENDED": "StdExt"
    };
    d.media.RANGESETS = R;
    d.media._predefinedRangeSets = {};
    d.media._predefinedRangeSets[R.SAP_3STEPS] = {
        points: [520, 960],
        unit: "px",
        name: R.SAP_3STEPS,
        names: ["S", "M", "L"]
    };
    d.media._predefinedRangeSets[R.SAP_4STEPS] = {
        points: [520, 760, 960],
        unit: "px",
        name: R.SAP_4STEPS,
        names: ["S", "M", "L", "XL"]
    };
    d.media._predefinedRangeSets[R.SAP_6STEPS] = {
        points: [241, 400, 541, 768, 960],
        unit: "px",
        name: R.SAP_6STEPS,
        names: ["XS", "S", "M", "L", "XL", "XXL"]
    };
    d.media._predefinedRangeSets[R.SAP_STANDARD] = {
        points: [600, 1024],
        unit: "px",
        name: R.SAP_STANDARD,
        names: ["Phone", "Tablet", "Desktop"]
    };
    d.media._predefinedRangeSets[R.SAP_STANDARD_EXTENDED] = {
        points: [600, 1024, 1440],
        unit: "px",
        name: R.SAP_STANDARD_EXTENDED,
        names: ["Phone", "Tablet", "Desktop", "LargeDesktop"]
    };
    var _ = R.SAP_STANDARD;
    var C = d.support.matchmedialistener ? 0 : 100;
    var G = {};
    var H = null;
    function J(f, t, a) {
        a = a || "px";
        var q = "all";
        if (f > 0) {
            q = q + " and (min-width:" + f + a + ")";
        }
        if (t > 0) {
            q = q + " and (max-width:" + t + a + ")";
        }
        return q;
    }
    function K(a) {
        if (!d.support.matchmedialistener && H == Q()[0]) {
            return;
        }
        if (G[a].timer) {
            clearTimeout(G[a].timer);
            G[a].timer = null;
        }
        G[a].timer = setTimeout(function() {
            var b = M(a, false);
            if (b) {
                n("media_" + a, b);
            }
        }, C);
    }
    function L(s, i) {
        var q = G[s].queries[i];
        var a = {
            from: q.from,
            unit: G[s].unit
        };
        if (q.to >= 0) {
            a.to = q.to;
        }
        if (G[s].names) {
            a.name = G[s].names[i];
        }
        return a;
    }
    function M(a, b, f) {
        f = f || d.media.matches;
        if (G[a]) {
            var e = G[a].queries;
            var s = null;
            for (var i = 0, t = e.length; i < t; i++) {
                var q = e[i];
                if ((q != G[a].currentquery || b) && f(q.from, q.to, G[a].unit)) {
                    if (!b) {
                        G[a].currentquery = q;
                    }
                    if (!G[a].noClasses && G[a].names && !b) {
                        N(a, G[a].names[i]);
                    }
                    s = L(a, i);
                }
            }
            return s;
        }
        l.log(W, "No queryset with name " + a + " found", 'DEVICE.MEDIA');
        return null;
    }
    function N(s, a, b) {
        var e = "sapUiMedia-" + s + "-";
        P(e + a, b, e);
    }
    function P(s, b, a) {
        var e = document.documentElement;
        if (e.className.length == 0) {
            if (!b) {
                e.className = s;
            }
        } else {
            var f = e.className.split(" ");
            var q = "";
            for (var i = 0; i < f.length; i++) {
                if ((a && f[i].indexOf(a) != 0) || (!a && f[i] != s)) {
                    q = q + f[i] + " ";
                }
            }
            if (!b) {
                q = q + s;
            }
            e.className = q;
        }
    }
    function Q() {
        return [window.innerWidth, window.innerHeight];
    }
    function S(v, a) {
        if (a === "em" || a === "rem") {
            var s = window.getComputedStyle || function(e) {
                return e.currentStyle;
            }
            ;
            var x = s(document.documentElement).fontSize;
            var f = (x && x.indexOf("px") >= 0) ? parseFloat(x, 10) : 16;
            return v * f;
        }
        return v;
    }
    function U(f, t, e, s) {
        f = S(f, e);
        t = S(t, e);
        var w = s[0];
        var a = f < 0 || f <= w;
        var b = t < 0 || w <= t;
        return a && b;
    }
    function V(f, t, a) {
        return U(f, t, a, Q());
    }
    function X(f, t, a) {
        var q = J(f, t, a);
        var b = window.matchMedia(q);
        return b && b.matches;
    }
    d.media.matches = d.support.matchmedia ? X : V;
    d.media.attachHandler = function(f, a, s) {
        var b = s || _;
        j("media_" + b, f, a);
    }
    ;
    d.media.detachHandler = function(f, a, s) {
        var b = s || _;
        k("media_" + b, f, a);
    }
    ;
    d.media.initRangeSet = function(s, a, b, e, f) {
        var t;
        if (!s) {
            t = d.media._predefinedRangeSets[_];
        } else if (s && d.media._predefinedRangeSets[s]) {
            t = d.media._predefinedRangeSets[s];
        } else {
            t = {
                name: s,
                unit: (b || "px").toLowerCase(),
                points: a || [],
                names: e,
                noClasses: !!f
            };
        }
        if (d.media.hasRangeSet(t.name)) {
            l.log(I, "Range set " + t.name + " has already been initialized", 'DEVICE.MEDIA');
            return;
        }
        s = t.name;
        t.queries = [];
        t.timer = null;
        t.currentquery = null;
        t.listener = function() {
            return K(s);
        }
        ;
        var v, w, x;
        var w1 = t.points;
        for (var i = 0, x1 = w1.length; i <= x1; i++) {
            v = (i == 0) ? 0 : w1[i - 1];
            w = (i == w1.length) ? -1 : w1[i];
            x = J(v, w, t.unit);
            t.queries.push({
                query: x,
                from: v,
                to: w
            });
        }
        if (t.names && t.names.length != t.queries.length) {
            t.names = null;
        }
        G[t.name] = t;
        if (d.support.matchmedialistener) {
            var y1 = t.queries;
            for (var i = 0; i < y1.length; i++) {
                var q = y1[i];
                q.media = window.matchMedia(q.query);
                q.media.addListener(t.listener);
            }
        } else {
            window.addEventListener("resize", t.listener, false);
            window.addEventListener("orientationchange", t.listener, false);
        }
        t.listener();
    }
    ;
    d.media.getCurrentRange = function(s, w) {
        if (!d.media.hasRangeSet(s)) {
            return null;
        }
        return M(s, true, isNaN(w) ? null : function(f, t, a) {
            return U(f, t, a, [w, 0]);
        }
        );
    }
    ;
    d.media.hasRangeSet = function(s) {
        return s && !!G[s];
    }
    ;
    d.media.removeRangeSet = function(s) {
        if (!d.media.hasRangeSet(s)) {
            l.log(I, "RangeSet " + s + " not found, thus could not be removed.", 'DEVICE.MEDIA');
            return;
        }
        for (var x in R) {
            if (s === R[x]) {
                l.log(W, "Cannot remove default rangeset - no action taken.", 'DEVICE.MEDIA');
                return;
            }
        }
        var a = G[s];
        if (d.support.matchmedialistener) {
            var q = a.queries;
            for (var i = 0; i < q.length; i++) {
                q[i].media.removeListener(a.listener);
            }
        } else {
            window.removeEventListener("resize", a.listener, false);
            window.removeEventListener("orientationchange", a.listener, false);
        }
        N(s, "", true);
        delete h["media_" + s];
        delete G[s];
    }
    ;
    var Y = {
        "TABLET": "tablet",
        "PHONE": "phone",
        "DESKTOP": "desktop",
        "COMBI": "combi"
    };
    d.system = {};
    function Z(a, b) {
        var t = $(b);
        var i = d.os.windows && d.os.version >= 8;
        var e = d.os.windows && d.os.version === 7;
        var s = {};
        s.tablet = !!(((d.support.touch && !e) || i || !!a) && t);
        s.phone = !!(d.os.windows_phone || ((d.support.touch && !e) || !!a) && !t);
        s.desktop = !!((!s.tablet && !s.phone) || i || e);
        s.combi = !!(s.desktop && s.tablet);
        s.SYSTEMTYPE = Y;
        for (var f in Y) {
            P("sap-" + Y[f], !s[Y[f]]);
        }
        return s;
    }
    function $(a) {
        var u = a || navigator.userAgent;
        var i = d.os.windows && d.os.version >= 8;
        if (d.os.name === d.os.OS.IOS) {
            return /ipad/i.test(u);
        } else {
            if (d.support.touch) {
                if (i) {
                    return true;
                }
                if (d.browser.chrome && d.os.android && d.os.version >= 4.4) {
                    return !/Mobile Safari\/[.0-9]+/.test(u);
                } else {
                    var b = window.devicePixelRatio ? window.devicePixelRatio : 1;
                    if (d.os.android && d.browser.webkit && (parseFloat(d.browser.webkitVersion) > 537.10)) {
                        b = 1;
                    }
                    var t = (Math.min(window.screen.width / b, window.screen.height / b) >= 600);
                    if (s1() && (window.screen.height === 552 || window.screen.height === 553) && (/Nexus 7/i.test(u))) {
                        t = true;
                    }
                    return t;
                }
            } else {
                var e = (/(?=android)(?=.*mobile)/i.test(u));
                return (d.browser.msie && u.indexOf("Touch") !== -1) || (d.os.android && !e);
            }
        }
    }
    function a1(a, b) {
        d.system = Z(a, b);
        if (d.system.tablet || d.system.phone) {
            d.browser.mobile = true;
        }
    }
    a1();
    d._getSystem = Z;
    d.orientation = {};
    d.resize = {};
    d.orientation.attachHandler = function(f, a) {
        j("orientation", f, a);
    }
    ;
    d.resize.attachHandler = function(f, a) {
        j("resize", f, a);
    }
    ;
    d.orientation.detachHandler = function(f, a) {
        k("orientation", f, a);
    }
    ;
    d.resize.detachHandler = function(f, a) {
        k("resize", f, a);
    }
    ;
    function b1(i) {
        i.landscape = s1(true);
        i.portrait = !i.landscape;
    }
    function c1() {
        b1(d.orientation);
        n("orientation", {
            landscape: d.orientation.landscape
        });
    }
    function d1() {
        e1(d.resize);
        n("resize", {
            height: d.resize.height,
            width: d.resize.width
        });
    }
    function e1(i) {
        i.width = Q()[0];
        i.height = Q()[1];
    }
    function f1() {
        var w = d.orientation.landscape;
        var i = s1();
        if (w != i) {
            c1();
        }
        if (!k1) {
            k1 = window.setTimeout(g1, 150);
        }
    }
    function g1() {
        d1();
        k1 = null;
    }
    var h1 = false;
    var i1 = false;
    var j1;
    var k1;
    var l1;
    var m1 = Q()[1];
    var n1 = Q()[0];
    var o1 = false;
    var p1;
    var q1 = /INPUT|TEXTAREA|SELECT/;
    var r1 = d.os.ios && d.browser.name === "sf" && ((d.system.phone && d.os.version >= 7 && d.os.version < 7.1) || (d.system.tablet && d.os.version >= 7));
    function s1(f) {
        if (d.support.touch && d.support.orientation && d.os.android) {
            if (o1 && f) {
                return !d.orientation.landscape;
            }
            if (o1) {
                return d.orientation.landscape;
            }
        } else if (d.support.matchmedia && d.support.orientation) {
            return !!window.matchMedia("(orientation: landscape)").matches;
        }
        var s = Q();
        return s[0] > s[1];
    }
    function t1(e) {
        if (e.type == "resize") {
            if (r1 && q1.test(document.activeElement.tagName) && !h1) {
                return;
            }
            var w = Q()[1];
            var i = Q()[0];
            var t = new Date().getTime();
            if (w === m1 && i === n1) {
                return;
            }
            i1 = true;
            if ((m1 != w) && (n1 == i)) {
                if (!p1 || (t - p1 > 300)) {
                    o1 = (w < m1);
                }
                d1();
            } else {
                n1 = i;
            }
            p1 = t;
            m1 = w;
            if (l1) {
                window.clearTimeout(l1);
                l1 = null;
            }
            l1 = window.setTimeout(v1, 1200);
        } else if (e.type == "orientationchange") {
            h1 = true;
        }
        if (j1) {
            clearTimeout(j1);
            j1 = null;
        }
        j1 = window.setTimeout(u1, 50);
    }
    function u1() {
        if (i1 && (h1 || (d.system.tablet && d.os.ios && d.os.version >= 9))) {
            c1();
            d1();
            h1 = false;
            i1 = false;
            if (l1) {
                window.clearTimeout(l1);
                l1 = null;
            }
        }
        j1 = null;
    }
    function v1() {
        h1 = false;
        i1 = false;
        l1 = null;
    }
    d._update = function(a) {
        u = navigator.userAgent;
        l.log(W, "Device API values manipulated: NOT PRODUCTIVE FEATURE!!! This should be only used for test purposes. Only use if you know what you are doing.");
        A();
        r();
        a1(a);
    }
    ;
    e1(d.resize);
    b1(d.orientation);
    window.sap.ui.Device = d;
    if (d.support.touch && d.support.orientation) {
        window.addEventListener("resize", t1, false);
        window.addEventListener("orientationchange", t1, false);
    } else {
        window.addEventListener("resize", f1, false);
    }
    d.media.initRangeSet();
    d.media.initRangeSet(R["SAP_STANDARD_EXTENDED"]);
    if (sap.ui.define) {
        sap.ui.define("sap/ui/Device", [], function() {
            return d;
        });
    }
}());
// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
this.sap = this.sap || {};
(function() {
    "use strict";
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(t) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var a = Array.prototype.slice.call(arguments, 1)
              , b = this
              , N = function() {}
              , B = function() {
                return b.apply(this instanceof N ? this : t, a.concat(Array.prototype.slice.call(arguments)));
            };
            N.prototype = this.prototype;
            B.prototype = new N();
            return B;
        }
        ;
    }
    sap.ui2 = sap.ui2 || {};
    sap.ui2.srvc = sap.ui2.srvc || {};
    if (sap.ui2.srvc.log) {
        return;
    }
    var c;
    if (typeof jQuery === "function" && jQuery.sap) {
        jQuery.sap.declare("sap.ui2.srvc.utils");
    }
    function q() {
        return typeof jQuery === "function" && jQuery.sap && jQuery.sap.log;
    }
    function f(m, d, C) {
        return (m || "") + " - " + (d || "") + " " + (C || "");
    }
    sap.ui2.srvc.log = {
        debug: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.debug(m, d, C);
                return;
            }
            if (typeof console === "object") {
                if (typeof console.debug === "function") {
                    console.debug(f(m, d, C));
                } else {
                    console.log(f(m, d, C));
                }
            }
        },
        error: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.error(m, d, C);
                return;
            }
            if (typeof console === "object") {
                console.error(f(m, d, C));
            }
        },
        info: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.info(m, d, C);
                return;
            }
            if (typeof console === "object") {
                console.info(f(m, d, C));
            }
        },
        warning: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.warning(m, d, C);
                return;
            }
            if (typeof console === "object") {
                console.warn(f(m, d, C));
            }
        }
    };
    sap.ui2.srvc.absoluteUrl = function(u, b) {
        b = b || location.href;
        if (b.indexOf('://') < 0 && b.charAt(0) !== '/') {
            throw new sap.ui2.srvc.Error("Illegal base URL: " + b,"sap.ui2.srvc");
        }
        if (!u || u.indexOf('://') >= 0 || u.charAt(0) === '/') {
            return this.addCacheBusterTokenUsingUshellConfig(u);
        }
        if (b.search(/^([^:]*:)?\/\/[^\/]+$/) < 0) {
            b = b.replace(/\/[^\/]*$/, '');
        }
        return this.addCacheBusterTokenUsingUshellConfig(b + '/' + u);
    }
    ;
    sap.ui2.srvc.call = function(s, F, a) {
        var m;
        if (a) {
            setTimeout(function() {
                sap.ui2.srvc.call(s, F, false);
            }, 0);
            return;
        }
        try {
            s();
        } catch (e) {
            m = e.message || e.toString();
            sap.ui2.srvc.log.error("Call to success handler failed: " + m, e.stack, "sap.ui2.srvc");
            if (F) {
                F(m);
            }
        }
    }
    ;
    sap.ui2.srvc.get = function(u, x, s, F, X, C) {
        if (typeof s !== "function") {
            throw new sap.ui2.srvc.Error("Missing success handler","sap.ui2.srvc");
        }
        if (typeof F !== "function") {
            throw new sap.ui2.srvc.Error("Missing error handler","sap.ui2.srvc");
        }
        if (x && C) {
            throw new sap.ui2.srvc.Error("Caching of XML responses not supported","sap.ui2.srvc");
        }
        if (typeof sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig === "function") {
            u = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(u);
        }
        X = X || new XMLHttpRequest();
        X.onreadystatechange = function() {
            var r, o;
            if (this.readyState !== 4) {
                return;
            }
            sap.ui2.srvc.get.pending -= 1;
            if (this.status !== 200) {
                sap.ui2.srvc.log.error("Error " + this.status + " in response for URL " + u, null, "sap.ui2.srvc");
                F(u + ": " + this.status + " " + this.statusText, this.responseText);
                return;
            }
            sap.ui2.srvc.log.debug("Received response for URL " + u, null, "sap.ui2.srvc");
            if (x) {
                o = this.responseXML;
                if (o === null || !o.documentElement) {
                    F(u + ": no valid XML");
                    return;
                }
                r = o;
            } else {
                r = this.responseText;
                if (C) {
                    c.put(u, r);
                }
            }
            sap.ui2.srvc.call(s.bind(null, r), F);
        }
        ;
        if (!x && c.containsKey(u)) {
            sap.ui2.srvc.log.debug("Return cached response for URL " + u, null, "sap.ui2.srvc");
            sap.ui2.srvc.call(s.bind(null, c.get(u)), F);
        } else {
            try {
                if (X.readyState < XMLHttpRequest.OPENED) {
                    X.open("GET", u, true);
                } else {
                    sap.ui2.srvc.log.debug("XHR Request was already opened for " + u, null, "sap.ui2.srvc");
                }
                X.send();
                sap.ui2.srvc.get.pending += 1;
                sap.ui2.srvc.log.debug("Sent request to URL " + u, null, "sap.ui2.srvc");
            } catch (e) {
                sap.ui2.srvc.log.error("Error '" + (e.message || e) + "' in request to URL " + u, null, "sap.ui2.srvc");
                throw e;
            }
        }
    }
    ;
    sap.ui2.srvc.addCacheBusterToken = function(u, p, r, t) {
        if (p.test(u)) {
            u = u.replace(p, r);
            u = u.replace(/\[CacheBusterToken\]/g, t);
        }
        return u;
    }
    ;
    sap.ui2.srvc.removeCBAndNormalizeUrl = function(u) {
        var m, U, C, s;
        if (typeof u !== "string" || u === "" || a(u)) {
            return u;
        }
        function a(d) {
            var o = new URI(d)
              , p = o.path();
            if (o.is("absolute")) {
                return false;
            }
            if (p && p.charAt(0) === "/") {
                return false;
            }
            return true;
        }
        m = u.match(/(.*)(\/~[\w\-]+~[A-Z0-9]?)(.*)/);
        if (m) {
            U = m[1];
            C = m[2];
            s = m[3];
        }
        function n(d) {
            return new URI(d).normalizePathname().toString();
        }
        function b(p) {
            var S = new URI(p).segment(), i, P = 0;
            for (i = 0; i < S.length && P >= 0; i += 1) {
                if (S[i] === "..") {
                    P = P - 1;
                } else {
                    P = P + 1;
                }
            }
            return P < 0;
        }
        if (C) {
            if (s && b(s)) {
                u = U + s;
            }
        }
        return n(u);
    }
    ;
    sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig = function(u) {
        var C = window["sap-ushell-config"] && window["sap-ushell-config"].cacheBusting, p = C && C.patterns, s = u, P = [], S, r = [];
        P = sap.ui2.srvc.getParameterMap();
        S = P["sap-ushell-nocb"] && P["sap-ushell-nocb"][0];
        if ((S === 'true' || S === 'X') && typeof u === "string") {
            u = u.replace(/\/~[\w\-]+~[A-Z0-9]?/, "");
            return u;
        }
        if (!C || typeof u !== "string" || u === "" || /[\/=]~[\w\-]+~[A-Z0-9]?[\/#\?\&]/.test(u) || /[\/=]~[\w\-]+~[A-Z0-9]?$/.test(u)) {
            return u;
        }
        if (C && C.urls) {
            if (u.charAt(u.length - 1) === "/") {
                u = u.substr(0, u.length - 1);
            }
            if (C.urls.hasOwnProperty(u)) {
                return u + "/" + C.urls[u].cacheBusterToken;
            }
            if (C.urls.hasOwnProperty(u + "/")) {
                return u + "/" + C.urls[u + "/"].cacheBusterToken;
            }
        }
        if (!p) {
            return u;
        }
        Object.keys(p).forEach(function(a) {
            if (p.hasOwnProperty(a)) {
                var R = p[a];
                R.pattern = new RegExp(a);
                r.push(R);
            }
        });
        r.sort(function(R, o) {
            return R.order - o.order;
        });
        r.every(function(R) {
            if (R.pattern.test(u)) {
                if (!R.cacheBusterToken) {
                    R.cacheBusterToken = C.cacheBusterToken;
                }
                s = sap.ui2.srvc.addCacheBusterToken(u, R.pattern, R.replacement, R.cacheBusterToken);
                return false;
            }
            return true;
        });
        return s;
    }
    ;
    sap.ui2.srvc.get.clearCache = function() {
        c = new sap.ui2.srvc.Map();
    }
    ;
    sap.ui2.srvc.get.pending = 0;
    sap.ui2.srvc.getFormFactor = function() {
        var s = sap.ui.Device.system;
        if (s.desktop) {
            return s.SYSTEMTYPE.DESKTOP;
        }
        if (s.tablet) {
            return s.SYSTEMTYPE.TABLET;
        }
        if (s.phone) {
            return s.SYSTEMTYPE.PHONE;
        }
    }
    ;
    sap.ui2.srvc.getParameterMap = function(s) {
        var i, n, r = {}, k, v, I, K, S = arguments.length > 0 ? s : location.search;
        if (S && S.charAt(0) !== "?") {
            throw new sap.ui2.srvc.Error("Illegal search string " + S,"sap.ui2.srvc");
        }
        if (!S || S === "?") {
            return {};
        }
        K = S.substring(1).replace(/\+/g, ' ').split(/[&;]/);
        for (i = 0,
        n = K.length; i < n; i += 1) {
            k = K[i];
            v = "";
            I = k.indexOf("=");
            if (I >= 0) {
                v = k.slice(I + 1);
                v = decodeURIComponent(v);
                k = k.slice(0, I);
            }
            k = decodeURIComponent(k);
            if (!Object.prototype.hasOwnProperty.call(r, k)) {
                r[k] = [];
            }
            r[k].push(v);
        }
        return r;
    }
    ;
    sap.ui2.srvc.getParameterValue = function(u, n) {
        var p, Q;
        if (typeof n !== "string") {
            throw new sap.ui2.srvc.Error("Missing parameter name","sap.ui2.srvc");
        }
        u = u.split('#')[0];
        Q = u.indexOf("?");
        if (Q >= 0) {
            p = sap.ui2.srvc.getParameterMap(u.slice(Q));
            if (p[n]) {
                return p[n][0];
            }
        }
        return "";
    }
    ;
    sap.ui2.srvc.isArray = function(o) {
        return Object.prototype.toString.apply(o) === '[object Array]';
    }
    ;
    sap.ui2.srvc.isString = function name(o) {
        return /String/.test(Object.prototype.toString.call(o));
    }
    ;
    sap.ui2.srvc.parseXml = function(x) {
        var X;
        if (!x || typeof x !== "string") {
            return null;
        }
        X = new DOMParser().parseFromString(x, "text/xml");
        if (X.getElementsByTagName("parsererror").length) {
            throw new sap.ui2.srvc.Error("Invalid XML: " + x,"sap.ui2.srvc");
        }
        return X;
    }
    ;
    sap.ui2.srvc.testPublishAt = function(o) {}
    ;
    if (sap.ui2.srvc.Error === undefined) {
        sap.ui2.srvc.Error = function(m, C) {
            var e = new Error(m);
            e.name = "sap.ui2.srvc.Error";
            sap.ui2.srvc.log.error(m, null, C);
            return e;
        }
        ;
    }
    sap.ui2.srvc.Map = function() {
        this.entries = {};
    }
    ;
    sap.ui2.srvc.Map.prototype.put = function(k, v) {
        var o = this.get(k);
        this.entries[k] = v;
        return o;
    }
    ;
    sap.ui2.srvc.Map.prototype.containsKey = function(k) {
        if (typeof k !== "string") {
            throw new sap.ui2.srvc.Error("Not a string key: " + k,"sap.ui2.srvc");
        }
        return Object.prototype.hasOwnProperty.call(this.entries, k);
    }
    ;
    sap.ui2.srvc.Map.prototype.get = function(k) {
        if (this.containsKey(k)) {
            return this.entries[k];
        }
    }
    ;
    sap.ui2.srvc.Map.prototype.keys = function() {
        return Object.keys(this.entries);
    }
    ;
    sap.ui2.srvc.Map.prototype.remove = function(k) {
        delete this.entries[k];
    }
    ;
    sap.ui2.srvc.Map.prototype.toString = function() {
        var r = ['sap.ui2.srvc.Map('];
        r.push(JSON.stringify(this.entries));
        r.push(')');
        return r.join('');
    }
    ;
    sap.ui2.srvc.get.clearCache();
}());
(function() {
    "use strict";
    var S, l, b, u, I, c, H = 2, D = 4, _ = XMLHttpRequest;
    S = {
        AUTHENTICATED: 0,
        UNAUTHENTICATED: 1,
        PENDING: 2
    };
    b = ["xhrlogon", "xhrlogoncomplete", "xhrlogonfailed", "xhrlogonaborted"];
    function d() {
        return _.logger;
    }
    function f(s) {
        return (s >= 200 && s < 300) || (s === 304);
    }
    function g(a) {
        var e;
        e = document.createEvent("Event");
        e.initEvent(a, false, true);
        return e;
    }
    function h(a) {
        var e;
        if (u) {
            e = g(a);
        } else {
            try {
                e = new Event(a);
            } catch (i) {
                u = true;
                e = g(a);
            }
        }
        return e;
    }
    function j(a) {
        var p, e, k, v, x, i;
        p = /(?:,|^)\s*(?:,\s*,)*\s*(\w+)\s*=\s*(?:"((?:[^"\\]|\\.)*)"|(\w*))/g;
        x = {};
        e = p.exec(a);
        while (e !== null) {
            k = e[1];
            v = e[2].replace(/\\(.)/g, "$1");
            x[k] = v;
            e = p.exec(a);
        }
        if (x.accept) {
            x.accept = x.accept.split(",");
            for (i = 0; i < x.accept.length; ++i) {
                x.accept[i] = x.accept[i].trim();
            }
        }
        return x;
    }
    function X(a, e, x) {
        this.channel = a;
        this.event = e;
        this.header = x;
    }
    function m() {
        this.p = [];
        this.r = [];
        this.f = [];
    }
    I = m.prototype;
    I.add = function(i) {
        switch (typeof i) {
        case "string":
            this.p.push(i);
            break;
        case "object":
            if (i instanceof RegExp) {
                this.r.push(i);
            } else {
                throw new TypeError("Unsupported ignore type");
            }
            break;
        case "function":
            this.f.push(i);
            break;
        default:
            throw new TypeError("Unsupported ignore type");
        }
    }
    ;
    I.ignored = function(i) {
        var a;
        a = this._prefix(i) || this._regexp(i) || this._function(i);
        return a;
    }
    ;
    I.clear = function() {
        this.p = [];
        this.r = [];
        this.f = [];
    }
    ;
    I._prefix = function(i) {
        var a, k, n, e;
        e = false;
        a = this.p;
        n = a.length;
        for (k = 0; k < n; ++k) {
            if (i.startsWith(a[k])) {
                e = true;
                break;
            }
        }
        return e;
    }
    ;
    I._regexp = function(i) {
        var a, k, n, e;
        e = false;
        a = this.r;
        n = a.length;
        for (k = 0; k < n; ++k) {
            if (a[k].test(i)) {
                e = true;
                break;
            }
        }
        return e;
    }
    ;
    I._function = function(i) {
        var a, k, n, e;
        e = false;
        a = this.f;
        n = a.length;
        for (k = 0; k < n; ++k) {
            try {
                if (a[k](i)) {
                    e = true;
                    break;
                }
            } catch (p) {}
        }
        return e;
    }
    ;
    function L(a) {
        if (l) {
            throw new Error("XHR Logon Manager already created");
        }
        d().info("Starting XHR Logon Manager");
        this.queue = [];
        this.realms = {};
        this.handlers = new _.EventHandlers(b);
        if (a) {
            this._filterFactory = a;
        }
        this._initializeTrustedOrigins();
        this._registerFilterFactory();
        window.addEventListener("message", this.getEventHandler());
    }
    L.prototype.triggerLogonOnSyncRequest = true;
    L.prototype.addEventListener = function(a, e) {
        this.handlers.add(a, e);
    }
    ;
    L.prototype.removeEventListener = function(a, e) {
        this.handlers.remove(a, e);
    }
    ;
    L.prototype.dispatchEvent = function(e) {
        this.handlers.dispatch(e);
    }
    ;
    L.prototype.dispatchLogonEvent = function(a) {
        var e;
        e = h("xhrlogon");
        e.request = a;
        this.dispatchEvent(e);
    }
    ;
    L.prototype.dispatchLogonCompletedEvent = function(x) {
        var e;
        e = h("xhrlogoncomplete");
        e.xhrLogon = x;
        this.dispatchEvent(e);
    }
    ;
    L.prototype.dispatchLogonFailedEvent = function(x) {
        var e;
        e = h("xhrlogonfailed");
        e.xhrLogon = x;
        this.dispatchEvent(e);
    }
    ;
    L.prototype.dispatchLogonAbortedEvent = function(a) {
        var e;
        e = h("xhrlogonaborted");
        e.realm = a;
        this.dispatchEvent(e);
    }
    ;
    L.prototype.getRealmStatus = function(n) {
        var s;
        s = this.realms[n];
        if (s === undefined) {
            s = S.UNAUTHENTICATED;
            this.realms[n] = s;
        }
        return s;
    }
    ;
    L.prototype.isQueued = function(x) {
        var i, n, a;
        if (this.pending && this.pending.channel && this.pending.channel.xhr === x) {
            return true;
        }
        for (i = 0,
        n = this.queue.length; i < n; ++i) {
            a = this.queue[i];
            if (a.channel && a.channel.xhr === x) {
                return true;
            }
        }
        return false;
    }
    ;
    L.prototype.onXHRLogon = function(a) {
        var e, i;
        if (!a || !a.channel) {
            d().warn("Ignoring invalid XHR Logon request");
            return;
        }
        if (this.isQueued(a.channel.xhr)) {
            d().debug("Ignoring authentication request for already queued request " + a.channel.url);
            return;
        }
        d().info("Authentication requested for " + a.channel.url);
        if (this.handlers.hasSubscribers("xhrlogon")) {
            e = a.header.realm;
            if (this.pending) {
                d().debug("Pending authentication process, queueing request");
                if (this.getRealmStatus(e) === S.AUTHENTICATED) {
                    this.realms[e] = S.UNAUTHENTICATED;
                }
                this.queue.push(a);
            } else {
                d().debug("Dispatching authentication request");
                this.realms[e] = S.PENDING;
                this.pending = a;
                this.dispatchLogonEvent(a);
            }
        } else {
            d().info("No authentication handler registered");
            i = this.queue;
            this.queue = [];
            i.push(a);
            if (this.pending) {
                i.push(this.pending);
                this.pending = undefined;
            }
            this.abort(i);
        }
    }
    ;
    L.prototype.onXHRLogonCompleted = function(x) {
        var a, s, e, p, k, i, n;
        a = x.realm;
        e = this.queue;
        p = [];
        k = [];
        s = f(x.status);
        this.realms[a] = (s ? S.AUTHENTICATED : S.UNAUTHENTICATED);
        if (this.pending) {
            if (a === this.pending.header.realm) {
                p.push(this.pending);
            } else {
                e.push(this.pending);
            }
        }
        this.pending = undefined;
        n = e.length;
        for (i = 0; i < n; ++i) {
            if (e[i].header.realm === a) {
                p.push(e[i]);
            } else {
                k.push(e[i]);
            }
        }
        this.queue = k;
        if (p.length > 0) {
            if (s) {
                d().info("Authentication succeeded for realm " + a + ", repeating requests.");
                this.retry(p);
            } else {
                d().warning("Authentication failed for realm " + a);
                this.abort(p);
            }
        }
        if (s) {
            this.dispatchLogonCompletedEvent(x);
        } else {
            this.dispatchLogonFailedEvent(x);
        }
        if (this.queue.length > 0) {
            this.onXHRLogon(this.queue.shift());
        }
    }
    ;
    L.prototype.abortXHRLogon = function(a) {
        var e, p, k, i, n;
        if (!a && this.pending) {
            a = this.pending.header.realm;
        }
        if (a) {
            e = this.queue;
            p = [];
            k = [];
            this.realms[a] = S.UNAUTHENTICATED;
            if (this.pending) {
                if (a === this.pending.header.realm) {
                    p.push(this.pending);
                } else {
                    e.push(this.pending);
                }
            }
            this.pending = undefined;
            n = e.length;
            for (i = 0; i < n; ++i) {
                if (e[i].header.realm === a) {
                    p.push(e[i]);
                } else {
                    k.push(e[i]);
                }
            }
            this.queue = k;
            if (p.length > 0) {
                d().warning("Authentication aborted for realm " + a);
                this.abort(p);
            }
        } else {
            d().info("No pending authentication, ignoring abort");
        }
        this.dispatchLogonAbortedEvent(a);
        if (this.queue.length > 0) {
            this.onXHRLogon(this.queue.shift());
        }
    }
    ;
    L.prototype.retry = function(a) {
        var i, n, e, x;
        n = a.length;
        for (i = 0; i < n; ++i) {
            try {
                e = a[i].channel;
                if (e.async) {
                    x = e.xhr;
                    x.resumeEvents();
                    x.repeat();
                }
            } catch (k) {
                d().warning("Error while repeating request: " + k.message);
            }
        }
    }
    ;
    L.prototype.abort = function(a) {
        var i, n, e, x;
        n = a.length;
        for (i = 0; i < n; ++i) {
            try {
                e = a[i].channel;
                if (e.async) {
                    x = e.xhr;
                    x.resumeEvents(true);
                }
            } catch (k) {
                d().warning("Error while aborting request: " + k.message);
            }
        }
    }
    ;
    L.prototype.abortAll = function() {
        var a;
        a = this.queue;
        this.queue = [];
        if (this.pending) {
            a.push(this.pending);
            this.pending = undefined;
        }
        this.abort(a);
    }
    ;
    L.prototype.shutdown = function() {
        d().info("XHR Logon Manager shutdown");
        window.removeEventListener("message", this.getEventHandler());
        this.abortAll();
        this._unregisterFilterFactory();
    }
    ;
    L.prototype.handleEvent = function(e) {
        var a, x, i;
        x = /^\s*\{\s*"xhrLogon"/;
        a = e.data;
        if (x.test(a)) {
            try {
                if (this.isTrusted(e.origin)) {
                    i = JSON.parse(a);
                    this.onXHRLogonCompleted(i.xhrLogon);
                } else {
                    xhrLogon.warning("Received xhrlogon message from untrusted origin " + e.origin);
                }
            } catch (k) {
                d().warning("Invalid xhrLogon message: " + a);
            }
        }
    }
    ;
    L.prototype._initializeTrustedOrigins = function() {
        var a, p, e;
        e = {};
        a = window.location;
        p = a.protocol;
        e[p + "//" + a.host] = true;
        if (a.port === "") {
            switch (p) {
            case "http":
                e[p + "//" + a.host + ":80"] = true;
                break;
            case "https":
                e[p + "//" + a.host + ":443"] = true;
                break;
            }
        }
        this._trustedOrigins = e;
    }
    ;
    L.prototype.isTrusted = function(a) {
        return (!!this._trustedOrigins[a]);
    }
    ;
    L.prototype.addTrustedOrigin = function(a) {
        this._trustedOrigins[a] = true;
    }
    ;
    L.prototype.getEventHandler = function() {
        var a, s;
        a = this._eventHandler;
        if (!a) {
            s = this;
            a = function(e) {
                s.handleEvent(e);
            }
            ;
            this._eventHandler = a;
        }
        return a;
    }
    ;
    L.prototype._getFilterFactory = function() {
        var a, s;
        a = this._filterFactory;
        if (!a) {
            s = this;
            a = function(e) {
                e.filters.push(new o(s,e));
            }
            ;
            this._filterFactory = a;
        }
        return a;
    }
    ;
    L.prototype._registerFilterFactory = function() {
        if (_.channelFactory) {
            _.channelFactory.addFilterFactory(this._getFilterFactory());
        }
    }
    ;
    L.prototype._unregisterFilterFactory = function() {
        if (_.channelFactory) {
            _.channelFactory.removeFilterFactory(this._getFilterFactory());
            delete this._filterFactory;
        }
    }
    ;
    L.prototype.createIgnoreList = function() {
        this.ignore = new m();
    }
    ;
    function o(a, e) {
        this.manager = a;
        this.channel = e;
        if (!this.manager.ignore || !this.manager.ignore.ignored(e.url)) {
            e.xhr._addEventListener("readystatechange", this);
        }
    }
    o.prototype.sending = function(a) {
        var x;
        if (this.manager.ignore && this.manager.ignore.ignored(a.url)) {
            return;
        }
        x = a.xhr;
        if (!x.getRequestHeader("X-XHR-Logon")) {
            x.setRequestHeader("X-XHR-Logon", "accept=\"repeat,iframe\"");
        }
        if (!x.getRequestHeader("X-Requested-With")) {
            x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
    }
    ;
    o.prototype.handleEvent = function(e) {
        var a, x, k, n, s, p, v, i;
        a = this.channel;
        x = a.xhr;
        if (x.readyState < H) {
            return;
        }
        if (x.readyState === H) {
            if (c === undefined) {
                try {
                    s = x.status;
                    c = !!s;
                } catch (s2) {
                    c = false;
                }
                if (!s) {
                    return;
                }
            } else if (!c) {
                return;
            }
        }
        if (x.status === 403) {
            n = x.getResponseHeader("x-xhr-logon");
            if (n) {
                if (a.async) {
                    a.xhr.suspendEvents();
                }
                if (a.async || this.manager.triggerLogonOnSyncRequest) {
                    k = j(n);
                    v = k.accept;
                    if (v) {
                        for (i = 0; i < v.length; ++i) {
                            if (v[i] === 'repeat') {
                                p = true;
                                break;
                            }
                        }
                    }
                    if (p && !a.repeated) {
                        if (x.readyState === D) {
                            a.repeated = true;
                            x.setRepeatHeader("X-XHR-Logon", "accept=\"iframe\"");
                            x.resumeEvents();
                            x.repeat();
                        }
                    } else {
                        this.manager.onXHRLogon(new X(a,e,k));
                    }
                }
            }
        }
    }
    ;
    var q, u, _ = XMLHttpRequest;
    function g(a) {
        var e;
        e = document.createEvent("Event");
        e.initEvent(a, false, true);
        return e;
    }
    function h(a) {
        var e;
        if (u) {
            e = g(a);
        } else {
            try {
                e = new Event(a);
            } catch (i) {
                u = true;
                e = g(a);
            }
        }
        return e;
    }
    function U(a) {
        this._parse(a);
    }
    U.prototype._parse = function(a) {
        var p, e;
        p = /([^?#]+)(\?[^#]*)?(#.*)?/;
        e = p.exec(a);
        this.path = e[1];
        this.hash = e[3] || "";
        this.parameters = this._parseSearch(e[2]);
    }
    ;
    U.prototype._parseSearch = function(s) {
        var p, a, e;
        e = {};
        if (s) {
            p = /[?&]([^&=]+)=?([^&]*)/g;
            a = p.exec(s);
            while (a) {
                e[a[1]] = a[2];
                a = p.exec(s);
            }
        }
        return e;
    }
    ;
    U.prototype.getParameter = function(n) {
        return this.parameters[n];
    }
    ;
    U.prototype.removeParameter = function(n) {
        delete this.parameters[n];
    }
    ;
    U.prototype.setParameter = function(n, v) {
        this.parameters[n] = encodeURIComponent(v);
    }
    ;
    Object.defineProperties(U.prototype, {
        href: {
            enumerable: true,
            get: function() {
                var a;
                a = this.path + this.search + this.hash;
                return a;
            }
        },
        "search": {
            enumerable: true,
            get: function() {
                var s, p, n, v;
                s = "";
                p = this.parameters;
                for (n in p) {
                    if (p.hasOwnProperty(n)) {
                        v = p[n];
                        if (s.length > 0) {
                            s += "&";
                        }
                        s += n;
                        if (v) {
                            s += "=";
                            s += v;
                        }
                    }
                }
                if (s.length > 0) {
                    s = "?" + s;
                }
                return s;
            }
        }
    });
    function r(x, a) {
        var i, v, s = 0, e = a.length - 1;
        if (e < 0 || x < a[0]) {
            return -1;
        }
        if (x >= a[e]) {
            return e;
        }
        while (s < e) {
            i = (s + e + 1) >> 1;
            v = a[i];
            if (x === v) {
                return i;
            }
            if (x < v) {
                e = i - 1;
            } else {
                s = i;
            }
        }
        return s;
    }
    function t() {
        var a, e = 0, i = "authenticationrequired";
        this.handlers = new _.EventHandlers([i]);
        this.addEventListener = function(n, p) {
            this.handlers.add(n, p);
        }
        ;
        this.removeEventListener = function(n, p) {
            this.handlers.remove(n, p);
        }
        ;
        this.dispatchAuthenticationRequired = function() {
            var s = this
              , n = h(i);
            setTimeout(function() {
                s.handlers.dispatch(n);
            }, 0);
        }
        ;
        function k() {
            if (document.readyState === "complete") {
                document.body.appendChild(a);
            }
        }
        this.create = function() {
            var n;
            this.destroy();
            if (this.handlers.hasSubscribers(i)) {
                this.dispatchAuthenticationRequired();
                return null;
            } else {
                e += 1;
                n = "xhrLogonFrame" + e;
                a = document.createElement("iframe");
                a.id = n;
                a.style.display = "none";
                if (document.readyState === "complete") {
                    document.body.appendChild(a);
                } else {
                    A(document, "readystatechange", k);
                }
                return a;
            }
        }
        ;
        this.destroy = function() {
            if (a) {
                document.body.removeChild(a);
                a = null;
            }
        }
        ;
        this.show = function(n) {
            if (!n && this.handlers.hasSubscribers(i)) {
                this.dispatchAuthenticationRequired();
            } else if (a) {
                a.style.display = "block";
                a.style.position = "absolute";
                a.style.top = 0;
                a.style.left = 0;
                a.style.width = "100%";
                a.style.height = "100%";
                a.style.zIndex = 9999;
                a.style.border = 0;
                a.style.background = "white";
            }
        }
        ;
    }
    function F(l) {
        this.logonManager = l;
        this._lfp = new t();
        this._timeout = {};
        this._idxTimeout = [];
        this.defaultTimeout = 600;
        l.addEventListener("xhrlogon", this);
        l.addEventListener("xhrlogoncomplete", this);
        l.addEventListener("xhrlogonfailed", this);
    }
    Object.defineProperties(F.prototype, {
        logonFrameProvider: {
            get: function() {
                return this._lfp;
            },
            set: function(a) {
                if (a) {
                    this._lfp = a;
                } else {
                    this._lfp = new t();
                }
            }
        }
    });
    F.prototype._indexTimeouts = function() {
        var k, i = [], a = this._timeout;
        for (k in a) {
            if (a.hasOwnProperty(k)) {
                i.push(k);
            }
        }
        this._idxTimeout = i.sort();
    }
    ;
    F.prototype.getTimeout = function(a) {
        var p, i = r(a, this._idxTimeout);
        if (i >= 0) {
            p = this._idxTimeout[i];
            if (a.substring(0, p.length) === p) {
                return this._timeout[p];
            }
        }
        return this.defaultTimeout
    }
    ;
    F.prototype.setTimeout = function(p, v) {
        if (!p) {
            return;
        }
        if (v) {
            this._timeout[p] = v;
        } else {
            delete this._timeout[p];
        }
        this._indexTimeouts();
    }
    ;
    F.prototype.shutdown = function() {
        var l;
        l = this.logonManager;
        if (l) {
            l.removeEventListener("xhrlogon", this);
            l.removeEventListener("xhrlogoncomplete", this);
            l.removeEventListener("xhrlogonfailed", this);
        }
    }
    ;
    F.prototype.getFrameLoadHandler = function(p, a, e) {
        var i, k;
        e = e || this.defaultTimeout;
        i = function() {
            if (k) {
                clearTimeout(k);
            }
            k = setTimeout(function() {
                p.show();
            }, e);
        }
        ;
        return i;
    }
    ;
    F.prototype.onXHRLogon = function(a) {
        var e, p, i, k;
        this.cancelXHRLogon();
        k = this.getTimeout(a.channel.url);
        e = new U(a.channel.url);
        e.setParameter("xhr-logon", "iframe");
        p = this.logonFrameProvider;
        i = p.create();
        if (i) {
            if (!i.onload) {
                i.onload = this.getFrameLoadHandler(p, i.id, k);
            }
            i.xhrTimeout = k;
            i.src = e.href;
        }
        this.pending = p;
    }
    ;
    F.prototype.onXHRLogonComplete = function() {
        if (this.pending) {
            this.pending.destroy();
            this.pending = undefined;
        }
    }
    ;
    F.prototype.cancelXHRLogon = function() {
        if (this.pending) {
            L.getInstance().abortXHRLogon();
            this.onXHRLogonComplete();
        }
    }
    ;
    F.prototype.handleEvent = function(e) {
        var a;
        switch (e.type) {
        case "xhrlogon":
            a = e.request;
            if (a) {
                this.onXHRLogon(a);
            }
            break;
        case "xhrlogoncomplete":
            this.onXHRLogonComplete();
            break;
        case "xhrlogonfailed":
            this.onXHRLogonComplete();
            break;
        }
    }
    ;
    var w = new L();
    L.getInstance = function() {
        return w;
    }
    ;
    var y = new F(w);
    y.setLogonFrameProvider = function(n, a) {
        if (this.bLogonFrameProviderFinal) {
            return;
        }
        this.bLogonFrameProviderFinal = !!a;
        this.logonFrameProvider = n;
    }
    ;
    y.setLogonFrameProviderFinal = function(a) {
        this.bLogonFrameProviderFinal = !!a;
    }
    ;
    F.getInstance = function() {
        return y;
    }
    ;
    XMLHttpRequest.logger = sap.ui2.srvc.log;
    var u, z, _ = XMLHttpRequest;
    z = {
        info: function(a) {
            if (_.logger && _.logger.info) {
                _.logger.info(a);
            }
        },
        warning: function(a) {
            if (_.logger && _.logger.warning) {
                _.logger.warning(a);
            }
        }
    };
    function g(a) {
        var e;
        e = document.createEvent("Event");
        e.initEvent(a, false, true);
        return e;
    }
    function h(a) {
        var e;
        if (u) {
            e = g(a);
        } else {
            try {
                e = new Event(a);
            } catch (i) {
                u = true;
                e = g(a);
            }
        }
        return e;
    }
    function A(a, e, i, k) {
        if (a.addEventListener) {
            a.addEventListener(e, i, k);
        } else if (a.attachEvent) {
            a.attachEvent("on" + e, i);
        }
    }
    function B(p) {
        this.provider = p;
        this.xhrTimeout = 600;
    }
    B.frameCounter = 0;
    Object.defineProperty(B.prototype, 'src', {
        get: function() {
            return this.url;
        },
        set: function(a) {
            this.initialize(a);
        }
    });
    B.prototype.initialize = function(a) {
        var e, s = this;
        this.close();
        this.closed = false;
        this.url = a;
        this.createPollingFrame();
        A(this.frame, "load", function() {
            if (e) {
                clearTimeout(e);
            }
            e = setTimeout(function() {
                if (!s.window) {
                    s.createWindow();
                }
            }, s.xhrTimeout);
        });
    }
    ;
    B.prototype.closeFrame = function() {
        if (this.frame) {
            document.body.removeChild(this.frame);
            this.frame = undefined;
        }
    }
    ;
    B.prototype.close = function() {
        try {
            this.closed = true;
            if (this.pollIntervalId) {
                clearInterval(this.pollIntervalId);
                this.pollIntervalId = undefined;
            }
            if (this.windowIntervalId) {
                clearInterval(this.windowIntervalId);
                this.windowIntervalId = undefined;
            }
            this.closeFrame();
            if (this.window) {
                setTimeout(function() {
                    window.focus();
                }, 100);
                this.window.close();
                this.window = undefined;
            }
        } catch (e) {
            z.warning("Error while closing logon window: " + e.message);
        }
    }
    ;
    B.prototype.cancelLogon = function() {
        if (!this.closed) {
            z.warning("XHR Logon cancelled");
            this.close();
            F.getInstance().cancelXHRLogon();
        }
    }
    ;
    B.prototype.createPollingFrame = function() {
        var a, e;
        if (this.closed) {
            return;
        }
        B.frameCounter += 1;
        e = "xhrLogonFrame" + B.frameCounter;
        a = document.createElement("iframe");
        a.id = e;
        a.style.display = "none";
        function i() {
            if (document.readyState === "complete") {
                document.body.appendChild(a);
            }
        }
        if (document.readyState === "complete") {
            document.body.appendChild(a);
        } else {
            A(document, "readystatechange", i);
        }
        this.frame = a;
        a.src = this.url;
    }
    ;
    B.prototype.onWindowOpenFailed = function() {
        z.warning("Failed to open logon window");
        this.cancelLogon();
        this.provider.dispatchWindowFailedEvent();
    }
    ;
    B.prototype.createWindow = function() {
        var a, s = this;
        a = window.open(this.url);
        if (!a) {
            return this.onWindowOpenFailed();
        }
        this.window = a;
        A(a, "load", function() {
            z.info("Logon window opened");
            if (s.windowTimeout) {
                clearTimeout(s.windowTimeout);
            }
            if (s.pollIntervalId) {
                clearInterval(s.pollIntervalId);
            }
            if (s.closed) {
                return;
            }
            s.pollIntervalId = setInterval(function() {
                s.poll();
            }, 5000);
            if (!s.windowIntervalId) {
                s.windowIntervalId = setInterval(function() {
                    var a = s.window;
                    try {
                        if (!a || a.closed) {
                            s.cancelLogon();
                        } else if (typeof a.notifyParent === "function") {
                            s.poll();
                        }
                    } catch (e) {
                        z.warning("Logon polling failed: " + e.message);
                    }
                }, 300);
            }
            setTimeout(function() {
                s.poll();
            }, 300);
        });
        A(a, "close", function() {
            s.cancelLogon();
        });
        setTimeout(function() {
            try {
                if (s.window) {
                    s.window.focus();
                }
            } catch (e) {
                z.warn("Failed to switch focus to logon window");
            }
        }, 300);
        this.windowTimeout = setTimeout(function() {
            s.onWindowOpenFailed();
        }, 5000);
    }
    ;
    B.prototype.poll = function() {
        if (this.window && this.window.closed) {
            this.cancelLogon();
        } else {
            this.closeFrame();
            this.createPollingFrame();
        }
    }
    ;
    function C() {
        this.handlers = new _.EventHandlers(["windowfailed"]);
    }
    C.prototype.create = function() {
        this.frameProxy = new B(this);
        return this.frameProxy;
    }
    ;
    C.prototype.destroy = function() {
        if (this.frameProxy) {
            this.frameProxy.close();
            this.frameProxy = undefined;
        }
    }
    ;
    C.prototype.show = function() {}
    ;
    C.prototype.addEventListener = function(a, e) {
        this.handlers.add(a, e);
    }
    ;
    C.prototype.removeEventListener = function(a, e) {
        this.handlers.remove(a, e);
    }
    ;
    C.prototype.dispatchWindowFailedEvent = function() {
        var s = this
          , e = h("windowfailed");
        setTimeout(function() {
            s.handlers.dispatch(e);
        }, 0);
    }
    ;
    sap.ushell_abap = sap.ushell_abap || {};
    sap.ushell_abap.bootstrap = sap.ushell_abap.bootstrap || {};
    var E = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS", G = "Pages/PageChipInstances/Chip/ChipBags/ChipProperties," + "Pages/PageChipInstances/RemoteCatalog," + "Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties," + "AssignedPages,DefaultPage", J = "PageSets('%2FUI2%2FFiori2LaunchpadHome')", K = "sap-ushell-reloaded", M = new RegExp("^(#)?([A-Za-z0-9_]+)-([A-Za-z0-9_]+)"), T = false, N = false, O = false, P, Q, R, V, W, Y, Z, $, a1, b1, c1, d1, e1, f1;
    window["sap-ushell-aLazyMeasurements"] = [];
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function g1(k) {
        return window.localStorage.getItem(k);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function h1(s) {
        V = /sap-statistics=(true|x|X)/.test(s);
        try {
            V = V || (g1("sap-ui-statistics") === "X");
        } catch (e) {
            sap.ui2.srvc.log.warning("failed to read sap-statistics setting from local storage", null, "sap.ushell_abap.bootstrap");
        }
        return V;
    }
    h1(window.location.search);
    function i1(a) {
        if (a === undefined) {
            return undefined;
        }
        try {
            return JSON.parse(JSON.stringify(a));
        } catch (e) {
            sap.ui2.srvc.log.error("Could not clone object", null, "sap.ushell_abap.bootstrap");
            return undefined;
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function j1(s) {
        function i(s) {
            if (!s) {
                return false;
            }
            return (s.indexOf("Shell-runStandaloneApp") === 0) || (s.indexOf("Shell-home") === 0) || (s.indexOf("Shell-catalog") === 0) || (s.indexOf("shell-catalog") === 0) || (s.indexOf("Action-search") === 0);
        }
        function a() {
            return window['sap-ushell_abap-bootstrap-abap-noInitialTarget'] !== undefined;
        }
        var e = s.match(M);
        var k = e && e[2];
        var n = e && e[3];
        var p = s && !i(s) && !a() && k && n;
        return p;
    }
    function k1(s) {
        return s.indexOf("sap_") === 0;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function l1() {
        return location.href;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function m1() {
        return location.protocol + "//" + location.host;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function n1(v, a) {
        var p = a || sap.ui2.srvc.getParameterMap();
        return p[v] && p[v][0];
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function o1() {
        var s, a = l1(), i = a.indexOf("#");
        if (i < 0) {
            return "";
        }
        s = decodeURI(a.slice(i + 1));
        return s;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function p1() {
        var s = o1()
          , a = s.indexOf("&/");
        return a < 0 ? s : s.slice(0, a);
    }
    function q1(s) {
        var a = s.match(M);
        return a ? {
            semanticObject: a[2],
            action: a[3]
        } : undefined;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function r1(n) {
        N = n;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function s1(n) {
        O = n;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function t1(n) {
        T = n;
    }
    function u1(i, s) {
        if (sap && sap.ushell && sap.ushell.utils && typeof sap.ushell.utils.addTime === "function") {
            sap.ushell.utils.addTime(i, s);
        } else {
            window["sap-ushell-aLazyMeasurements"].push({
                id: i,
                info: s,
                ts: Date.now()
            });
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function v1(n) {
        f1 = n;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function w1(s) {
        var a = sap.ui.getCore()
          , e = a.getConfiguration()
          , i = e.getFormatSettings();
        u1("setSapui5Settings");
        sap.ui2.srvc.log.debug("setSapui5Settings()", JSON.stringify(s), "sap.ushell_abap.bootstrap.abap");
        if (s.language) {
            e.setLanguage(s.language, s.ABAPLanguage);
        }
        if (s.legacyDateFormat) {
            i.setLegacyDateFormat(s.legacyDateFormat);
        }
        if (s.legacyDateCalendarCustomizing) {
            i.setLegacyDateCalendarCustomizing(s.legacyDateCalendarCustomizing);
        }
        if (s.legacyNumberFormat) {
            i.setLegacyNumberFormat(s.legacyNumberFormat);
        }
        if (s.legacyTimeFormat) {
            i.setLegacyTimeFormat(s.legacyTimeFormat);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function x1(a, e, i) {
        var k = i ? JSON.parse(JSON.stringify(e)) : e;
        if (typeof e !== "object") {
            return;
        }
        Object.keys(k).forEach(function(s) {
            if (Object.prototype.toString.apply(a[s]) === "[object Object]" && Object.prototype.toString.apply(k[s]) === "[object Object]") {
                x1(a[s], k[s], false);
                return;
            }
            a[s] = k[s];
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function y1(a) {
        var s = n1("sap-ushell-reload"), e;
        if (s) {
            if (s === "X" || s === "true") {
                e = true;
            } else {
                e = false;
            }
        }
        if (e !== undefined) {
            jQuery.sap.getObject("services.ShellNavigation.config", 0, a).reload = e;
        }
    }
    function z1(a) {}
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function A1(a) {
        jQuery.sap.getObject("sap-ushell-config.services.Container.adapter.config", 0).bootTheme = i1(a);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function B1(s) {
        if (!s) {
            sap.ui2.srvc.log.error("extractSystemThemeRoot: mandatory parameter oStartupServiceResult not supplied");
        }
        if (s.themeRoot) {
            return s.themeRoot;
        }
        if (s.client) {
            sap.ui2.srvc.log.warning("Theme root was not contained in startup service result. A fallback to /sap/public/bc/themes/~client-<client number> is used", null, "sap.ushell_abap.bootstrap");
            return "/sap/public/bc/themes/~client-" + s.client;
        }
        sap.ui2.srvc.log.error("extractSystemThemeRoot: Could not determine system theme root");
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function C1(s) {
        var p, a;
        if (s && s.userProfile) {
            p = s.userProfile.filter(function(e) {
                return e.id === "THEME";
            });
            a = p.length ? p[0] : {};
            if (a.value) {
                return a.value;
            }
        }
        if (s && s.theme) {
            return s.theme;
        }
        return "";
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function D1(s, c1) {
        if (s && k1(s)) {
            return "";
        }
        return c1;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function E1(s, c1) {
        var a;
        a = C1(s);
        return {
            theme: a,
            root: D1(a, c1)
        };
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function F1(c1) {
        var s, a;
        s = n1("sap-theme");
        if (s) {
            if (s.indexOf('@') > 0) {
                a = s.split('@', 2);
                return {
                    theme: a[0],
                    root: a[1]
                };
            }
            return {
                theme: s,
                root: D1(s, c1)
            };
        }
        return undefined;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function G1() {
        if (sap.ui2.srvc.getParameterMap()['sap-theme']) {
            return true;
        }
        return false;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function H1(d1, c1) {
        var a, e = {}, i;
        u1("applyTheme");
        if (G1()) {
            a = F1(c1);
            i = a;
            sap.ui2.srvc.log.debug("theme: URL theme = '" + i.theme + "' theme root = '" + i.root + "'", null, "sap.ushell_abap.bootstrap");
        } else if (d1) {
            i = d1;
            sap.ui2.srvc.log.debug("theme: startup service theme = '" + i.theme + "' theme root = '" + i.root + "'", null, "sap.ushell_abap.bootstrap");
            if (i.root) {
                sap.ui.getCore().applyTheme(i.theme, i.root + "/UI5/");
            } else {
                sap.ui.getCore().applyTheme(i.theme);
            }
        } else {
            e.theme = jQuery.sap.getObject("sap-ui-config.theme");
            if (e.theme) {
                e.root = jQuery.sap.getObject("sap-ui-config.themeRoots." + e.theme);
                if (!e.root) {
                    e.root = D1(e.theme, c1);
                }
                i = {
                    theme: e.theme,
                    root: e.root
                };
                sap.ui2.srvc.log.debug("theme: html file theme = '" + i.theme + "' theme root = '" + i.root + "'", null, "sap.ushell_abap.bootstrap");
            } else {
                i = {
                    theme: "",
                    root: ""
                };
                sap.ui2.srvc.log.error("Could not determine theme", null, "sap.ushell_abap.bootstrap");
            }
        }
        A1(i);
        return i;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function I1(W) {
        var p = sap.ui2.srvc.getParameterMap(), s = n1("sap-locale", p), a = {}, e;
        e = jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config", 0);
        if (e.enabled !== false) {
            e.enabled = (W.isEmbReportingActive === true);
        }
        e = jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config.services", 0);
        e.targetMappings = W.services && W.services.targetMappings;
        e = jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config.services", 0);
        e.targetMappings = W.services && W.services.targetMappings;
        e.launchPage = W.services && W.services.pbFioriHome;
        e = jQuery.sap.getObject("sap-ushell-config.services.PageBuilding.adapter.config.services", 0);
        e.pageBuilding = W.services && W.services.pbFioriHome;
        e = jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config.services", 0);
        e.personalization = W.services && W.services.personalization;
        e = jQuery.sap.getObject("sap-ushell-config.services.Personalization.config", 0);
        e.seed = W.seed;
        if (!s) {
            a = {
                language: W.languageBcp47 || W.language,
                ABAPLanguage: W.language,
                legacyDateFormat: W.dateFormat,
                legacyDateCalendarCustomizing: W.tislcal,
                legacyNumberFormat: W.numberFormat === "" ? " " : W.numberFormat,
                legacyTimeFormat: W.timeFormat
            };
        }
        H1(d1, c1);
        w1(a);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function J1(a) {
        var i = {}, s;
        function e(p, v, k, x, s2) {
            if (!(v && v[s2])) {
                return;
            }
            if (!(k && k[x])) {
                return;
            }
            p[k[x]] = v[s2];
        }
        var k = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config._initialKeys;
        e(i, a, k, "sap-intent-param", "iparState");
        e(i, a, k, "sap-iapp-state", "iappState");
        e(i, a, k, "sap-xapp-state", "xappState");
        var n = jQuery.sap.getObject("sap-ushell-config.services.AppState.config", 0);
        n.initialAppStates = i;
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseResolve(i);
        if (a.targetMappings) {
            s = b1;
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseResolve([s, a.targetMappings, a.systemAliases]);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function K1() {
        var s = "0", p;
        if (window.external && window.external && typeof window.external.getPrivateEpcm !== "undefined") {
            p = window.external.getPrivateEpcm();
            try {
                s = p.getNwbcFeatureBits();
            } catch (e) {
                sap.ui2.srvc.log.error("failed to get feature bit vector via call getNwbcFeatureBits on private epcm object", "sap.ushell_abap.bootstrap");
            }
        }
        return (parseInt(s, 16) & 1) > 0;
    }
    sap.ushell_abap.getShellType = function() {
        return K1() ? "NWBC" : "FLP";
    }
    ;
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function L1(s, a) {
        var e = window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.Container && window["sap-ushell-config"].services.Container.adapter && window["sap-ushell-config"].services.Container.adapter.config
          , p = sap.ui2.srvc.getParameterMap()
          , i = "/sap/bc/ui2/start_up?";
        if (e) {
            s(e);
            return;
        }
        function k(n) {
            var v = p[n];
            if (v) {
                i += n + "=" + encodeURIComponent(v[0]) + "&";
            }
        }
        k("sap-language");
        k("sap-client");
        sap.ui2.srvc.get(i + "shellType=" + sap.ushell_abap.getShellType() + "&depth=0", false, function(n) {
            var W = JSON.parse(n);
            window["sap-ushell-config"] = window["sap-ushell-config"] || {};
            window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
            window["sap-ushell-config"].services.Container = window["sap-ushell-config"].services.Container || {};
            window["sap-ushell-config"].services.Container.adapter = window["sap-ushell-config"].services.Container.adapter || {};
            window["sap-ushell-config"].services.Container.adapter.config = W;
            s(W);
        }, a);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function M1(W) {
        var s = sap.ui2.srvc.getFormFactor()
          , a = p1()
          , e = o1()
          , p = sap.ui2.srvc.getParameterMap()
          , i = "/sap/bc/ui2/start_up?"
          , k = l2(W);
        if (N) {
            return;
        }
        function n(w2) {
            var x2 = p[w2];
            if (x2) {
                i += w2 + "=" + encodeURIComponent(x2[0]) + "&";
            }
        }
        function v(a) {
            if (!a || a === "#") {
                return true;
            }
            return (a.indexOf("Shell-home") === 0) || (a.indexOf("Shell-catalog") === 0) || (a.indexOf("shell-catalog") === 0);
        }
        function x(s2, w2, x2, e) {
            var t2 = e.match(x2);
            var y2 = [];
            if (!t2) {
                return w2;
            }
            w2 += t2[2] + "&";
            y2 = (t2[2]).toString().split("=");
            s2[y2[0]] = y2[1];
            return w2;
        }
        if (!v(a)) {
            s1(true);
        }
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution = window["sap-ushell-config"].services.ClientSideTargetResolution || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config || {};
        Y = undefined;
        b1 = undefined;
        var s2 = {};
        if (j1(a)) {
            var t2 = a.match(M);
            var u2 = t2 && t2[2];
            var v2 = t2 && t2[3];
            b1 = [{
                semanticObject: u2,
                action: v2
            }];
            i += "so=" + u2 + "&action=" + v2 + "&";
            i = x(s2, i, /(\?|&)(sap-xapp-state=[A-Z0-9]+)/, a);
            i = x(s2, i, /(\?|&)(sap-intent-param=[A-Z0-9]+)/, a);
            i = x(s2, i, /(\?|&)(sap-system=[A-Z0-9]+)/, a);
            i = x(s2, i, /(\?|&|[\/])(sap-iapp-state=[A-Z0-9]+)/, e);
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config._initialKeys = s2;
            if (s) {
                i += "formFactor=" + encodeURIComponent(s) + "&";
            }
            n("sap-language");
            n("sap-client");
            u1("RequestDirectStart");
            i += "shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + k;
            sap.ui2.srvc.get(i, false, function(w2) {
                u1("ReceiveDirectStart");
                Y = JSON.parse(w2);
                if (window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.ClientSideTargetResolution && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config && typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction === "function") {
                    window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction(Y);
                }
            }, function(w2) {
                Y = "fail:" + w2;
                if (window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.ClientSideTargetResolution && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config && typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction === "function") {
                    window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction(w2);
                }
            }, m2(n2(i), W));
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function N1() {
        function a(s) {
            window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseReject(s);
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseReject(s);
        }
        var i;
        var e;
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        window["sap-ushell-config"].services.AppState = window["sap-ushell-config"].services.AppState || {};
        window["sap-ushell-config"].services.AppState.config = window["sap-ushell-config"].services.AppState.config || {};
        window["sap-ushell-config"].services.AppState.config = window["sap-ushell-config"].services.AppState.config || {};
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromise = new Promise(function(p, s) {
            i = p;
            e = s;
        }
        );
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseReject = e;
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseResolve = i;
        window["sap-ushell-config"].services.ClientSideTargetResolution = window["sap-ushell-config"].services.ClientSideTargetResolution || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config || {};
        var k;
        var n;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromise = new Promise(function(p, s) {
            k = p;
            n = s;
        }
        );
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromise.catch(function(s) {});
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseReject = n;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseResolve = k;
        if (b1) {
            if (typeof Y === "string") {
                a(Y);
            } else {
                if (Y) {
                    J1(Y);
                } else {
                    window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction = function(Y) {
                        J1(Y);
                    }
                    ;
                    window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction = a;
                }
            }
        } else {
            window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseResolve({});
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseResolve(null);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function O1() {
        if (N || !$) {
            return;
        }
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        function a(s) {
            window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromiseReject(s);
        }
        window["sap-ushell-config"].services.LaunchPage = window["sap-ushell-config"].services.LaunchPage || {};
        window["sap-ushell-config"].services.LaunchPage.adapter = window["sap-ushell-config"].services.LaunchPage.adapter || {};
        window["sap-ushell-config"].services.LaunchPage.adapter.config = window["sap-ushell-config"].services.LaunchPage.adapter.config || {};
        var e;
        var i;
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromise = new Promise(function(n, s) {
            e = n;
            i = s;
        }
        );
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromise.catch(function(s) {
            jQuery.sap.log.error("compactTMPromise rejected" + s);
        });
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromiseReject = i;
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromiseResolve = e;
        function p(k) {
            var n = window["sap-ushell-config"].services.LaunchPage.adapter.config;
            if (k.targetMappings) {
                n.compactTMPromiseResolve(k.targetMappings);
                return;
            }
            n.compactTMPromiseResolve({});
        }
        var k = a1;
        if (typeof k === "string") {
            a(k);
        } else if (k) {
            p(k);
        } else {
            window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMResultFunction = function(n) {
                p(a1);
            }
            ;
            window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMFailFunction = a;
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function P1() {
        if (N) {
            return;
        }
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        function a(s) {
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromiseReject(s);
        }
        window["sap-ushell-config"].services.ClientSideTargetResolution = window["sap-ushell-config"].services.ClientSideTargetResolution || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config || {};
        var e;
        var i;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromise = new Promise(function(n, s) {
            e = n;
            i = s;
        }
        );
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromise.catch(function(s) {
            jQuery.sap.log.error("navTargetDataPromise rejected: " + s);
        });
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromiseReject = i;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromiseResolve = e;
        function p(k) {
            var n = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config;
            if (k.client) {
                n.navTargetDataPromiseReject("A start up response was returned in a target mappings request.");
                return;
            }
            if (k) {
                n.navTargetDataPromiseResolve(k);
                return;
            }
            n.navTargetDataPromiseResolve({});
        }
        var k = Z;
        if (typeof k === "string") {
            a(k);
        } else if (k) {
            p(k);
        } else {
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMResultFunction = function(n) {
                p(n);
            }
            ;
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMFailFunction = a;
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function Q1(s, a) {
        var e = /^((.*)\/)?[A-Za-z0-9_]+\.json$/.exec(s), i;
        if (!e) {
            return "name of configuration URL is not valid. Url is:\"" + s + "\"";
        }
        i = typeof e[1] === "undefined" ? "" : e[1];
        if (!a || !a.hasOwnProperty(i) || !a[i]) {
            return "URL for config file does not match restrictions. Url is:\"" + s + "\"";
        }
        return undefined;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function R1() {
        var a = window["sap-ushell-config"] && window["sap-ushell-config"].launchpadConfiguration && window["sap-ushell-config"].launchpadConfiguration.configurationFile, v = a && a["sap-ushell-config-url"], s, e, i = [], k = {}, n = [], p;
        if (Object.prototype.toString.call(v) === "[object Array]") {
            Array.prototype.push.apply(i, v);
        } else if (typeof v === "string") {
            s = v;
        }
        s = s || (sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"] && sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"][0]);
        if (typeof s !== "undefined") {
            p = a && Object.prototype.toString.apply(a) === "[object Object]" && a.hasOwnProperty("configurationFileFolderWhitelist") && Object.prototype.toString.apply(a.configurationFileFolderWhitelist) === "[object Object]" && a.configurationFileFolderWhitelist;
            e = Q1(s, p);
            if (typeof e !== "undefined") {
                sap.ui2.srvc.log.error(e, null, "sap.ushell_abap.bootstrap");
            } else {
                i.push(s);
            }
        }
        i.forEach(function(x) {
            if (!k.hasOwnProperty(x)) {
                k[x] = 0;
            }
            k[x]++;
            if (k[x] === 2) {
                n.push(x);
            }
        });
        if (n.length > 0) {
            sap.ui2.srvc.log.error(["Duplicate Urls found in server configuration:", n.join(", ")].join(" "), null, "sap.ushell_abap.bootstrap");
        }
        return i;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function S1() {
        var a = window.document.getElementsByTagName("meta");
        if (a === undefined) {
            a = [];
        }
        return a;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function T1() {
        var a = S1(), n, s, k, p = a.length, v = [];
        for (var i = 0; i < p; i++) {
            n = a[i].getAttribute("name");
            s = a[i].getAttribute("content");
            if ((typeof n === "string") && n.startsWith("sap.ushellConfig")) {
                if (s) {
                    try {
                        k = JSON.parse(s);
                        v.push(k);
                    } catch (e) {
                        sap.ui2.srvc.log.error("Failed to parse configuration object from meta tag '" + n + "', content: '" + s + "'", e, "sap.ushell_abap.bootstrap");
                    }
                }
            }
        }
        return v;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function U1(s, a) {
        var i = this
          , k = R1()
          , n = []
          , p = 0
          , v = false;
        function x() {
            if (!v) {
                a.apply(i, arguments);
                v = true;
            }
        }
        function s2(t2, u2, v2) {
            var w2;
            try {
                w2 = JSON.parse(v2);
            } catch (e) {
                x(["parse error in server config file", "'" + u2 + "'", "with content:", "'" + v2 + "'"].join(" "));
                return;
            }
            n[t2] = w2;
            p++;
            if (p === k.length) {
                sap.ui2.srvc.call(s.bind(null, n), x);
            }
        }
        if (k.length === 0) {
            sap.ui2.srvc.call(s.bind(null, n), x);
            return;
        }
        k.forEach(function(e, t2) {
            if (v) {
                return;
            }
            var u2 = s2.bind(null, t2, e);
            sap.ui2.srvc.get(e, false, u2, x);
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function V1(s) {
        if (N) {
            return undefined;
        }
        var a = new jQuery.Deferred();
        jQuery.sap.require("sap.ui.thirdparty.datajs");
        OData.read.$cache = OData.read.$cache || new sap.ui2.srvc.Map();
        OData.read.$cache.put(s, a.promise());
        return a;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function W1(a, s, e, i) {
        if (s === 200) {
            a.resolve(JSON.parse(i).d, e);
        } else {
            a.reject(i);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function X1(s, W, a) {
        var x;
        if (N) {
            return;
        }
        x = n2(s);
        x.setRequestHeader("X-CSRF-Token", "fetch");
        m2(x, W);
        if (V) {
            x.setRequestHeader("sap-statistics", "true");
        }
        x.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            a(x.status, x.getResponseHeader("x-csrf-token"), x.responseText);
        }
        ;
        x.send();
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function Y1(a) {
        return new Z1(a);
    }
    function Z1(a) {
        this._oWindow = a || window;
    }
    Z1.prototype.handleEvent = function(e) {
        if (e.type === "windowfailed") {
            this._showErrorAndReload({
                key: "bootstrap.xhr.authenticationRequired",
                text: "Authentication required"
            }, {
                key: "bootstrap.xhr.windowOpenFailed",
                text: "Logon window cannot be opened - ensure pop-up windows are not blocked."
            }, this._handleWindowFailedNoUi5.bind(this));
        } else if (e.type === "authenticationrequired") {
            this._showErrorAndReload({
                key: "bootstrap.xhr.authenticationRequired",
                text: "Authentication required"
            }, {
                key: "bootstrap.xhr.sessionExpired",
                text: "Your session has expired. Press OK to reload."
            }, this._handleAuthenticationRequiredNoUi5.bind(this));
        } else {
            sap.ui2.srvc.log.error("Cannot handle event with unknown type: " + e.type, null, "sap.ushell_abap.bootstrap.XhrLogonEventHandler");
        }
    }
    ;
    Z1.prototype._getUpdatedLocationSearchForReload = function(s) {
        var i = Date.now(), a = new RegExp(["(.*)([?&])", K, "(=[^&]*)?(.*)"].join("")), e, k = false;
        if (typeof s !== "string") {
            throw new Error("Illegal argument: sCurrentLocationSearch must be a string");
        }
        e = s.replace(a, function(n, p, v, x, s2) {
            k = true;
            return [p, v, K, "=", i, s2].join("");
        });
        if (!k) {
            if (s) {
                e = [s, "&", K, "=", i].join("");
            } else {
                e = ["?", K, "=", i].join("");
            }
        }
        return e;
    }
    ;
    Z1.prototype._reloadPage = function() {
        var a = this;
        a._oWindow.setTimeout(function() {
            a._oWindow.location.search = a._getUpdatedLocationSearchForReload(a._oWindow.location.search);
        }, 0);
    }
    ;
    Z1.prototype._isPageReloaded = function() {
        return new RegExp(["[?&]", K].join("")).test(this._oWindow.location.search);
    }
    ;
    Z1.prototype._handleWindowFailedNoUi5 = function() {
        var s = "Authentication required\n\nLogon window cannot be opened - ensure pop-ups are not blocked.";
        this._oWindow.alert(s);
        this._reloadPage();
    }
    ;
    Z1.prototype._handleAuthenticationRequiredNoUi5 = function() {
        if (!this._isPageReloaded()) {
            sap.ui2.srvc.log.error("Illegal state: XHR authentication (mode=reload) requested before SAPUI5 is initialized. This should not happen if the" + " FioriLaunchpad.html page is loaded from the server. Trying to reload page once.", null, "sap.ushell_abap.bootstrap.XhrLogonEventHandler");
            var s = "Authentication required\n\nYour session might have expired. Press OK to reload.";
            this._oWindow.alert(s);
            this._reloadPage();
        } else {
            sap.ui2.srvc.log.error("Illegal state: XHR authentication (mode=reload) requested before SAPUI5 is initialized and page reload has been triggered once." + " Stopping reload to avoid endless loop. This state cannot be overcome. Please ensure that the FioriLaunchpad.html" + " page is not cached, but always loaded from the server.", null, "sap.ushell_abap.bootstrap.XhrLogonEventHandler");
        }
    }
    ;
    Z1.prototype._showErrorAndReload = function(a, e, k) {
        var s, n;
        if (sap && sap.ui && (typeof sap.ui.getCore === "function") && sap.ui.getCore().isInitialized() && jQuery.sap.isDeclared("sap.m.MessageBox", true)) {
            jQuery.sap.require("sap.m.MessageBox");
            if (jQuery.sap.isDeclared("sap.ushell.resources", true)) {
                jQuery.sap.require("sap.ushell.resources");
                s = this._getText(a);
                n = this._getText(e);
            }
            if (jQuery.sap.isDeclared("sap.ui.core.BusyIndicator", true)) {
                jQuery.sap.require("sap.ui.core.BusyIndicator");
                if (typeof sap.ui.core.BusyIndicator.show === "function" && typeof sap.ui.core.BusyIndicator.hide === "function") {
                    sap.ui.core.BusyIndicator.hide();
                    sap.ui.core.BusyIndicator.show = function() {}
                    ;
                }
            }
            if (sap && sap.ca && sap.ca.ui && sap.ca.ui.utils && sap.ca.ui.utils.busydialog) {
                if (typeof sap.ca.ui.utils.busydialog.releaseBusyDialog === "function") {
                    for (var i = 0; i < 200; ++i) {
                        sap.ca.ui.utils.busydialog.releaseBusyDialog();
                    }
                }
            }
            sap.m.MessageBox.show(n, {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: s,
                actions: [sap.m.MessageBox.Action.OK],
                onClose: this._reloadPage.bind(this)
            });
        } else {
            k.call(this);
        }
    }
    ;
    Z1.prototype._getText = function(a) {
        var s = sap.ushell.resources.i18n.getText(a.key);
        if (s && (s !== a.key)) {
            return s;
        } else {
            return a.text;
        }
    }
    ;
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function $1() {
        return new C();
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function _1() {
        return new t();
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function a2(a, e, p, i) {
        var s = n1("sap-ushell-xhrLogon-mode") || a && a.xhrLogon && a.xhrLogon.mode || "frame", x = Y1(), k;
        function n() {
            if (s === "frame") {
                k = _1();
            } else if (s === "window") {
                k = $1();
                k.addEventListener("windowfailed", x);
            } else if (s === "reload") {
                k = _1();
                k.addEventListener("authenticationrequired", x);
            } else {
                sap.ui2.srvc.log.warning("Unknown setting for xhrLogonMode: '" + s + "'. Using default mode 'frame'.", null, "sap.ushell_abap.bootstrap");
            }
            if (k && typeof e.setLogonFrameProvider === "function") {
                e.setLogonFrameProvider(k);
            }
        }
        if (p !== s) {
            n();
        }
        if (i && s !== "frame") {
            e.setLogonFrameProviderFinal(true);
        }
        return s;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function b2(s, a) {
        var e = a.logonManager
          , i = m1();
        if (s && s.indexOf(i + "/") === -1) {
            if (!e.ignore) {
                e.createIgnoreList();
            }
            e.ignore.add(s);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function c2() {
        var p = new Promise(function(a, e) {
            var i, k;
            k = function() {
                sap.ui2.srvc.log.info("Direct application start: resolving component waitFor promise after shell renderer created event fired.");
                a();
                sap.ushell.Container.detachRendererCreatedEvent(k);
            }
            ;
            i = sap.ushell.Container.getRenderer();
            if (i) {
                sap.ui2.srvc.log.info("Direct application start: resolving component waitFor promise immediately (shell renderer already created).");
                a();
            } else {
                sap.ushell.Container.attachRendererCreatedEvent(k);
            }
        }
        );
        return p;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function d2(s, P, a) {
        var e = p1()
          , i = T1();
        I1(s);
        i.forEach(function(k) {
            x1(window["sap-ushell-config"], k, true);
        });
        P.forEach(function(k) {
            x1(window["sap-ushell-config"], k, true);
        });
        N1();
        P1();
        O1();
        y1(window["sap-ushell-config"]);
        z1(window["sap-ushell-config"]);
        jQuery.sap.declare("sap.ui2.srvc.utils");
        sap.ui.getCore().loadLibraries(["sap.ushell_abap"], {
            async: false,
            preloadOnly: false
        });
        jQuery.sap.require("sap.ushell.services.Container");
        sap.ushell.bootstrap("abap", {
            abap: "sap.ushell_abap.adapters.abap",
            hana: "sap.ushell_abap.adapters.hana"
        }).done(function() {
            if (window["sap-ushell-aLazyMeasurements"] && (typeof sap.ushell.utils.addTime === "function")) {
                window["sap-ushell-aLazyMeasurements"].forEach(function(k) {
                    sap.ushell.utils.addTime(k.id, k.info, k.ts);
                });
                delete window["sap-ushell-aLazyMeasurements"];
            }
            a2(window["sap-ushell-config"], y, f1, true);
            sap.ushell.Container.oFrameLogonManager = y;
        }).always(function() {
            if (j1(e)) {
                var k, n;
                window["sap-ushell-async-libs-promise-directstart"] = new Promise(function(p, v) {
                    k = p;
                    n = v;
                }
                );
                window["sap-ushell-async-libs-promise-directstart"].catch(function(p) {});
                sap.ushell.Container.getService("NavTargetResolution").resolveHashFragment("#" + p1()).done(function(p) {
                    if (p && p.ui5ComponentName) {
                        sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(p, q1(e), c2()).done(function(v) {
                            k({
                                resolvedHashFragment: v,
                                dependenciesLoaded: true
                            });
                        }).fail(function(v) {
                            n(v);
                        });
                    } else {
                        k({
                            resolvedHashFragment: p,
                            dependenciesLoaded: false
                        });
                    }
                }).fail(function(p) {
                    n(p);
                });
            }
            a();
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function e2() {
        var a = jQuery.sap.registerModulePath;
        function n(s) {
            var e = sap.ui2.srvc.removeCBAndNormalizeUrl(s)
              , i = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(e);
            return i;
        }
        jQuery.sap.registerModulePath = function(s, v) {
            if (typeof v === "object") {
                v.url = n(v.url);
            } else if (typeof v === "string") {
                v = n(v);
            }
            a(s, v);
        }
        ;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function f2(s, a, e, i, k) {
        var n, p, v = false;
        if (s.services) {
            if (s.services[a]) {
                p = s.services[a];
            } else {
                p = {};
                s.services[a] = p;
                v = true;
            }
        } else {
            p = {};
            s.services = {};
            s.services[a] = p;
            v = true;
        }
        if (!p.baseUrl || !p.relativeUrl) {
            p.baseUrl = e;
            p.relativeUrl = i;
            v = true;
        }
        if (v) {
            sap.ui2.srvc.log.warning("URL for " + a + " service not found in startup service result; fallback to default; cache invalidation might fail", null, "sap.ushell_abap.bootstrap");
        }
        if (p.baseUrl.lastIndexOf("/") !== p.baseUrl.length - 1) {
            p.baseUrl += "/";
        }
        if (p.relativeUrl[0] === "/") {
            p.relativeUrl = p.relativeUrl.slice(1);
        }
        n = p.baseUrl + p.relativeUrl;
        if (!/\$expand=/.test(n) && k) {
            n += (n.indexOf("?") < 0 ? "?" : "&") + "$expand=" + k;
        }
        if (p.cacheId) {
            n += (n.indexOf("?") < 0 ? "?" : "&") + "sap-cache-id=" + p.cacheId;
        }
        if (p["sap-ui2-cache-disable"]) {
            n += (n.indexOf("?") < 0 ? "?" : "&") + "sap-ui2-cache-disable=" + p["sap-ui2-cache-disable"];
        }
        return n;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function g2(s) {
        var a = n1("sap-ui2-cache-disable");
        if (a && s && s.services && s.services.pbFioriHome) {
            s.services.pbFioriHome["sap-ui2-cache-disable"] = a;
        }
        return f2(s, "pbFioriHome", E, J, G);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function h2() {
        if (T && e1 && P) {
            t1(false);
            sap.ui2.srvc.log.debug("sync: point for startupResult, serverConfig and UI5 - executing ushell bootstrap", null, "sap.ushell_abap.bootstrap");
            if (!O) {
                Q = V1(g2(W));
            }
            d2(W, P, e1);
            e1 = P = undefined;
        }
        if (Q && R) {
            sap.ui2.srvc.log.debug("sync: point for pageSet request and UI5 - executing odata cache fill for page set request", null, "sap.ushell_abap.bootstrap");
            R.unshift(Q);
            W1.apply(null, R);
            Q = R = undefined;
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function i2(s) {
        var a = ['ar', 'fa', 'he', 'iw'];
        s = s.toLowerCase().substring(0, 2);
        return a.indexOf(s) >= 0;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function j2() {
        var a = window.document.getElementById("sap-ushell-bootstrap"), s;
        if (a) {
            s = a.src.split('/').slice(0, -4).join('/');
        } else {
            sap.ui2.srvc.log.warning("Cannot determine bootstrap script path: no element with ID 'sap-ushell-bootstrap' found.", null, "sap.ushell_abap.bootstrap");
        }
        return s;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function k2(d1, s) {
        var a = s.languageBcp47 || '', i = i2(a), e, k, n, p;
        if (d1 && d1.theme) {
            p = window.document.createElement('link');
            n = i ? "library-RTL.css" : "library.css";
            if (d1.root) {
                e = d1.root + "/UI5/sap/fiori/themes/";
            } else {
                k = j2();
                if (k) {
                    e = k + "/sap/fiori/themes/";
                }
            }
            if (e) {
                p.setAttribute('href', e + d1.theme + "/" + n);
                p.setAttribute('rel', 'stylesheet');
                p.setAttribute('id', 'sap-ui-theme-sap.fiori');
                window.document.head.appendChild(p);
            }
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function l2(W) {
        var s = W && W.services && W.services.targetMappings && W.services.targetMappings.cacheId;
        if (typeof s === "string") {
            return "&sap-cache-id=" + s;
        }
        return "";
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function m2(x, s) {
        x.setRequestHeader("Accept", "application/json");
        if (s.client) {
            x.setRequestHeader("sap-client", s.client);
        }
        if (s.language) {
            x.setRequestHeader("sap-language", s.language);
        }
        return x;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function n2(s) {
        var x = new XMLHttpRequest();
        x.open("GET", s, true);
        return x;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function o2(W) {
        a1 = undefined;
        if (N) {
            return;
        }
        var p = sap.ui2.srvc.getParameterMap();
        var s = "/sap/bc/ui2/start_up?so=*&action=*&tm-compact=true&"
          , a = l2(W);
        Z = undefined;
        function e(n) {
            var v = p[n];
            if (v) {
                s += n + "=" + encodeURIComponent(v[0]) + "&";
            }
        }
        e("sap-language");
        e("sap-client");
        e("sap-ui2-cache-disable");
        $ = true;
        u1("RequestCompactTM");
        s = s + "shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + a;
        sap.ui2.srvc.get(s, false, function(i) {
            u1("ReceiveCompactTM");
            a1 = JSON.parse(i);
            if (window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.LaunchPage && window["sap-ushell-config"].services.LaunchPage.adapter && window["sap-ushell-config"].services.LaunchPage.adapter.config && typeof window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMResultFunction === "function") {
                window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMResultFunction(Z);
            }
        }, function(i) {
            a1 = "fail:" + i;
            if (window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.LaunchPage && window["sap-ushell-config"].services.LaunchPage.adapter && window["sap-ushell-config"].services.LaunchPage.adapter.config && typeof window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMFailFunction === "function") {
                window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMFailFunction(i);
            }
        }, m2(n2(s), W));
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function p2(W) {
        var p = sap.ui2.srvc.getParameterMap();
        var s = "/sap/bc/ui2/start_up?so=*&action=*&"
          , a = l2(W);
        Z = undefined;
        if (N) {
            return;
        }
        function e(n) {
            var v = p[n];
            if (v) {
                s += n + "=" + encodeURIComponent(v[0]) + "&";
            }
        }
        e("sap-language");
        e("sap-client");
        e("sap-ui2-cache-disable");
        u1("RequestFullTM");
        s = s + "shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + a;
        sap.ui2.srvc.get(s, false, function(i) {
            Z = JSON.parse(i);
            if (window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.ClientSideTargetResolution && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config && typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMResultFunction === "function") {
                window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMResultFunction(Z);
            }
        }, function(i) {
            Z = "fail:" + i;
            if (window["sap-ushell-config"] && window["sap-ushell-config"].services && window["sap-ushell-config"].services.ClientSideTargetResolution && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter && window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config && typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMFailFunction === "function") {
                window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMFailFunction(i);
            }
        }, m2(n2(s), W));
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function q2() {
        if (window['sap-ushell_abap-bootstrap-abap-noOData']) {
            r1(true);
        }
        f1 = a2(window["sap-ushell-config"], y);
        b2(j2(), y);
        L1(function(a) {
            var p;
            W = a;
            M1(W);
            p = g2(W);
            c1 = B1(W);
            d1 = E1(W, c1);
            if (!G1() && d1) {
                sap.ui2.srvc.log.debug("theme: load theme from startup service via window", null, "sap.ushell_abap.bootstrap");
                k2(d1, W);
            }
            t1(true);
            if (!O) {
                X1(p, W, function(s, e, i) {
                    R = Array.prototype.slice.call(arguments);
                    h2();
                });
                o2(W);
            }
            p2(W);
            h2();
        }, function(s) {
            sap.ui2.srvc.log.error("start_up request failed: " + s, null, "sap.ushell_abap.bootstrap");
            W = {};
            t1(true);
            h2();
        });
        U1(function(a) {
            P = a;
            h2();
        }, function(s) {
            sap.ui2.srvc.log.error("Could not load server configuration: " + s, null, "sap.ushell_abap.bootstrap.abap");
            P = [];
            h2();
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function r2(a) {
        e1 = a;
        e2();
        h2();
        XMLHttpRequest.logger = jQuery.sap.log.getLogger("sap.net.xhr");
    }
    sap.ushell_abap.bootstrap.addPostParametersToNavTargetResultUrl = function(p, s) {
        if (p) {
            s += (s.indexOf("?") < 0) ? "?" : "&";
            s += p;
        }
        return s;
    }
    ;
    sap.ushell_abap.bootstrap.adjustNavTargetResult = function(a) {
        if (a) {
            var s = a.url, e, i = {
                applicationType: a.applicationType,
                additionalInformation: a.applicationData
            }, k, n, p, v;
            if (a.text) {
                i.text = a.text;
            }
            if ((a.applicationType === "URL" || a.applicationType === "SAPUI5")) {
                n = /^SAPUI5\.Component=(.*)/.exec(a.applicationData);
                k = n && n[1];
                e = s && new URI(s);
                if (k || a.applicationDependencies) {
                    if (k) {
                        i.ui5ComponentName = k;
                    }
                    if (a.applicationDependencies) {
                        try {
                            p = JSON.parse(a.applicationDependencies);
                            v = p.self;
                            if (!i.ui5ComponentName && v.name) {
                                i.ui5ComponentName = v.name;
                                i.additionalInformation = "SAPUI5.Component=" + i.ui5ComponentName;
                            }
                            if (v && v.url && typeof v.url === "string") {
                                if (e) {
                                    if (v.url.toUpperCase().indexOf(e.path().toUpperCase()) !== 0) {
                                        sap.ui2.srvc.log.debug("Component URL defined in target mapping " + "does not match the URL retrieved from application index. " + "The URL of the application index is used for further processing.", "Target mapping URL: " + a.url + "\nApplication index URL: " + v.url, "sap.ushell_abap.bootstrap.abap");
                                    }
                                    e.path(v.url);
                                    s = e.toString();
                                    jQuery.sap.log.debug("ResolveLink result's component url has been replaced with the url specified " + "in Application Dependencies, which includes cache buster token");
                                } else {
                                    s = v.url;
                                }
                            }
                            i.applicationDependencies = p;
                        } catch (x) {
                            sap.ui2.srvc.log.error("Parsing of applicationDependencies attribute in resolveLink result failed for SAPUI5 component '" + k + "'", x, "sap.ushell_abap.bootstrap.abap");
                        }
                    }
                    s = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(s);
                }
            }
            i.url = s;
            return i;
        }
    }
    ;
    q2();
    window['sap-ui-config'] = window['sap-ui-config'] || {};
    window['sap-ui-config']["xx-bootTask"] = r2;
}());
