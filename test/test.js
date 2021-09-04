"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
var index_1 = require("../index");
var csrf_validator_options_model_1 = require("../model/csrf-validator-options.model");
var request = require('supertest');
var expect = require('expect');
var cookie_secret_key = '98h4nj1nn45j21n4567i224in19sa';
var cookie_session_keys = ['732mbv52v3ik5n6bu32m6j32voi5n', '2n455kn32k6no232bjn6n2jb3jn64'];
var csrf_secret_key = '6njh32h4v2ij32ij676n23ij6n23i';
var createServerApp = function (app) {
    app.get('/*', function (req, res) { res.sendStatus(200); });
    return app;
};
it('should throw error "Token secret key missing"', function (done) {
    expect(function () {
        index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(null, null, null, null)).configure();
    }).toThrowError('Token secret key missing');
    done();
});
it('should throw error "Cookie secret key missing"', function (done) {
    expect(function () {
        var app = require('express')();
        index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(null, null, null, null)).configureApp(app);
    }).toThrowError('Cookie secret key missing');
    done();
});
it('should throw error "Cookie session keys missing"', function (done) {
    expect(function () {
        var app = require('express')();
        index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(null, null, null, null, null, cookie_secret_key)).configureApp(app);
    }).toThrowError('Cookie session keys missing');
    done();
});
it('should throw error "Token secret key missing"', function (done) {
    expect(function () {
        var app = require('express')();
        index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(null, null, null, null, null, cookie_secret_key, cookie_session_keys)).configureApp(app);
    }).toThrowError('Token secret key missing');
    done();
});
it('should get 403 FORBIDDEN, as the /login is not set as ignored route', function (done) {
    var app = require('express')();
    index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(csrf_secret_key, null, null, null, null, cookie_secret_key, cookie_session_keys)).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(403, done);
});
it('should get 200 OK, as the GET method is set as ignored method', function (done) {
    var app = require('express')();
    index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(csrf_secret_key, ['GET'], null, null, null, cookie_secret_key, cookie_session_keys)).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(200, done);
});
it('should get 200 OK, as the /login route is set as ignored route', function (done) {
    var app = require('express')();
    index_1.CSRFValidator.instance(new csrf_validator_options_model_1.CSRFValidatorOptions(csrf_secret_key, null, ['/login'], null, null, cookie_secret_key, cookie_session_keys)).configureApp(app);
    app = createServerApp(app);
    request(app)
        .get('/login')
        .expect(200, done);
});
