import { CSRFValidatorOptions } from "./model/csrf-validator-options.model";
import { Request, Response } from "express";
export declare class CSRFValidator {
    private options;
    readonly CSRF_TOKEN_KEY = "csrf-token";
    readonly CSRF_INVALID_ERROR: {
        code: string;
        message: string;
    };
    readonly CSRF_CONFIGURATION_MISSING: {
        COOKIE_SECRET_KEY: string;
        COOKIE_SESSION_KEYS: string;
        TOKEN_SECRET_KEY: string;
    };
    constructor(options: CSRFValidatorOptions);
    static instance(options: CSRFValidatorOptions): CSRFValidator;
    configure(): void;
    configureApp(app: any): void;
    private init;
    getRequestToken(request: Request, getRequestSecrets: any, csrfTokenKey: any, signed?: boolean): any;
    getRequestSecrets(request: Request, signed?: boolean): any;
    setCSRFToken(response: Response, token: string, tokenKey: string): void;
    createToken(csrfOptions: CSRFValidatorOptions): string;
    verifyToken(token: string, csrfOptions: CSRFValidatorOptions): boolean;
}
