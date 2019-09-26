`use strict`;

// * Import Express Module
const express = require(`express`);

// * Import User Model
const User = require('../models')[`User`];

// * Import basic-auth for authentication
const authenticate = require('basic-auth');

// * Import BCrypt for encrpytion.
const bcrypt = require(`bcryptjs`);

// * Documentation for the @param comments below: https://jsdoc.app/tags-param.html
// * With @param you can describe the {DataType} {paramName} {- Description of Param }
/**
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

module.exports = (req, res, next) => {

    // * Container for any errors that arrise, default null so that it doesn't trip the code.
    let errors = null;

    // * Get current user credentials from the Request object.
    // * Basic-Auth documentation here: https://www.npmjs.com/package/basic-auth 
    const credentials = authenticate(req);

    // * If user credentials are valid (user is logged in) ->
    if (credentials) {
        // * Look through the User models and find the one where the Model's e-mail address matches the user's credential's e-mail address (credentials.name is an e-mail).
        // * There should only be one so we can use the .findOne() method. Documentation here: https://sequelize.org/master/manual/models-usage.html
        User.findOne({
            where: {
                emailAddress: credentials.name,
            }
        }).then(user => {
            // * Check to make sure the returned user is not null ->
            if (user) {
                // * Compare the credential's password with user's password.
                // * BCryptJS Documentation: https://www.npmjs.com/package/bcrypt
                // * Returns TRUE/FALSE
                const passwordCheck = bcrypt.compareSync(credentials.pass, user.password);

                // * If the comparison matches ->
                if (passwordCheck) {
                    // * Set `req.currentUser` to the found user.
                    req.currentUser = user;

                    // * Move on to next middleware.
                    next();
                } else {
                    // * Password did not match
                    const err = new Error(`Unable to authenticate => ${credentials.name}`);
                    err.status = 401;
                    next(err);
                }
            } else {
                // * User / E-Mail does not exist.
                const err = new Error(`Could not find the username => ${credentials.name}`);
                err.status = 401;
                next(err);
            }
        });
    } else {
        //* User credentials are not valid (user is not logged in).
        const err = new Error(`User credentials are not valid.`);
        err.status = 401;
        next(err);
    }
};