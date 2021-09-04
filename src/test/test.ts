process.env.NODE_ENV = 'test';

import {CSRFValidator} from "../index";
import {CSRFValidatorOptions} from "../model/csrf-validator-options.model";
const request = require('supertest');
const expect = require('expect');

const cookie_secret_key = '98h4nj1nn45j21n4567i224in19sa';
const cookie_session_keys = ['732mbv52v3ik5n6bu32m6j32voi5n', '2n455kn32k6no232bjn6n2jb3jn64'];
const csrf_secret_key = '6njh32h4v2ij32ij676n23ij6n23i';

const createServerApp = (app) => {
    app.get('/*', (req, res) => {res.sendStatus(200);});
    return app;
}

it('should throw error "Token secret key missing"', function (done) {
    expect(() => {
        CSRFValidator.instance(
            new CSRFValidatorOptions(null, null, null, null)
        ).configure();
    }).toThrowError('Token secret key missing');
    done();
});

it('should throw error "Cookie secret key missing"', function (done) {
    expect(() => {
        let app = require('express')();
        CSRFValidator.instance(
            new CSRFValidatorOptions(null, null, null, null)
        ).configureApp(app);
    }).toThrowError('Cookie secret key missing');
    done();
});

it('should throw error "Cookie session keys missing"', function (done) {
    expect(() => {
        let app = require('express')();
        CSRFValidator.instance(
            new CSRFValidatorOptions(null, null, null, null, null, cookie_secret_key, cookie_session_keys)
        ).configureApp(app);
    }).toThrowError('Cookie session keys missing');
    done();
});

it('should throw error "Token secret key missing"', function (done) {
    expect(() => {
        let app = require('express')();
        CSRFValidator.instance(
            new CSRFValidatorOptions(null, null, null, null, null, cookie_secret_key, cookie_session_keys)
        ).configureApp(app);
    }).toThrowError('Token secret key missing');
    done();
});

it('should get 403 FORBIDDEN, as the /login is not set as ignored route', function (done) {
    let app = require('express')();
    CSRFValidator.instance(
        new CSRFValidatorOptions(csrf_secret_key, null, null, null, null, cookie_secret_key, cookie_session_keys)
    ).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(403, done);
});

it('should get 200 OK, as the GET method is set as ignored method', function (done) {
    let app = require('express')();
    CSRFValidator.instance(
        new CSRFValidatorOptions(csrf_secret_key, ['GET'], null, null, null, cookie_secret_key, cookie_session_keys)
    ).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(200, done);
});

it('should get 200 OK, as the /login route is set as ignored route', function (done) {
    let app = require('express')();
    CSRFValidator.instance(
        new CSRFValidatorOptions(csrf_secret_key, null, ['/login'], null, null, cookie_secret_key, cookie_session_keys)
    ).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(200, done);
});

it('should get 200 OK, as the /login route is set as ignored route', function (done) {
    let app = require('express')();
    CSRFValidator.instance(
        {
            tokenSecretKey: 'A secret key for encrypting csrf token',
            ignoredMethods: [],
            ignoredRoutes: [],
            entryPointRoutes: [],
            cookieKey: 'Optional - Custom csrf cookie key',
            cookieSecretKey: 'Cookie secret key for cookie-parser',
            cookieSessionKeys: ['First session key for cookie-session', 'Second session key for cookie-session']
        }
    ).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(200, done);
});
