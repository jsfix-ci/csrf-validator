'use strict';
import * as bcrypt from 'bcrypt';
import * as cookieSession from 'cookie-session';
import * as cookieParser from 'cookie-parser';
import * as HttpStatus from 'http-status';
import * as createHttpError from "http-errors";
import {CSRFValidatorOptions} from "./model/csrf-validator-options.model";
import {Request, Response} from "express";

export class CSRFValidator {
    readonly CSRF_TOKEN_KEY = 'csrf-token';
    readonly CSRF_INVALID_ERROR = {code: 'ER-CSRF', message: 'CSRF verification failure'};
    readonly CSRF_CONFIGURATION_MISSING = {
        COOKIE_SECRET_KEY: 'Cookie secret key missing',
        COOKIE_SESSION_KEYS: 'Cookie session keys missing',
        TOKEN_SECRET_KEY: 'Token secret key missing'
    };

    constructor(private options: CSRFValidatorOptions) {
    }

    public static instance(options: CSRFValidatorOptions) {
        return new CSRFValidator(options);
    }

    configure() {
        this.init();
    }

    configureApp(app) {
        if (!this.options.cookieSecretKey) {
            throw Error(this.CSRF_CONFIGURATION_MISSING.COOKIE_SECRET_KEY);
        }
        if (!this.options.cookieSessionKeys) {
            throw Error(this.CSRF_CONFIGURATION_MISSING.COOKIE_SESSION_KEYS);
        }
        app.use(cookieParser(this.options.cookieSecretKey));
        app.use(cookieSession({keys: this.options.cookieSessionKeys}));
        app.use(this.init());
    }

    private init() {
        if (!this.options.tokenSecretKey) {
            throw Error(this.CSRF_CONFIGURATION_MISSING.TOKEN_SECRET_KEY);
        }
        const csrfOptions: CSRFValidatorOptions = this.options;
        const csrfTokenKey = csrfOptions.cookieKey ?? this.CSRF_TOKEN_KEY;
        const getRequestSecrets = this.getRequestSecrets;
        const getRequestToken = this.getRequestToken;
        const createToken = this.createToken;
        const verifyToken = this.verifyToken;
        return (request: Request, response: Response, next: any): any => {
            const parseUrl = require('parseurl');

            const token = createToken(csrfOptions);

            const entryPointRoutes = csrfOptions.entryPointRoutes ?? [];
            const ignoredMethods = csrfOptions.ignoredMethods ?? [];
            const ignoredRoutes = csrfOptions.ignoredRoutes ?? [];

            const requestedMethod = request.method;
            const requestedRoute = parseUrl(request).pathname;

            if (ignoredMethods && !ignoredMethods.includes(requestedMethod)
                && ignoredRoutes && !ignoredRoutes.includes(requestedRoute)) {
                const requestToken = getRequestToken(request, getRequestSecrets, csrfTokenKey);
                if (requestToken && verifyToken(requestToken, csrfOptions)) {
                    this.setCSRFToken(response, token, csrfTokenKey);
                    return next();
                } else {
                    return next(createHttpError(HttpStatus.FORBIDDEN, this.CSRF_INVALID_ERROR));
                }
            }

            if (entryPointRoutes.includes(requestedRoute)) {
                this.setCSRFToken(response, token, csrfTokenKey);
            }
            return next();
        };
    }

    getRequestToken(request: Request, getRequestSecrets, csrfTokenKey, signed?: boolean) {
        const secrets = getRequestSecrets(request, signed);
        return (secrets && secrets[csrfTokenKey]) || null;
    }

    getRequestSecrets(request: Request, signed?: boolean): any {
        return signed ? request.signedCookies : request.cookies;
    }

    setCSRFToken(response: Response, token: string, tokenKey: string) {
        response.cookie(tokenKey, token);
    }

    createToken(csrfOptions: CSRFValidatorOptions): string {
        const saltRounds = 10;
        const secretKey = csrfOptions.tokenSecretKey;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(secretKey, salt);
        return hash;
    }

    verifyToken(token: string, csrfOptions: CSRFValidatorOptions): boolean {
        return bcrypt.compareSync(csrfOptions.tokenSecretKey, token);
    }
}
