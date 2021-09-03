"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSRFValidatorOptions = void 0;
var CSRFValidatorOptions = /** @class */ (function () {
    function CSRFValidatorOptions(tokenSecretKey, ignoredMethods, ignoredRoutes, entryPointRoutes, cookieSecretKey, cookieSessionKeys) {
        this.tokenSecretKey = tokenSecretKey;
        this.ignoredMethods = ignoredMethods;
        this.ignoredRoutes = ignoredRoutes;
        this.entryPointRoutes = entryPointRoutes;
        this.cookieSecretKey = cookieSecretKey;
        this.cookieSessionKeys = cookieSessionKeys;
    }
    return CSRFValidatorOptions;
}());
exports.CSRFValidatorOptions = CSRFValidatorOptions;
