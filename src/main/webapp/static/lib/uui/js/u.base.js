// i18next, v1.8.1
// Copyright (c)2015 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
(function(root) {

    // add indexOf to non ECMA-262 standard compliant browsers
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }
    
    // add lastIndexOf to non ECMA-262 standard compliant browsers
    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = len;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) {
                    n = 0;
                } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
            for (; k >= 0; k--) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }
    
    // Add string trim for IE8.
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, ''); 
        }
    }

    var $ = root.jQuery || root.Zepto
      , i18n = {}
      , resStore = {}
      , currentLng
      , replacementCounter = 0
      , languages = []
      , initialized = false
      , sync = {};



    // Export the i18next object for **CommonJS**. 
    // If we're not in CommonJS, add `i18n` to the
    // global object or to jquery.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = i18n;
    } else {
        if ($) {
            $.i18n = $.i18n || i18n;
        }
        
        root.i18n = root.i18n || i18n;
    }
    sync = {
    
        load: function(lngs, options, cb) {
            if (options.useLocalStorage) {
                sync._loadLocal(lngs, options, function(err, store) {
                    var missingLngs = [];
                    for (var i = 0, len = lngs.length; i < len; i++) {
                        if (!store[lngs[i]]) missingLngs.push(lngs[i]);
                    }
    
                    if (missingLngs.length > 0) {
                        sync._fetch(missingLngs, options, function(err, fetched) {
                            f.extend(store, fetched);
                            sync._storeLocal(fetched);
    
                            cb(null, store);
                        });
                    } else {
                        cb(null, store);
                    }
                });
            } else {
                sync._fetch(lngs, options, function(err, store){
                    cb(null, store);
                });
            }
        },
    
        _loadLocal: function(lngs, options, cb) {
            var store = {}
              , nowMS = new Date().getTime();
    
            if(window.localStorage) {
    
                var todo = lngs.length;
    
                f.each(lngs, function(key, lng) {
                    var local = f.localStorage.getItem('res_' + lng);
    
                    if (local) {
                        local = JSON.parse(local);
    
                        if (local.i18nStamp && local.i18nStamp + options.localStorageExpirationTime > nowMS) {
                            store[lng] = local;
                        }
                    }
    
                    todo--; // wait for all done befor callback
                    if (todo === 0) cb(null, store);
                });
            }
        },
    
        _storeLocal: function(store) {
            if(window.localStorage) {
                for (var m in store) {
                    store[m].i18nStamp = new Date().getTime();
                    f.localStorage.setItem('res_' + m, JSON.stringify(store[m]));
                }
            }
            return;
        },
    
        _fetch: function(lngs, options, cb) {
            var ns = options.ns
              , store = {};
            
            if (!options.dynamicLoad) {
                var todo = ns.namespaces.length * lngs.length
                  , errors;
    
                // load each file individual
                f.each(ns.namespaces, function(nsIndex, nsValue) {
                    f.each(lngs, function(lngIndex, lngValue) {
                        
                        // Call this once our translation has returned.
                        var loadComplete = function(err, data) {
                            if (err) {
                                errors = errors || [];
                                errors.push(err);
                            }
                            store[lngValue] = store[lngValue] || {};
                            store[lngValue][nsValue] = data;
    
                            todo--; // wait for all done befor callback
                            if (todo === 0) cb(errors, store);
                        };
                        
                        if(typeof options.customLoad == 'function'){
                            // Use the specified custom callback.
                            options.customLoad(lngValue, nsValue, options, loadComplete);
                        } else {
                            //~ // Use our inbuilt sync.
                            sync._fetchOne(lngValue, nsValue, options, loadComplete);
                        }
                    });
                });
            } else {
                // Call this once our translation has returned.
                var loadComplete = function(err, data) {
                    cb(null, data);
                };
    
                if(typeof options.customLoad == 'function'){
                    // Use the specified custom callback.
                    options.customLoad(lngs, ns.namespaces, options, loadComplete);
                } else {
                    var url = applyReplacement(options.resGetPath, { lng: lngs.join('+'), ns: ns.namespaces.join('+') });
                    // load all needed stuff once
                    f.ajax({
                        url: url,
                        success: function(data, status, xhr) {
                            f.log('loaded: ' + url);
                            loadComplete(null, data);
                        },
                        error : function(xhr, status, error) {
                            f.log('failed loading: ' + url);
                            loadComplete('failed loading resource.json error: ' + error);
                        },
                        dataType: "json",
                        async : options.getAsync
                    });
                }    
            }
        },
    
        _fetchOne: function(lng, ns, options, done) {
            var url = applyReplacement(options.resGetPath, { lng: lng, ns: ns });
            f.ajax({
                url: url,
                success: function(data, status, xhr) {
                    f.log('loaded: ' + url);
                    done(null, data);
                },
                error : function(xhr, status, error) {
                    if ((status && status == 200) || (xhr && xhr.status && xhr.status == 200)) {
                        // file loaded but invalid json, stop waste time !
                        f.error('There is a typo in: ' + url);
                    } else if ((status && status == 404) || (xhr && xhr.status && xhr.status == 404)) {
                        f.log('Does not exist: ' + url);
                    } else {
                        var theStatus = status ? status : ((xhr && xhr.status) ? xhr.status : null);
                        f.log(theStatus + ' when loading ' + url);
                    }
                    
                    done(error, {});
                },
                dataType: "json",
                async : options.getAsync
            });
        },
    
        postMissing: function(lng, ns, key, defaultValue, lngs) {
            var payload = {};
            payload[key] = defaultValue;
    
            var urls = [];
    
            if (o.sendMissingTo === 'fallback' && o.fallbackLng[0] !== false) {
                for (var i = 0; i < o.fallbackLng.length; i++) {
                    urls.push({lng: o.fallbackLng[i], url: applyReplacement(o.resPostPath, { lng: o.fallbackLng[i], ns: ns })});
                }
            } else if (o.sendMissingTo === 'current' || (o.sendMissingTo === 'fallback' && o.fallbackLng[0] === false) ) {
                urls.push({lng: lng, url: applyReplacement(o.resPostPath, { lng: lng, ns: ns })});
            } else if (o.sendMissingTo === 'all') {
                for (var i = 0, l = lngs.length; i < l; i++) {
                    urls.push({lng: lngs[i], url: applyReplacement(o.resPostPath, { lng: lngs[i], ns: ns })});
                }
            }
    
            for (var y = 0, len = urls.length; y < len; y++) {
                var item = urls[y];
                f.ajax({
                    url: item.url,
                    type: o.sendType,
                    data: payload,
                    success: function(data, status, xhr) {
                        f.log('posted missing key \'' + key + '\' to: ' + item.url);
    
                        // add key to resStore
                        var keys = key.split('.');
                        var x = 0;
                        var value = resStore[item.lng][ns];
                        while (keys[x]) {
                            if (x === keys.length - 1) {
                                value = value[keys[x]] = defaultValue;
                            } else {
                                value = value[keys[x]] = value[keys[x]] || {};
                            }
                            x++;
                        }
                    },
                    error : function(xhr, status, error) {
                        f.log('failed posting missing key \'' + key + '\' to: ' + item.url);
                    },
                    dataType: "json",
                    async : o.postAsync
                });
            }
        },
    
        reload: reload
    };
    // defaults
    var o = {
        lng: undefined,
        load: 'all',
        preload: [],
        lowerCaseLng: false,
        returnObjectTrees: false,
        fallbackLng: ['dev'],
        fallbackNS: [],
        detectLngQS: 'setLng',
        detectLngFromLocalStorage: false,
        ns: 'translation',
        fallbackOnNull: true,
        fallbackOnEmpty: false,
        fallbackToDefaultNS: false,
        nsseparator: ':',
        keyseparator: '.',
        selectorAttr: 'data-i18n',
        debug: false,
        
        resGetPath: 'locales/__lng__/__ns__.json',
        resPostPath: 'locales/add/__lng__/__ns__',
    
        getAsync: true,
        postAsync: true,
    
        resStore: undefined,
        useLocalStorage: false,
        localStorageExpirationTime: 7*24*60*60*1000,
    
        dynamicLoad: false,
        sendMissing: false,
        sendMissingTo: 'fallback', // current | all
        sendType: 'POST',
    
        interpolationPrefix: '__',
        interpolationSuffix: '__',
        defaultVariables: false,
        reusePrefix: '$t(',
        reuseSuffix: ')',
        pluralSuffix: '_plural',
        pluralNotFound: ['plural_not_found', Math.random()].join(''),
        contextNotFound: ['context_not_found', Math.random()].join(''),
        escapeInterpolation: false,
        indefiniteSuffix: '_indefinite',
        indefiniteNotFound: ['indefinite_not_found', Math.random()].join(''),
    
        setJqueryExt: true,
        defaultValueFromContent: true,
        useDataAttrOptions: false,
        cookieExpirationTime: undefined,
        useCookie: true,
        cookieName: 'i18next',
        cookieDomain: undefined,
    
        objectTreeKeyHandler: undefined,
        postProcess: undefined,
        parseMissingKey: undefined,
        missingKeyHandler: sync.postMissing,
    
        shortcutFunction: 'sprintf' // or: defaultValue
    };
    function _extend(target, source) {
        if (!source || typeof source === 'function') {
            return target;
        }
    
        for (var attr in source) { target[attr] = source[attr]; }
        return target;
    }
    
    function _deepExtend(target, source) {
        for (var prop in source)
            if (prop in target)
                _deepExtend(target[prop], source[prop]);
            else
                target[prop] = source[prop];
        return target;
    }
    
    function _each(object, callback, args) {
        var name, i = 0,
            length = object.length,
            isObj = length === undefined || Object.prototype.toString.apply(object) !== '[object Array]' || typeof object === "function";
    
        if (args) {
            if (isObj) {
                for (name in object) {
                    if (callback.apply(object[name], args) === false) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if (callback.apply(object[i++], args) === false) {
                        break;
                    }
                }
            }
    
        // A special, fast, case for the most common use of each
        } else {
            if (isObj) {
                for (name in object) {
                    if (callback.call(object[name], name, object[name]) === false) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if (callback.call(object[i], i, object[i++]) === false) {
                        break;
                    }
                }
            }
        }
    
        return object;
    }
    
    var _entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    
    function _escape(data) {
        if (typeof data === 'string') {
            return data.replace(/[&<>"'\/]/g, function (s) {
                return _entityMap[s];
            });
        }else{
            return data;
        }
    }
    
    function _ajax(options) {
    
        // v0.5.0 of https://github.com/goloroden/http.js
        var getXhr = function (callback) {
            // Use the native XHR object if the browser supports it.
            if (window.XMLHttpRequest) {
                return callback(null, new XMLHttpRequest());
            } else if (window.ActiveXObject) {
                // In Internet Explorer check for ActiveX versions of the XHR object.
                try {
                    return callback(null, new ActiveXObject("Msxml2.XMLHTTP"));
                } catch (e) {
                    return callback(null, new ActiveXObject("Microsoft.XMLHTTP"));
                }
            }
    
            // If no XHR support was found, throw an error.
            return callback(new Error());
        };
    
        var encodeUsingUrlEncoding = function (data) {
            if(typeof data === 'string') {
                return data;
            }
    
            var result = [];
            for(var dataItem in data) {
                if(data.hasOwnProperty(dataItem)) {
                    result.push(encodeURIComponent(dataItem) + '=' + encodeURIComponent(data[dataItem]));
                }
            }
    
            return result.join('&');
        };
    
        var utf8 = function (text) {
            text = text.replace(/\r\n/g, '\n');
            var result = '';
    
            for(var i = 0; i < text.length; i++) {
                var c = text.charCodeAt(i);
    
                if(c < 128) {
                        result += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                        result += String.fromCharCode((c >> 6) | 192);
                        result += String.fromCharCode((c & 63) | 128);
                } else {
                        result += String.fromCharCode((c >> 12) | 224);
                        result += String.fromCharCode(((c >> 6) & 63) | 128);
                        result += String.fromCharCode((c & 63) | 128);
                }
            }
    
            return result;
        };
    
        var base64 = function (text) {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    
            text = utf8(text);
            var result = '',
                    chr1, chr2, chr3,
                    enc1, enc2, enc3, enc4,
                    i = 0;
    
            do {
                chr1 = text.charCodeAt(i++);
                chr2 = text.charCodeAt(i++);
                chr3 = text.charCodeAt(i++);
    
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
    
                if(isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if(isNaN(chr3)) {
                    enc4 = 64;
                }
    
                result +=
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = '';
                enc1 = enc2 = enc3 = enc4 = '';
            } while(i < text.length);
    
            return result;
        };
    
        var mergeHeaders = function () {
            // Use the first header object as base.
            var result = arguments[0];
    
            // Iterate through the remaining header objects and add them.
            for(var i = 1; i < arguments.length; i++) {
                var currentHeaders = arguments[i];
                for(var header in currentHeaders) {
                    if(currentHeaders.hasOwnProperty(header)) {
                        result[header] = currentHeaders[header];
                    }
                }
            }
    
            // Return the merged headers.
            return result;
        };
    
        var ajax = function (method, url, options, callback) {
            // Adjust parameters.
            if(typeof options === 'function') {
                callback = options;
                options = {};
            }
    
            // Set default parameter values.
            options.cache = options.cache || false;
            options.data = options.data || {};
            options.headers = options.headers || {};
            options.jsonp = options.jsonp || false;
            options.async = options.async === undefined ? true : options.async;
    
            // Merge the various header objects.
            var headers = mergeHeaders({
                'accept': '*/*',
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }, ajax.headers, options.headers);
    
            // Encode the data according to the content-type.
            var payload;
            if (headers['content-type'] === 'application/json') {
                payload = JSON.stringify(options.data);
            } else {
                payload = encodeUsingUrlEncoding(options.data);
            }
    
            // Specially prepare GET requests: Setup the query string, handle caching and make a JSONP call
            // if neccessary.
            if(method === 'GET') {
                // Setup the query string.
                var queryString = [];
                if(payload) {
                    queryString.push(payload);
                    payload = null;
                }
    
                // Handle caching.
                if(!options.cache) {
                    queryString.push('_=' + (new Date()).getTime());
                }
    
                // If neccessary prepare the query string for a JSONP call.
                if(options.jsonp) {
                    queryString.push('callback=' + options.jsonp);
                    queryString.push('jsonp=' + options.jsonp);
                }
    
                // Merge the query string and attach it to the url.
                queryString = queryString.join('&');
                if (queryString.length > 1) {
                    if (url.indexOf('?') > -1) {
                        url += '&' + queryString;
                    } else {
                        url += '?' + queryString;
                    }
                }
    
                // Make a JSONP call if neccessary.
                if(options.jsonp) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    head.appendChild(script);
                    return;
                }
            }
    
            // Since we got here, it is no JSONP request, so make a normal XHR request.
            getXhr(function (err, xhr) {
                if(err) return callback(err);
    
                // Open the request.
                xhr.open(method, url, options.async);
    
                // Set the request headers.
                for(var header in headers) {
                    if(headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
    
                // Handle the request events.
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === 4) {
                        var data = xhr.responseText || '';
    
                        // If no callback is given, return.
                        if(!callback) {
                            return;
                        }
    
                        // Return an object that provides access to the data as text and JSON.
                        callback(xhr.status, {
                            text: function () {
                                return data;
                            },
    
                            json: function () {
                                try {
                                    return JSON.parse(data)
                                } catch (e) {
                                    f.error('Can not parse JSON. URL: ' + url);
                                    return {};
                                }
                            }
                        });
                    }
                };
    
                // Actually send the XHR request.
                xhr.send(payload);
            });
        };
    
        // Define the external interface.
        var http = {
            authBasic: function (username, password) {
                ajax.headers['Authorization'] = 'Basic ' + base64(username + ':' + password);
            },
    
            connect: function (url, options, callback) {
                return ajax('CONNECT', url, options, callback);
            },
    
            del: function (url, options, callback) {
                return ajax('DELETE', url, options, callback);
            },
    
            get: function (url, options, callback) {
                return ajax('GET', url, options, callback);
            },
    
            head: function (url, options, callback) {
                return ajax('HEAD', url, options, callback);
            },
    
            headers: function (headers) {
                ajax.headers = headers || {};
            },
    
            isAllowed: function (url, verb, callback) {
                this.options(url, function (status, data) {
                    callback(data.text().indexOf(verb) !== -1);
                });
            },
    
            options: function (url, options, callback) {
                return ajax('OPTIONS', url, options, callback);
            },
    
            patch: function (url, options, callback) {
                return ajax('PATCH', url, options, callback);
            },
    
            post: function (url, options, callback) {
                return ajax('POST', url, options, callback);
            },
    
            put: function (url, options, callback) {
                return ajax('PUT', url, options, callback);
            },
    
            trace: function (url, options, callback) {
                return ajax('TRACE', url, options, callback);
            }
        };
    
    
        var methode = options.type ? options.type.toLowerCase() : 'get';
    
        http[methode](options.url, options, function (status, data) {
            // file: protocol always gives status code 0, so check for data
            if (status === 200 || (status === 0 && data.text())) {
                options.success(data.json(), status, null);
            } else {
                options.error(data.text(), status, null);
            }
        });
    }
    
    var _cookie = {
        create: function(name,value,minutes,domain) {
            var expires;
            if (minutes) {
                var date = new Date();
                date.setTime(date.getTime()+(minutes*60*1000));
                expires = "; expires="+date.toGMTString();
            }
            else expires = "";
            domain = (domain)? "domain="+domain+";" : "";
            document.cookie = name+"="+value+expires+";"+domain+"path=/";
        },
    
        read: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
    
        remove: function(name) {
            this.create(name,"",-1);
        }
    };
    
    var cookie_noop = {
        create: function(name,value,minutes,domain) {},
        read: function(name) { return null; },
        remove: function(name) {}
    };
    
    
    
    // move dependent functions to a container so that
    // they can be overriden easier in no jquery environment (node.js)
    var f = {
        extend: $ ? $.extend : _extend,
        deepExtend: _deepExtend,
        each: $ ? $.each : _each,
        ajax: $ ? $.ajax : (typeof document !== 'undefined' ? _ajax : function() {}),
        cookie: typeof document !== 'undefined' ? _cookie : cookie_noop,
        detectLanguage: detectLanguage,
        escape: _escape,
        log: function(str) {
            if (o.debug && typeof console !== "undefined") console.log(str);
        },
        error: function(str) {
            if (typeof console !== "undefined") console.error(str);
        },
        getCountyIndexOfLng: function(lng) {
            var lng_index = 0;
            if (lng === 'nb-NO' || lng === 'nn-NO' || lng === 'nb-no' || lng === 'nn-no') lng_index = 1;
            return lng_index;
        },
        toLanguages: function(lng) {
            var log = this.log;
    
            function applyCase(l) {
                var ret = l;
    
                if (typeof l === 'string' && l.indexOf('-') > -1) {
                    var parts = l.split('-');
    
                    ret = o.lowerCaseLng ?
                        parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                        parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();
                } else {
                    ret = o.lowerCaseLng ? l.toLowerCase() : l;
                }
    
                return ret;
            }
    
            var languages = [];
            var whitelist = o.lngWhitelist || false;
            var addLanguage = function(language){
              //reject langs not whitelisted
              if(!whitelist || whitelist.indexOf(language) > -1){
                languages.push(language);
              }else{
                log('rejecting non-whitelisted language: ' + language);
              }
            };
            if (typeof lng === 'string' && lng.indexOf('-') > -1) {
                var parts = lng.split('-');
    
                if (o.load !== 'unspecific') addLanguage(applyCase(lng));
                if (o.load !== 'current') addLanguage(applyCase(parts[this.getCountyIndexOfLng(lng)]));
            } else {
                addLanguage(applyCase(lng));
            }
    
            for (var i = 0; i < o.fallbackLng.length; i++) {
                if (languages.indexOf(o.fallbackLng[i]) === -1 && o.fallbackLng[i]) languages.push(applyCase(o.fallbackLng[i]));
            }
            return languages;
        },
        regexEscape: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        regexReplacementEscape: function(strOrFn) {
            if (typeof strOrFn === 'string') {
                return strOrFn.replace(/\$/g, "$$$$");
            } else {
                return strOrFn;
            }
        },
        localStorage: {
            setItem: function(key, value) {
                if (window.localStorage) {
                    try {
                        window.localStorage.setItem(key, value);
                    } catch (e) {
                        f.log('failed to set value for key "' + key + '" to localStorage.');
                    }
                }
            },
            getItem: function(key, value) {
                if (window.localStorage) {
                    try {
                        return window.localStorage.getItem(key, value);
                    } catch (e) {
                        f.log('failed to get value for key "' + key + '" from localStorage.');
                        return undefined;
                    }
                }
            }
        }
    };
    function init(options, cb) {
        
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = options || {};
        
        // override defaults with passed in options
        f.extend(o, options);
        delete o.fixLng; /* passed in each time */
    
        // override functions: .log(), .detectLanguage(), etc
        if (o.functions) {
            delete o.functions;
            f.extend(f, options.functions);
        }
    
        // create namespace object if namespace is passed in as string
        if (typeof o.ns == 'string') {
            o.ns = { namespaces: [o.ns], defaultNs: o.ns};
        }
    
        // fallback namespaces
        if (typeof o.fallbackNS == 'string') {
            o.fallbackNS = [o.fallbackNS];
        }
    
        // fallback languages
        if (typeof o.fallbackLng == 'string' || typeof o.fallbackLng == 'boolean') {
            o.fallbackLng = [o.fallbackLng];
        }
    
        // escape prefix/suffix
        o.interpolationPrefixEscaped = f.regexEscape(o.interpolationPrefix);
        o.interpolationSuffixEscaped = f.regexEscape(o.interpolationSuffix);
    
        if (!o.lng) o.lng = f.detectLanguage();
    
        languages = f.toLanguages(o.lng);
        currentLng = languages[0];
        f.log('currentLng set to: ' + currentLng);
    
        if (o.useCookie && f.cookie.read(o.cookieName) !== currentLng){ //cookie is unset or invalid
            f.cookie.create(o.cookieName, currentLng, o.cookieExpirationTime, o.cookieDomain);
        }
        if (o.detectLngFromLocalStorage && typeof document !== 'undefined' && window.localStorage) {
            f.localStorage.setItem('i18next_lng', currentLng);
        }
    
        var lngTranslate = translate;
        if (options.fixLng) {
            lngTranslate = function(key, options) {
                options = options || {};
                options.lng = options.lng || lngTranslate.lng;
                return translate(key, options);
            };
            lngTranslate.lng = currentLng;
        }
    
        pluralExtensions.setCurrentLng(currentLng);
    
        // add JQuery extensions
        if ($ && o.setJqueryExt) addJqueryFunct();
    
        // jQuery deferred
        var deferred;
        if ($ && $.Deferred) {
            deferred = $.Deferred();
        }
    
        // return immidiatly if res are passed in
        if (o.resStore) {
            resStore = o.resStore;
            initialized = true;
            if (cb) cb(lngTranslate);
            if (deferred) deferred.resolve(lngTranslate);
            if (deferred) return deferred.promise();
            return;
        }
    
        // languages to load
        var lngsToLoad = f.toLanguages(o.lng);
        if (typeof o.preload === 'string') o.preload = [o.preload];
        for (var i = 0, l = o.preload.length; i < l; i++) {
            var pres = f.toLanguages(o.preload[i]);
            for (var y = 0, len = pres.length; y < len; y++) {
                if (lngsToLoad.indexOf(pres[y]) < 0) {
                    lngsToLoad.push(pres[y]);
                }
            }
        }
    
        // else load them
        i18n.sync.load(lngsToLoad, o, function(err, store) {
            resStore = store;
            initialized = true;
    
            if (cb) cb(lngTranslate);
            if (deferred) deferred.resolve(lngTranslate);
        });
    
        if (deferred) return deferred.promise();
    }
    function preload(lngs, cb) {
        if (typeof lngs === 'string') lngs = [lngs];
        for (var i = 0, l = lngs.length; i < l; i++) {
            if (o.preload.indexOf(lngs[i]) < 0) {
                o.preload.push(lngs[i]);
            }
        }
        return init(cb);
    }
    
    function addResourceBundle(lng, ns, resources, deep) {
        if (typeof ns !== 'string') {
            resources = ns;
            ns = o.ns.defaultNs;
        } else if (o.ns.namespaces.indexOf(ns) < 0) {
            o.ns.namespaces.push(ns);
        }
    
        resStore[lng] = resStore[lng] || {};
        resStore[lng][ns] = resStore[lng][ns] || {};
    
        if (deep) {
            f.deepExtend(resStore[lng][ns], resources);
        } else {
            f.extend(resStore[lng][ns], resources);
        }
        if (o.useLocalStorage) {
            sync._storeLocal(resStore);
        }
    }
    
    function hasResourceBundle(lng, ns) {
        if (typeof ns !== 'string') {
            ns = o.ns.defaultNs;
        }
    
        resStore[lng] = resStore[lng] || {};
        var res = resStore[lng][ns] || {};
    
        var hasValues = false;
        for(var prop in res) {
            if (res.hasOwnProperty(prop)) {
                hasValues = true;
            }
        }
    
        return hasValues;
    }
    
    function getResourceBundle(lng, ns) {
        if (typeof ns !== 'string') {
            ns = o.ns.defaultNs;
        }
    
        resStore[lng] = resStore[lng] || {};
        return f.extend({}, resStore[lng][ns]);
    }
    
    function removeResourceBundle(lng, ns) {
        if (typeof ns !== 'string') {
            ns = o.ns.defaultNs;
        }
    
        resStore[lng] = resStore[lng] || {};
        resStore[lng][ns] = {};
        if (o.useLocalStorage) {
            sync._storeLocal(resStore);
        }
    }
    
    function addResource(lng, ns, key, value) {
        if (typeof ns !== 'string') {
            resource = ns;
            ns = o.ns.defaultNs;
        } else if (o.ns.namespaces.indexOf(ns) < 0) {
            o.ns.namespaces.push(ns);
        }
    
        resStore[lng] = resStore[lng] || {};
        resStore[lng][ns] = resStore[lng][ns] || {};
    
        var keys = key.split(o.keyseparator);
        var x = 0;
        var node = resStore[lng][ns];
        var origRef = node;
    
        while (keys[x]) {
            if (x == keys.length - 1)
                node[keys[x]] = value;
            else {
                if (node[keys[x]] == null)
                    node[keys[x]] = {};
    
                node = node[keys[x]];
            }
            x++;
        }
        if (o.useLocalStorage) {
            sync._storeLocal(resStore);
        }
    }
    
    function addResources(lng, ns, resources) {
        if (typeof ns !== 'string') {
            resource = ns;
            ns = o.ns.defaultNs;
        } else if (o.ns.namespaces.indexOf(ns) < 0) {
            o.ns.namespaces.push(ns);
        }
    
        for (var m in resources) {
            if (typeof resources[m] === 'string') addResource(lng, ns, m, resources[m]);
        }
    }
    
    function setDefaultNamespace(ns) {
        o.ns.defaultNs = ns;
    }
    
    function loadNamespace(namespace, cb) {
        loadNamespaces([namespace], cb);
    }
    
    function loadNamespaces(namespaces, cb) {
        var opts = {
            dynamicLoad: o.dynamicLoad,
            resGetPath: o.resGetPath,
            getAsync: o.getAsync,
            customLoad: o.customLoad,
            ns: { namespaces: namespaces, defaultNs: ''} /* new namespaces to load */
        };
    
        // languages to load
        var lngsToLoad = f.toLanguages(o.lng);
        if (typeof o.preload === 'string') o.preload = [o.preload];
        for (var i = 0, l = o.preload.length; i < l; i++) {
            var pres = f.toLanguages(o.preload[i]);
            for (var y = 0, len = pres.length; y < len; y++) {
                if (lngsToLoad.indexOf(pres[y]) < 0) {
                    lngsToLoad.push(pres[y]);
                }
            }
        }
    
        // check if we have to load
        var lngNeedLoad = [];
        for (var a = 0, lenA = lngsToLoad.length; a < lenA; a++) {
            var needLoad = false;
            var resSet = resStore[lngsToLoad[a]];
            if (resSet) {
                for (var b = 0, lenB = namespaces.length; b < lenB; b++) {
                    if (!resSet[namespaces[b]]) needLoad = true;
                }
            } else {
                needLoad = true;
            }
    
            if (needLoad) lngNeedLoad.push(lngsToLoad[a]);
        }
    
        if (lngNeedLoad.length) {
            i18n.sync._fetch(lngNeedLoad, opts, function(err, store) {
                var todo = namespaces.length * lngNeedLoad.length;
    
                // load each file individual
                f.each(namespaces, function(nsIndex, nsValue) {
    
                    // append namespace to namespace array
                    if (o.ns.namespaces.indexOf(nsValue) < 0) {
                        o.ns.namespaces.push(nsValue);
                    }
    
                    f.each(lngNeedLoad, function(lngIndex, lngValue) {
                        resStore[lngValue] = resStore[lngValue] || {};
                        resStore[lngValue][nsValue] = store[lngValue][nsValue];
    
                        todo--; // wait for all done befor callback
                        if (todo === 0 && cb) {
                            if (o.useLocalStorage) i18n.sync._storeLocal(resStore);
                            cb();
                        }
                    });
                });
            });
        } else {
            if (cb) cb();
        }
    }
    
    function setLng(lng, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        } else if (!options) {
            options = {};
        }
    
        options.lng = lng;
        return init(options, cb);
    }
    
    function lng() {
        return currentLng;
    }
    
    function reload(cb) {
        resStore = {};
        setLng(currentLng, cb);
    }
    function addJqueryFunct() {
        // $.t shortcut
        $.t = $.t || translate;
    
        function parse(ele, key, options) {
            if (key.length === 0) return;
    
            var attr = 'text';
    
            if (key.indexOf('[') === 0) {
                var parts = key.split(']');
                key = parts[1];
                attr = parts[0].substr(1, parts[0].length-1);
            }
    
            if (key.indexOf(';') === key.length-1) {
                key = key.substr(0, key.length-2);
            }
    
            var optionsToUse;
            if (attr === 'html') {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.html($.t(key, optionsToUse));
            } else if (attr === 'text') {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.text() }, options) : options;
                ele.text($.t(key, optionsToUse));
            } else if (attr === 'prepend') {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.prepend($.t(key, optionsToUse));
            } else if (attr === 'append') {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.append($.t(key, optionsToUse));
            } else if (attr.indexOf("data-") === 0) {
                var dataAttr = attr.substr(("data-").length);
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.data(dataAttr) }, options) : options;
                var translated = $.t(key, optionsToUse);
                //we change into the data cache
                ele.data(dataAttr, translated);
                //we change into the dom
                ele.attr(attr, translated);
            } else {
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.attr(attr) }, options) : options;
                ele.attr(attr, $.t(key, optionsToUse));
            }
        }
    
        function localize(ele, options) {
            var key = ele.attr(o.selectorAttr);
            if (!key && typeof key !== 'undefined' && key !== false) key = ele.text() || ele.val();
            if (!key) return;
    
            var target = ele
              , targetSelector = ele.data("i18n-target");
            if (targetSelector) {
                target = ele.find(targetSelector) || ele;
            }
    
            if (!options && o.useDataAttrOptions === true) {
                options = ele.data("i18n-options");
            }
            options = options || {};
    
            if (key.indexOf(';') >= 0) {
                var keys = key.split(';');
    
                $.each(keys, function(m, k) {
                    if (k !== '') parse(target, k, options);
                });
    
            } else {
                parse(target, key, options);
            }
    
            if (o.useDataAttrOptions === true) ele.data("i18n-options", options);
        }
    
        // fn
        $.fn.i18n = function (options) {
            return this.each(function() {
                // localize element itself
                localize($(this), options);
    
                // localize childs
                var elements =  $(this).find('[' + o.selectorAttr + ']');
                elements.each(function() { 
                    localize($(this), options);
                });
            });
        };
    }
    function applyReplacement(str, replacementHash, nestedKey, options) {
        if (!str) return str;
    
        options = options || replacementHash; // first call uses replacement hash combined with options
        if (str.indexOf(options.interpolationPrefix || o.interpolationPrefix) < 0) return str;
    
        var prefix = options.interpolationPrefix ? f.regexEscape(options.interpolationPrefix) : o.interpolationPrefixEscaped
          , suffix = options.interpolationSuffix ? f.regexEscape(options.interpolationSuffix) : o.interpolationSuffixEscaped
          , unEscapingSuffix = 'HTML'+suffix;
    
        var hash = replacementHash.replace && typeof replacementHash.replace === 'object' ? replacementHash.replace : replacementHash;
        f.each(hash, function(key, value) {
            var nextKey = nestedKey ? nestedKey + o.keyseparator + key : key;
            if (typeof value === 'object' && value !== null) {
                str = applyReplacement(str, value, nextKey, options);
            } else {
                if (options.escapeInterpolation || o.escapeInterpolation) {
                    str = str.replace(new RegExp([prefix, nextKey, unEscapingSuffix].join(''), 'g'), f.regexReplacementEscape(value));
                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), f.regexReplacementEscape(f.escape(value)));
                } else {
                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), f.regexReplacementEscape(value));
                }
                // str = options.escapeInterpolation;
            }
        });
        return str;
    }
    
    // append it to functions
    f.applyReplacement = applyReplacement;
    
    function applyReuse(translated, options) {
        var comma = ',';
        var options_open = '{';
        var options_close = '}';
    
        var opts = f.extend({}, options);
        delete opts.postProcess;
    
        while (translated.indexOf(o.reusePrefix) != -1) {
            replacementCounter++;
            if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
            var index_of_opening = translated.lastIndexOf(o.reusePrefix);
            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
            var token = translated.substring(index_of_opening, index_of_end_of_closing);
            var token_without_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');
    
            if (index_of_end_of_closing <= index_of_opening) {
                f.error('there is an missing closing in following translation value', translated);
                return '';
            }
    
            if (token_without_symbols.indexOf(comma) != -1) {
                var index_of_token_end_of_closing = token_without_symbols.indexOf(comma);
                if (token_without_symbols.indexOf(options_open, index_of_token_end_of_closing) != -1 && token_without_symbols.indexOf(options_close, index_of_token_end_of_closing) != -1) {
                    var index_of_opts_opening = token_without_symbols.indexOf(options_open, index_of_token_end_of_closing);
                    var index_of_opts_end_of_closing = token_without_symbols.indexOf(options_close, index_of_opts_opening) + options_close.length;
                    try {
                        opts = f.extend(opts, JSON.parse(token_without_symbols.substring(index_of_opts_opening, index_of_opts_end_of_closing)));
                        token_without_symbols = token_without_symbols.substring(0, index_of_token_end_of_closing);
                    } catch (e) {
                    }
                }
            }
    
            var translated_token = _translate(token_without_symbols, opts);
            translated = translated.replace(token, f.regexReplacementEscape(translated_token));
        }
        return translated;
    }
    
    function hasContext(options) {
        return (options.context && (typeof options.context == 'string' || typeof options.context == 'number'));
    }
    
    function needsPlural(options, lng) {
        return (options.count !== undefined && typeof options.count != 'string'/* && pluralExtensions.needsPlural(lng, options.count)*/);
    }
    
    function needsIndefiniteArticle(options) {
        return (options.indefinite_article !== undefined && typeof options.indefinite_article != 'string' && options.indefinite_article);
    }
    
    function exists(key, options) {
        options = options || {};
    
        var notFound = _getDefaultValue(key, options)
            , found = _find(key, options);
    
        return found !== undefined || found === notFound;
    }
    
    function translate(key, options) {
        options = options || {};
    
        if (!initialized) {
            f.log('i18next not finished initialization. you might have called t function before loading resources finished.')
            return options.defaultValue || '';
        };
        replacementCounter = 0;
        return _translate.apply(null, arguments);
    }
    
    function _getDefaultValue(key, options) {
        return (options.defaultValue !== undefined) ? options.defaultValue : key;
    }
    
    function _injectSprintfProcessor() {
    
        var values = [];
    
        // mh: build array from second argument onwards
        for (var i = 1; i < arguments.length; i++) {
            values.push(arguments[i]);
        }
    
        return {
            postProcess: 'sprintf',
            sprintf:     values
        };
    }
    
    function _translate(potentialKeys, options) {
        if (options && typeof options !== 'object') {
            if (o.shortcutFunction === 'sprintf') {
                // mh: gettext like sprintf syntax found, automatically create sprintf processor
                options = _injectSprintfProcessor.apply(null, arguments);
            } else if (o.shortcutFunction === 'defaultValue') {
                options = {
                    defaultValue: options
                }
            }
        } else {
            options = options || {};
        }
    
        if (typeof o.defaultVariables === 'object') {
            options = f.extend({}, o.defaultVariables, options);
        }
    
        if (potentialKeys === undefined || potentialKeys === null || potentialKeys === '') return '';
    
        if (typeof potentialKeys === 'number') {
            potentialKeys = String(potentialKeys);
        }
    
        if (typeof potentialKeys === 'string') {
            potentialKeys = [potentialKeys];
        }
    
        var key = potentialKeys[0];
    
        if (potentialKeys.length > 1) {
            for (var i = 0; i < potentialKeys.length; i++) {
                key = potentialKeys[i];
                if (exists(key, options)) {
                    break;
                }
            }
        }
    
        var notFound = _getDefaultValue(key, options)
            , found = _find(key, options)
            , lngs = options.lng ? f.toLanguages(options.lng, options.fallbackLng) : languages
            , ns = options.ns || o.ns.defaultNs
            , parts;
    
        // split ns and key
        if (key.indexOf(o.nsseparator) > -1) {
            parts = key.split(o.nsseparator);
            ns = parts[0];
            key = parts[1];
        }
    
        if (found === undefined && o.sendMissing && typeof o.missingKeyHandler === 'function') {
            if (options.lng) {
                o.missingKeyHandler(lngs[0], ns, key, notFound, lngs);
            } else {
                o.missingKeyHandler(o.lng, ns, key, notFound, lngs);
            }
        }
    
        var postProcessorsToApply;
        if (typeof o.postProcess === 'string' && o.postProcess !== '') {
            postProcessorsToApply = [o.postProcess];
        } else if (typeof o.postProcess === 'array' || typeof o.postProcess === 'object') {
            postProcessorsToApply = o.postProcess;
        } else {
            postProcessorsToApply = [];
        }
    
        if (typeof options.postProcess === 'string' && options.postProcess !== '') {
            postProcessorsToApply = postProcessorsToApply.concat([options.postProcess]);
        } else if (typeof options.postProcess === 'array' || typeof options.postProcess === 'object') {
            postProcessorsToApply = postProcessorsToApply.concat(options.postProcess);
        }
    
        if (found !== undefined && postProcessorsToApply.length) {
            postProcessorsToApply.forEach(function(postProcessor) {
                if (postProcessors[postProcessor]) {
                    found = postProcessors[postProcessor](found, key, options);
                }
            });
        }
    
        // process notFound if function exists
        var splitNotFound = notFound;
        if (notFound.indexOf(o.nsseparator) > -1) {
            parts = notFound.split(o.nsseparator);
            splitNotFound = parts[1];
        }
        if (splitNotFound === key && o.parseMissingKey) {
            notFound = o.parseMissingKey(notFound);
        }
    
        if (found === undefined) {
            notFound = applyReplacement(notFound, options);
            notFound = applyReuse(notFound, options);
    
            if (postProcessorsToApply.length) {
                var val = _getDefaultValue(key, options);
                postProcessorsToApply.forEach(function(postProcessor) {
                    if (postProcessors[postProcessor]) {
                        found = postProcessors[postProcessor](val, key, options);
                    }
                });
            }
        }
    
        return (found !== undefined) ? found : notFound;
    }
    
    function _find(key, options) {
        options = options || {};
    
        var optionWithoutCount, translated
            , notFound = _getDefaultValue(key, options)
            , lngs = languages;
    
        if (!resStore) { return notFound; } // no resStore to translate from
    
        // CI mode
        if (lngs[0].toLowerCase() === 'cimode') return notFound;
    
        // passed in lng
        if (options.lngs) lngs = options.lngs;
        if (options.lng) {
            lngs = f.toLanguages(options.lng, options.fallbackLng);
    
            if (!resStore[lngs[0]]) {
                var oldAsync = o.getAsync;
                o.getAsync = false;
    
                i18n.sync.load(lngs, o, function(err, store) {
                    f.extend(resStore, store);
                    o.getAsync = oldAsync;
                });
            }
        }
    
        var ns = options.ns || o.ns.defaultNs;
        if (key.indexOf(o.nsseparator) > -1) {
            var parts = key.split(o.nsseparator);
            ns = parts[0];
            key = parts[1];
        }
    
        if (hasContext(options)) {
            optionWithoutCount = f.extend({}, options);
            delete optionWithoutCount.context;
            optionWithoutCount.defaultValue = o.contextNotFound;
    
            var contextKey = ns + o.nsseparator + key + '_' + options.context;
    
            translated = translate(contextKey, optionWithoutCount);
            if (translated != o.contextNotFound) {
                return applyReplacement(translated, { context: options.context }); // apply replacement for context only
            } // else continue translation with original/nonContext key
        }
    
        if (needsPlural(options, lngs[0])) {
            optionWithoutCount = f.extend({ lngs: [lngs[0]]}, options);
            delete optionWithoutCount.count;
            optionWithoutCount._origLng = optionWithoutCount._origLng || optionWithoutCount.lng || lngs[0];
            delete optionWithoutCount.lng;
            optionWithoutCount.defaultValue = o.pluralNotFound;
    
            var pluralKey;
            if (!pluralExtensions.needsPlural(lngs[0], options.count)) {
                pluralKey = ns + o.nsseparator + key;
            } else {
                pluralKey = ns + o.nsseparator + key + o.pluralSuffix;
                var pluralExtension = pluralExtensions.get(lngs[0], options.count);
                if (pluralExtension >= 0) {
                    pluralKey = pluralKey + '_' + pluralExtension;
                } else if (pluralExtension === 1) {
                    pluralKey = ns + o.nsseparator + key; // singular
                }
            }
    
            translated = translate(pluralKey, optionWithoutCount);
    
            if (translated != o.pluralNotFound) {
                return applyReplacement(translated, {
                    count: options.count,
                    interpolationPrefix: options.interpolationPrefix,
                    interpolationSuffix: options.interpolationSuffix
                }); // apply replacement for count only
            } else if (lngs.length > 1) {
                // remove failed lng
                var clone = lngs.slice();
                clone.shift();
                options = f.extend(options, { lngs: clone });
                options._origLng = optionWithoutCount._origLng;
                delete options.lng;
                // retry with fallbacks
                translated = translate(ns + o.nsseparator + key, options);
                if (translated != o.pluralNotFound) return translated;
            } else {
                optionWithoutCount.lng = optionWithoutCount._origLng;
                delete optionWithoutCount._origLng;
                translated = translate(ns + o.nsseparator + key, optionWithoutCount);
                
                return applyReplacement(translated, {
                    count: options.count,
                    interpolationPrefix: options.interpolationPrefix,
                    interpolationSuffix: options.interpolationSuffix
                });
            }
        }
    
        if (needsIndefiniteArticle(options)) {
            var optionsWithoutIndef = f.extend({}, options);
            delete optionsWithoutIndef.indefinite_article;
            optionsWithoutIndef.defaultValue = o.indefiniteNotFound;
            // If we don't have a count, we want the indefinite, if we do have a count, and needsPlural is false
            var indefiniteKey = ns + o.nsseparator + key + (((options.count && !needsPlural(options, lngs[0])) || !options.count) ? o.indefiniteSuffix : "");
            translated = translate(indefiniteKey, optionsWithoutIndef);
            if (translated != o.indefiniteNotFound) {
                return translated;
            }
        }
    
        var found;
        var keys = key.split(o.keyseparator);
        for (var i = 0, len = lngs.length; i < len; i++ ) {
            if (found !== undefined) break;
    
            var l = lngs[i];
    
            var x = 0;
            var value = resStore[l] && resStore[l][ns];
            while (keys[x]) {
                value = value && value[keys[x]];
                x++;
            }
            if (value !== undefined) {
                var valueType = Object.prototype.toString.apply(value);
                if (typeof value === 'string') {
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                } else if (valueType === '[object Array]' && !o.returnObjectTrees && !options.returnObjectTrees) {
                    value = value.join('\n');
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                } else if (value === null && o.fallbackOnNull === true) {
                    value = undefined;
                } else if (value !== null) {
                    if (!o.returnObjectTrees && !options.returnObjectTrees) {
                        if (o.objectTreeKeyHandler && typeof o.objectTreeKeyHandler == 'function') {
                            value = o.objectTreeKeyHandler(key, value, l, ns, options);
                        } else {
                            value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' +
                                'returned an object instead of string.';
                            f.log(value);
                        }
                    } else if (valueType !== '[object Number]' && valueType !== '[object Function]' && valueType !== '[object RegExp]') {
                        var copy = (valueType === '[object Array]') ? [] : {}; // apply child translation on a copy
                        f.each(value, function(m) {
                            copy[m] = _translate(ns + o.nsseparator + key + o.keyseparator + m, options);
                        });
                        value = copy;
                    }
                }
    
                if (typeof value === 'string' && value.trim() === '' && o.fallbackOnEmpty === true)
                    value = undefined;
    
                found = value;
            }
        }
    
        if (found === undefined && !options.isFallbackLookup && (o.fallbackToDefaultNS === true || (o.fallbackNS && o.fallbackNS.length > 0))) {
            // set flag for fallback lookup - avoid recursion
            options.isFallbackLookup = true;
    
            if (o.fallbackNS.length) {
    
                for (var y = 0, lenY = o.fallbackNS.length; y < lenY; y++) {
                    found = _find(o.fallbackNS[y] + o.nsseparator + key, options);
    
                    if (found || (found==="" && o.fallbackOnEmpty === false)) {
                        /* compare value without namespace */
                        var foundValue = found.indexOf(o.nsseparator) > -1 ? found.split(o.nsseparator)[1] : found
                          , notFoundValue = notFound.indexOf(o.nsseparator) > -1 ? notFound.split(o.nsseparator)[1] : notFound;
    
                        if (foundValue !== notFoundValue) break;
                    }
                }
            } else {
                found = _find(key, options); // fallback to default NS
            }
            options.isFallbackLookup = false;
        }
    
        return found;
    }
    function detectLanguage() {
        var detectedLng;
        var whitelist = o.lngWhitelist || [];
        var userLngChoices = [];
    
        // get from qs
        var qsParm = [];
        if (typeof window !== 'undefined') {
            (function() {
                var query = window.location.search.substring(1);
                var params = query.split('&');
                for (var i=0; i<params.length; i++) {
                    var pos = params[i].indexOf('=');
                    if (pos > 0) {
                        var key = params[i].substring(0,pos);
                        if (key == o.detectLngQS) {
                            userLngChoices.push(params[i].substring(pos+1));
                        }
                    }
                }
            })();
        }
    
        // get from cookie
        if (o.useCookie && typeof document !== 'undefined') {
            var c = f.cookie.read(o.cookieName);
            if (c) userLngChoices.push(c);
        }
    
        // get from localStorage
        if (o.detectLngFromLocalStorage && typeof window !== 'undefined' && window.localStorage) {
            userLngChoices.push(f.localStorage.getItem('i18next_lng'));
        }
    
        // get from navigator
        if (typeof navigator !== 'undefined') {
            if (navigator.languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
                for (var i=0;i<navigator.languages.length;i++) {
                    userLngChoices.push(navigator.languages[i]);
                }
            }
            if (navigator.userLanguage) {
                userLngChoices.push(navigator.userLanguage);
            }
            if (navigator.language) {
                userLngChoices.push(navigator.language);
            }
        }
    
        (function() {
            for (var i=0;i<userLngChoices.length;i++) {
                var lng = userLngChoices[i];
    
                if (lng.indexOf('-') > -1) {
                    var parts = lng.split('-');
                    lng = o.lowerCaseLng ?
                        parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                        parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();
                }
    
                if (whitelist.length === 0 || whitelist.indexOf(lng) > -1) {
                    detectedLng = lng;
                    break;
                }
            }
        })();
    
        //fallback
        if (!detectedLng){
          detectedLng = o.fallbackLng[0];
        }
        
        return detectedLng;
    }
    // definition http://translate.sourceforge.net/wiki/l10n/pluralforms
    
    /* [code, name, numbers, pluralsType] */
    var _rules = [
        ["ach", "Acholi", [1,2], 1],
        ["af", "Afrikaans",[1,2], 2],
        ["ak", "Akan", [1,2], 1],
        ["am", "Amharic", [1,2], 1],
        ["an", "Aragonese",[1,2], 2],
        ["ar", "Arabic", [0,1,2,3,11,100],5],
        ["arn", "Mapudungun",[1,2], 1],
        ["ast", "Asturian", [1,2], 2],
        ["ay", "Aymará", [1], 3],
        ["az", "Azerbaijani",[1,2],2],
        ["be", "Belarusian",[1,2,5],4],
        ["bg", "Bulgarian",[1,2], 2],
        ["bn", "Bengali", [1,2], 2],
        ["bo", "Tibetan", [1], 3],
        ["br", "Breton", [1,2], 1],
        ["bs", "Bosnian", [1,2,5],4],
        ["ca", "Catalan", [1,2], 2],
        ["cgg", "Chiga", [1], 3],
        ["cs", "Czech", [1,2,5],6],
        ["csb", "Kashubian",[1,2,5],7],
        ["cy", "Welsh", [1,2,3,8],8],
        ["da", "Danish", [1,2], 2],
        ["de", "German", [1,2], 2],
        ["dev", "Development Fallback", [1,2], 2],
        ["dz", "Dzongkha", [1], 3],
        ["el", "Greek", [1,2], 2],
        ["en", "English", [1,2], 2],
        ["eo", "Esperanto",[1,2], 2],
        ["es", "Spanish", [1,2], 2],
        ["es_ar","Argentinean Spanish", [1,2], 2],
        ["et", "Estonian", [1,2], 2],
        ["eu", "Basque", [1,2], 2],
        ["fa", "Persian", [1], 3],
        ["fi", "Finnish", [1,2], 2],
        ["fil", "Filipino", [1,2], 1],
        ["fo", "Faroese", [1,2], 2],
        ["fr", "French", [1,2], 9],
        ["fur", "Friulian", [1,2], 2],
        ["fy", "Frisian", [1,2], 2],
        ["ga", "Irish", [1,2,3,7,11],10],
        ["gd", "Scottish Gaelic",[1,2,3,20],11],
        ["gl", "Galician", [1,2], 2],
        ["gu", "Gujarati", [1,2], 2],
        ["gun", "Gun", [1,2], 1],
        ["ha", "Hausa", [1,2], 2],
        ["he", "Hebrew", [1,2], 2],
        ["hi", "Hindi", [1,2], 2],
        ["hr", "Croatian", [1,2,5],4],
        ["hu", "Hungarian",[1,2], 2],
        ["hy", "Armenian", [1,2], 2],
        ["ia", "Interlingua",[1,2],2],
        ["id", "Indonesian",[1], 3],
        ["is", "Icelandic",[1,2], 12],
        ["it", "Italian", [1,2], 2],
        ["ja", "Japanese", [1], 3],
        ["jbo", "Lojban", [1], 3],
        ["jv", "Javanese", [0,1], 13],
        ["ka", "Georgian", [1], 3],
        ["kk", "Kazakh", [1], 3],
        ["km", "Khmer", [1], 3],
        ["kn", "Kannada", [1,2], 2],
        ["ko", "Korean", [1], 3],
        ["ku", "Kurdish", [1,2], 2],
        ["kw", "Cornish", [1,2,3,4],14],
        ["ky", "Kyrgyz", [1], 3],
        ["lb", "Letzeburgesch",[1,2],2],
        ["ln", "Lingala", [1,2], 1],
        ["lo", "Lao", [1], 3],
        ["lt", "Lithuanian",[1,2,10],15],
        ["lv", "Latvian", [1,2,0],16],
        ["mai", "Maithili", [1,2], 2],
        ["mfe", "Mauritian Creole",[1,2],1],
        ["mg", "Malagasy", [1,2], 1],
        ["mi", "Maori", [1,2], 1],
        ["mk", "Macedonian",[1,2],17],
        ["ml", "Malayalam",[1,2], 2],
        ["mn", "Mongolian",[1,2], 2],
        ["mnk", "Mandinka", [0,1,2],18],
        ["mr", "Marathi", [1,2], 2],
        ["ms", "Malay", [1], 3],
        ["mt", "Maltese", [1,2,11,20],19],
        ["nah", "Nahuatl", [1,2], 2],
        ["nap", "Neapolitan",[1,2], 2],
        ["nb", "Norwegian Bokmal",[1,2],2],
        ["ne", "Nepali", [1,2], 2],
        ["nl", "Dutch", [1,2], 2],
        ["nn", "Norwegian Nynorsk",[1,2],2],
        ["no", "Norwegian",[1,2], 2],
        ["nso", "Northern Sotho",[1,2],2],
        ["oc", "Occitan", [1,2], 1],
        ["or", "Oriya", [2,1], 2],
        ["pa", "Punjabi", [1,2], 2],
        ["pap", "Papiamento",[1,2], 2],
        ["pl", "Polish", [1,2,5],7],
        ["pms", "Piemontese",[1,2], 2],
        ["ps", "Pashto", [1,2], 2],
        ["pt", "Portuguese",[1,2], 2],
        ["pt_br","Brazilian Portuguese",[1,2], 2],
        ["rm", "Romansh", [1,2], 2],
        ["ro", "Romanian", [1,2,20],20],
        ["ru", "Russian", [1,2,5],4],
        ["sah", "Yakut", [1], 3],
        ["sco", "Scots", [1,2], 2],
        ["se", "Northern Sami",[1,2], 2],
        ["si", "Sinhala", [1,2], 2],
        ["sk", "Slovak", [1,2,5],6],
        ["sl", "Slovenian",[5,1,2,3],21],
        ["so", "Somali", [1,2], 2],
        ["son", "Songhay", [1,2], 2],
        ["sq", "Albanian", [1,2], 2],
        ["sr", "Serbian", [1,2,5],4],
        ["su", "Sundanese",[1], 3],
        ["sv", "Swedish", [1,2], 2],
        ["sw", "Swahili", [1,2], 2],
        ["ta", "Tamil", [1,2], 2],
        ["te", "Telugu", [1,2], 2],
        ["tg", "Tajik", [1,2], 1],
        ["th", "Thai", [1], 3],
        ["ti", "Tigrinya", [1,2], 1],
        ["tk", "Turkmen", [1,2], 2],
        ["tr", "Turkish", [1,2], 1],
        ["tt", "Tatar", [1], 3],
        ["ug", "Uyghur", [1], 3],
        ["uk", "Ukrainian",[1,2,5],4],
        ["ur", "Urdu", [1,2], 2],
        ["uz", "Uzbek", [1,2], 1],
        ["vi", "Vietnamese",[1], 3],
        ["wa", "Walloon", [1,2], 1],
        ["wo", "Wolof", [1], 3],
        ["yo", "Yoruba", [1,2], 2],
        ["zh", "Chinese", [1], 3]
    ];
    
    var _rulesPluralsTypes = {
        1: function(n) {return Number(n > 1);},
        2: function(n) {return Number(n != 1);},
        3: function(n) {return 0;},
        4: function(n) {return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);},
        5: function(n) {return Number(n===0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5);},
        6: function(n) {return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2);},
        7: function(n) {return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);},
        8: function(n) {return Number((n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3);},
        9: function(n) {return Number(n >= 2);},
        10: function(n) {return Number(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4) ;},
        11: function(n) {return Number((n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3);},
        12: function(n) {return Number(n%10!=1 || n%100==11);},
        13: function(n) {return Number(n !== 0);},
        14: function(n) {return Number((n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3);},
        15: function(n) {return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2);},
        16: function(n) {return Number(n%10==1 && n%100!=11 ? 0 : n !== 0 ? 1 : 2);},
        17: function(n) {return Number(n==1 || n%10==1 ? 0 : 1);},
        18: function(n) {return Number(0 ? 0 : n==1 ? 1 : 2);},
        19: function(n) {return Number(n==1 ? 0 : n===0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3);},
        20: function(n) {return Number(n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);},
        21: function(n) {return Number(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0); }
    };
    
    var pluralExtensions = {
    
        rules: (function () {
            var l, rules = {};
            for (l=_rules.length; l-- ;) {
                rules[_rules[l][0]] = {
                    name: _rules[l][1],
                    numbers: _rules[l][2],
                    plurals: _rulesPluralsTypes[_rules[l][3]]
                }
            }
            return rules;
        }()),
    
        // you can add your own pluralExtensions
        addRule: function(lng, obj) {
            pluralExtensions.rules[lng] = obj;
        },
    
        setCurrentLng: function(lng) {
            if (!pluralExtensions.currentRule || pluralExtensions.currentRule.lng !== lng) {
                var parts = lng.split('-');
    
                pluralExtensions.currentRule = {
                    lng: lng,
                    rule: pluralExtensions.rules[parts[0]]
                };
            }
        },
    
        needsPlural: function(lng, count) {
            var parts = lng.split('-');
    
            var ext;
            if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
                ext = pluralExtensions.currentRule.rule; 
            } else {
                ext = pluralExtensions.rules[parts[f.getCountyIndexOfLng(lng)]];
            }
    
            if (ext && ext.numbers.length <= 1) {
                return false;
            } else {
                return this.get(lng, count) !== 1;
            }
        },
    
        get: function(lng, count) {
            var parts = lng.split('-');
    
            function getResult(l, c) {
                var ext;
                if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
                    ext = pluralExtensions.currentRule.rule; 
                } else {
                    ext = pluralExtensions.rules[l];
                }
                if (ext) {
                    var i;
                    if (ext.noAbs) {
                        i = ext.plurals(c);
                    } else {
                        i = ext.plurals(Math.abs(c));
                    }
                    
                    var number = ext.numbers[i];
                    if (ext.numbers.length === 2 && ext.numbers[0] === 1) {
                        if (number === 2) { 
                            number = -1; // regular plural
                        } else if (number === 1) {
                            number = 1; // singular
                        }
                    }//console.log(count + '-' + number);
                    return number;
                } else {
                    return c === 1 ? '1' : '-1';
                }
            }
                        
            return getResult(parts[f.getCountyIndexOfLng(lng)], count);
        }
    
    };
    var postProcessors = {};
    var addPostProcessor = function(name, fc) {
        postProcessors[name] = fc;
    };
    // sprintf support
    var sprintf = (function() {
        function get_type(variable) {
            return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
        }
        function str_repeat(input, multiplier) {
            for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
            return output.join('');
        }
    
        var str_format = function() {
            if (!str_format.cache.hasOwnProperty(arguments[0])) {
                str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
            }
            return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
        };
    
        str_format.format = function(parse_tree, argv) {
            var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
            for (i = 0; i < tree_length; i++) {
                node_type = get_type(parse_tree[i]);
                if (node_type === 'string') {
                    output.push(parse_tree[i]);
                }
                else if (node_type === 'array') {
                    match = parse_tree[i]; // convenience purposes only
                    if (match[2]) { // keyword argument
                        arg = argv[cursor];
                        for (k = 0; k < match[2].length; k++) {
                            if (!arg.hasOwnProperty(match[2][k])) {
                                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                            }
                            arg = arg[match[2][k]];
                        }
                    }
                    else if (match[1]) { // positional argument (explicit)
                        arg = argv[match[1]];
                    }
                    else { // positional argument (implicit)
                        arg = argv[cursor++];
                    }
    
                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                        throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
                    }
                    switch (match[8]) {
                        case 'b': arg = arg.toString(2); break;
                        case 'c': arg = String.fromCharCode(arg); break;
                        case 'd': arg = parseInt(arg, 10); break;
                        case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                        case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                        case 'o': arg = arg.toString(8); break;
                        case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                        case 'u': arg = Math.abs(arg); break;
                        case 'x': arg = arg.toString(16); break;
                        case 'X': arg = arg.toString(16).toUpperCase(); break;
                    }
                    arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                    pad_length = match[6] - String(arg).length;
                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                    output.push(match[5] ? arg + pad : pad + arg);
                }
            }
            return output.join('');
        };
    
        str_format.cache = {};
    
        str_format.parse = function(fmt) {
            var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
            while (_fmt) {
                if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                    parse_tree.push(match[0]);
                }
                else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                    parse_tree.push('%');
                }
                else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                    if (match[2]) {
                        arg_names |= 1;
                        var field_list = [], replacement_field = match[2], field_match = [];
                        if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                            field_list.push(field_match[1]);
                            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1]);
                                }
                                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1]);
                                }
                                else {
                                    throw('[sprintf] huh?');
                                }
                            }
                        }
                        else {
                            throw('[sprintf] huh?');
                        }
                        match[2] = field_list;
                    }
                    else {
                        arg_names |= 2;
                    }
                    if (arg_names === 3) {
                        throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
                    }
                    parse_tree.push(match);
                }
                else {
                    throw('[sprintf] huh?');
                }
                _fmt = _fmt.substring(match[0].length);
            }
            return parse_tree;
        };
    
        return str_format;
    })();
    
    var vsprintf = function(fmt, argv) {
        argv.unshift(fmt);
        return sprintf.apply(null, argv);
    };
    
    addPostProcessor("sprintf", function(val, key, opts) {
        if (!opts.sprintf) return val;
    
        if (Object.prototype.toString.apply(opts.sprintf) === '[object Array]') {
            return vsprintf(val, opts.sprintf);
        } else if (typeof opts.sprintf === 'object') {
            return sprintf(val, opts.sprintf);
        }
    
        return val;
    });
    // public api interface
    i18n.init = init;
    i18n.setLng = setLng;
    i18n.preload = preload;
    i18n.addResourceBundle = addResourceBundle;
    i18n.hasResourceBundle = hasResourceBundle;
    i18n.getResourceBundle = getResourceBundle;
    i18n.addResource = addResource;
    i18n.addResources = addResources;
    i18n.removeResourceBundle = removeResourceBundle;
    i18n.loadNamespace = loadNamespace;
    i18n.loadNamespaces = loadNamespaces;
    i18n.setDefaultNamespace = setDefaultNamespace;
    i18n.t = translate;
    i18n.translate = translate;
    i18n.exists = exists;
    i18n.detectLanguage = f.detectLanguage;
    i18n.pluralExtensions = pluralExtensions;
    i18n.sync = sync;
    i18n.functions = f;
    i18n.lng = lng;
    i18n.addPostProcessor = addPostProcessor;
    i18n.applyReplacement = f.applyReplacement;
    i18n.options = o;

})(typeof exports === 'undefined' ? window : exports);
/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

  $.showMessage = function(op) {
        var msgdiv = $('<div class="alert alert-'+op.type+' alert-dismissible"></div>');
        var closebtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        msgdiv.append(closebtn).append(op.msg);
        msgdiv.css({'position':'fixed', 'top':op.pos.top, 'left':op.pos.left, 'bottom':op.pos.bottom, 'right':op.pos.right, 'display':'block'});
        msgdiv.css('z-index',99);
        setTimeout(function() {
          msgdiv.fadeOut('slow');
        }, 3000);

        $(document.body).append(msgdiv);
    }

    $.showMessageDialog = function(op) {

      var msgdiv = $('<div class="alert alert-'+op.type+' alert-dismissible alert-dialog"></div>');
        var closebtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        var titlediv = $('<h4>'+op.title+'</h4>');
        var contentdiv = $('<p>'+op.msg+'</p>')
        var btndiv;
        if(op.type == 'danger' || op.type == 'warning') {
          btndiv = $('<div class="alert-dialog-footer"><div class="col-md-6" ><button type="button" data-role="okbtn" data-dismiss="alert" class="btn btn-danger btn-block">确定</button></div><div class="col-md-6"><button type="button" data-dismiss="alert" class="btn btn-default btn-block">取消</button></div></div>');
        } else {
          btndiv = $('<div class="alert-dialog-footer"><div class="col-md-12" ><button type="button" data-role="okbtn" data-dismiss="alert" class="btn btn-primary btn-block ">确定</button></div></div>');
        }

        msgdiv.append(closebtn).append(titlediv).append(contentdiv).append(btndiv);

        if(op.backdrop) {
          //添加遮罩层
          $(document.body).append('<div class="alert-backdrop" role="alert-dialog-backdrop"></div>');
          msgdiv.on('close.bs.alert', function() {
             $('.alert-backdrop[role="alert-dialog-backdrop"]').remove();
          });
        }

        msgdiv.find('[data-role="okbtn"]').on('click.alert.ok', op.okfn);

        msgdiv.css('z-index',99);
       
        $(document.body).append(msgdiv);

    }

    $.showWaiting = function(op) {
      $(document.body).append('<div class="alert alert-waiting"><i class="fa fa-spinner fa-spin"></i></div>')
                      .append('<div class="alert-backdrop" role="waiting-backdrop"></div>');
    }

    $.removeWaiting = function() {
      var tmp;
      (tmp = $('.alert.alert-waiting')).length && tmp.remove();
      (tmp = $('.alert-backdrop[role="waiting-backdrop"]')).length && tmp.remove();
    }


}(jQuery);





/* ========================================================================
 * Bootstrap: button.js v3.3.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')
	this.$body.removeClass('modal-open')
    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.tooltip')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.tooltip', (data = {}))
        if (!data[selector]) data[selector] = new Tooltip(this, options)
      } else {
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.popover')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.popover', (data = {}))
        if (!data[selector]) data[selector] = new Popover(this, options)
      } else {
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
