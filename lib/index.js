"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function trim(str) {
    return str.replace(/^[\s\uFEFF\xA0\\/]+|[\s\uFEFF\xA0\\/]+$/g, '');
}
var NcoreLink = /** @class */ (function () {
    function NcoreLink() {
        this.baseUrl = '';
        this.requests = [];
        this.abortActiveType = true;
        this.headers = {};
        this.timeout = 10000;
    }
    NcoreLink.prototype.setParams = function (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    };
    NcoreLink.prototype.request = function (params) {
        var _this = this;
        var type = params.type, abortActiveType = params.abortActiveType, responseType = params.responseType, method = params.method;
        var baseUrl = this.baseUrl;
        var that = this;
        var timer;
        if (type && (abortActiveType || this.abortActiveType)) {
            this.abortRequestType(type);
        }
        var headers = __assign({ 'Content-Type': 'application/json; charset=UTF-8' }, this.headers, params.headers);
        var send = function () {
            var xhr = new XMLHttpRequest();
            var request = { type: type, xhr: xhr };
            xhr.open(method || 'GET', _this.genUrl(params), true);
            xhr.responseType = typeof responseType === 'string' ? responseType : 'json';
            xhr.timeout = params.timeout || _this.timeout;
            for (var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
            var finalError = function (error) {
                if (params.onerror instanceof Function) {
                    params.onerror(error);
                }
                if (that.onerror instanceof Function) {
                    that.onerror(error);
                }
                _this.removeRequest(request);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== xhr.DONE)
                    return;
                if (/^2.+/.test(String(xhr.status)) && params.onsuccess) {
                    params.onsuccess(xhr.response);
                }
                else {
                    finalError({
                        code: xhr.status,
                        status: xhr.statusText,
                        text: xhr.responseType === 'json' ? '' : xhr.responseText
                    });
                }
            };
            xhr.ontimeout = function () {
                if (params.ontimeout instanceof Function) {
                    params.ontimeout(send);
                }
                if (this.ontimeout instanceof Function) {
                    that.ontimeout(send);
                }
            };
            xhr.send(params.body);
            _this.addRequest(request);
        };
        send();
    };
    NcoreLink.prototype.addRequest = function (request) {
        this.requests.push(request);
    };
    NcoreLink.prototype.abortRequests = function () {
        this.requests.forEach(function (request) {
            request.xhr.abort();
        });
    };
    NcoreLink.prototype.abortRequestType = function (type) {
        this.requests.forEach(function (request) {
            if (request.type === type) {
                request.xhr.abort();
            }
        });
    };
    NcoreLink.prototype.removeRequest = function (request) {
        var index = this.requests.indexOf(request);
        this.requests.splice(index, 1);
    };
    NcoreLink.prototype.genUrl = function (params) {
        var include = params.include, fields = params.fields;
        var url = trim(this.baseUrl) + '/' + trim(params.url);
        if (/^http.+/.test(params.url)) {
            url = params.url;
        }
        var queryParams = [];
        if (include && include.length) {
            queryParams.push('@include=' + include.join(';'));
        }
        if (fields && fields.length) {
            queryParams.push('@fields=' + fields.join(';'));
        }
        if (queryParams.length) {
            url += '?' + queryParams.join('&');
        }
        return url;
    };
    return NcoreLink;
}());
exports.NcoreLink = NcoreLink;
var ncoreLinkInstance = new NcoreLink();
exports.default = ncoreLinkInstance;
