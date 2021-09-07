'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSRFValidator = void 0;
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser");
var HttpStatus = require("http-status");
var CSRFValidator = /** @class */ (function () {
    function CSRFValidator(options) {
        this.options = options;
        this.CSRF_TOKEN_KEY = 'csrf-token';
        this.CSRF_INVALID_ERROR = { code: 'ER-CSRF', message: 'CSRF verification failure' };
        this.CSRF_CONFIGURATION_MISSING = {
            COOKIE_SECRET_KEY: 'Cookie secret key missing',
            COOKIE_SESSION_KEYS: 'Cookie session keys missing',
            TOKEN_SECRET_KEY: 'Token secret key missing'
        };
    }
    CSRFValidator.instance = function (options) {
        return new CSRFValidator(options);
    };
    CSRFValidator.prototype.configure = function () {
        this.init();
    };
    CSRFValidator.prototype.configureApp = function (app) {
        if (!this.options.cookieSecretKey) {
            throw Error(this.CSRF_CONFIGURATION_MISSING.COOKIE_SECRET_KEY);
        }
        if (!this.options.cookieSessionKeys) {
            throw Error(this.CSRF_CONFIGURATION_MISSING.COOKIE_SESSION_KEYS);
        }
        app.use(cookieParser(this.options.cookieSecretKey));
        app.use(cookieSession({ keys: this.options.cookieSessionKeys }));
        app.use(this.init());
    };
    CSRFValidator.prototype.init = function () {
        var _this = this;
        var _a, _b;
        if (!this.options.tokenSecretKey) {
            throw Error(this.CSRF_CONFIGURATION_MISSING.TOKEN_SECRET_KEY);
        }
        var csrfOptions = this.options;
        var csrfTokenKey = (_a = csrfOptions.cookieKey) !== null && _a !== void 0 ? _a : this.CSRF_TOKEN_KEY;
        var getRequestSecrets = this.getRequestSecrets;
        var getRequestToken = this.getRequestToken;
        var createToken = this.createToken;
        var verifyToken = this.verifyToken;
        var csrfInvalidError = (_b = this.options.customErrorMessage) !== null && _b !== void 0 ? _b : this.CSRF_INVALID_ERROR;
        return function (request, response, next) {
            var _a, _b, _c;
            var parseUrl = require('parseurl');
            var token = createToken(csrfOptions);
            var entryPointRoutes = (_a = csrfOptions.entryPointRoutes) !== null && _a !== void 0 ? _a : [];
            var ignoredMethods = (_b = csrfOptions.ignoredMethods) !== null && _b !== void 0 ? _b : [];
            var ignoredRoutes = (_c = csrfOptions.ignoredRoutes) !== null && _c !== void 0 ? _c : [];
            var requestedMethod = request.method;
            var requestedRoute = parseUrl(request).pathname;
            if (ignoredMethods && !ignoredMethods.includes(requestedMethod)
                && ignoredRoutes && !ignoredRoutes.includes(requestedRoute)) {
                var requestToken = getRequestToken(request, getRequestSecrets, csrfTokenKey);
                if (requestToken && verifyToken(requestToken, csrfOptions)) {
                    _this.setCSRFToken(response, token, csrfTokenKey);
                    return next();
                }
                else {
                    console.log('sending respone');
                    response.status(HttpStatus.FORBIDDEN).send(csrfInvalidError);
                    return;
                }
            }
            if (entryPointRoutes.includes(requestedRoute)) {
                _this.setCSRFToken(response, token, csrfTokenKey);
            }
            return next();
        };
    };
    CSRFValidator.prototype.getRequestToken = function (request, getRequestSecrets, csrfTokenKey, signed) {
        var secrets = getRequestSecrets(request, signed);
        return (secrets && secrets[csrfTokenKey]) || null;
    };
    CSRFValidator.prototype.getRequestSecrets = function (request, signed) {
        return signed ? request.signedCookies : request.cookies;
    };
    CSRFValidator.prototype.setCSRFToken = function (response, token, tokenKey) {
        response.cookie(tokenKey, token);
    };
    CSRFValidator.prototype.createToken = function (csrfOptions) {
        var bcrypt = require('bcryptjs');
        var saltRounds = 10;
        var secretKey = csrfOptions.tokenSecretKey;
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(secretKey, salt);
        return hash;
    };
    CSRFValidator.prototype.verifyToken = function (token, csrfOptions) {
        var bcrypt = require('bcryptjs');
        return bcrypt.compareSync(csrfOptions.tokenSecretKey, token);
    };
    return CSRFValidator;
}());
exports.CSRFValidator = CSRFValidator;
