export class CSRFValidatorOptions {
    constructor(tokenSecretKey: string, ignoredMethods: string[], ignoredRoutes: string[], entryPointRoutes: string[],
                cookieSecretKey?: string, cookieSessionKeys?: string[]) {
        this.tokenSecretKey = tokenSecretKey;
        this.ignoredMethods = ignoredMethods;
        this.ignoredRoutes = ignoredRoutes;
        this.entryPointRoutes = entryPointRoutes;
        this.cookieSecretKey = cookieSecretKey;
        this.cookieSessionKeys = cookieSessionKeys;
    }

    /**
     * This is a secret key for csrf token encryption
     */
    tokenSecretKey: string;

    /**
     * These methods will be ignored
     */
    ignoredMethods: string[];

    /**
     * These routes will be ignored
     */
    ignoredRoutes: string[];

    /**
     * This is the entry point rotes, which means the csrf tokens will set to any route inside this array even if it is ignored
     */
    entryPointRoutes: string[];

    /**
     * This is a secret key for cookies
     */
    cookieSecretKey?: string;

    /**
     * This is an array of secret keys for sessions
     */
    cookieSessionKeys?: string[];
}
