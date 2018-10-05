"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    /*
     * Promise версия request
     */
    NcoreLink.prototype.async = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.request(__assign({}, params, { onsuccess: function (data, xhr) {
                                resolve([null, data, xhr]);
                            },
                            onerror: function (err, xhr) {
                                resolve([err, null, xhr]);
                            },
                            ontimeout: function (err, xhr) {
                                resolve([err, null, xhr]);
                            } }));
                    })];
            });
        });
    };
    NcoreLink.prototype.get = function (params) {
        return this.async(__assign({}, params, { method: 'GET' }));
    };
    NcoreLink.prototype.post = function (params) {
        return this.async(__assign({}, params, { method: 'POST' }));
    };
    NcoreLink.prototype.put = function (params) {
        return this.async(__assign({}, params, { method: 'PUT' }));
    };
    NcoreLink.prototype.request = function (params) {
        var _this = this;
        if (!params.url) {
            console.error('Отсутвует URL запроса');
            return;
        }
        var type = params.type, responseType = params.responseType, method = params.method;
        var baseUrl = this.baseUrl;
        var that = this;
        var abortActiveType = (function () {
            if (params.abortActiveType === undefined) {
                return _this.abortActiveType;
            }
            else {
                return params.abortActiveType;
            }
        })();
        var timer;
        if (type && abortActiveType) {
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
            var finalError = function (error, xhr) {
                if (params.onerror instanceof Function) {
                    params.onerror(error, xhr);
                }
                if (that.onerror instanceof Function) {
                    that.onerror(error, xhr);
                }
                _this.removeRequest(request);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== xhr.DONE)
                    return;
                if (/^2.+/.test(String(xhr.status)) && params.onsuccess) {
                    params.onsuccess(xhr.response, xhr);
                }
                else {
                    finalError({
                        code: xhr.status,
                        status: xhr.statusText,
                        text: (xhr.response && xhr.response.errorMessage) || xhr.responseText,
                    }, xhr);
                }
            };
            xhr.ontimeout = function () {
                if (params.ontimeout instanceof Function) {
                    params.ontimeout(send, xhr);
                }
                if (that.ontimeout instanceof Function) {
                    that.ontimeout(send, xhr);
                }
            };
            var ensureBody = typeof params.body === 'string' ? params.body : JSON.stringify(params.body);
            xhr.send(ensureBody);
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
        var _this = this;
        if (!params.url)
            return '';
        var include = params.include, fields = params.fields, offset = params.offset, count = params.count, filters = params.filters;
        var url = (function () {
            if (/^http.+/.test(params.url)) {
                return params.url;
            }
            var divider = params.url[0] === '/' ? '' : '/';
            return trim(_this.baseUrl) + divider + params.url;
        })();
        var queryParams = [];
        if (include && include.length) {
            queryParams.push('@include=' + include.join(';'));
        }
        if (fields && fields.length) {
            queryParams.push('@fields=' + fields.join(';'));
        }
        if (offset || offset === 0) {
            queryParams.push('@offset=' + offset);
        }
        if (count) {
            queryParams.push('@count=' + count);
        }
        if (filters) {
            if (filters instanceof Array) {
                queryParams = queryParams.concat(filters);
            }
            else {
                for (var fname in filters) {
                    var fval = fname + "=" + filters[fname];
                    queryParams.push(fval);
                }
            }
        }
        if (queryParams.length) {
            var pfx = url.indexOf('?') < 0 ? '?' : '&';
            url += pfx + queryParams.join('&');
        }
        return encodeURI(url);
    };
    return NcoreLink;
}());
exports.NcoreLink = NcoreLink;
var ncoreLinkInstance = new NcoreLink();
exports.default = ncoreLinkInstance;
