`use strict`;

// * Import Express Module
const express = require(`express`);

// * Import User Model
const User = require('../models')[`User`];

// * Import basic-auth for authentication
const authenticate = require('basic-auth');

// * Import BCrypt for encrpytion.
const bcrypt = require(`bcryptjs`);

/**
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

 module.exports = (req, res, next) => {
     // * Container for Errors
     let errors = null;

    // * Get current user credentials.
    const credentials = authenticate(req);

    // * If user credentials are valid ->
    if(credentials){
        //* Find matching email
        User.findOne({
            where: {
                emailAddress: credentials.name,
            }
        }).then(user => {
            // * Check that passed email exists ->
            if(user){
                // * Cross-check password with database.
                const passwordCheck = bcrypt.compareSync(credentials.pass, user.password);

                if(passwordCheck){
                    // * Password Success
                    req.currentUser = user;
                    next();
                } else {
                    // * Password Failed
                    const err = new Error(`Unable to authenticate => ${credentials.name}`);
                    err.status = 401;
                    next(err);
                }
            }else{
                // * Passed email does not exist.
                const err = new Error(`Could not find the username => ${credentials.name}`);
                err.status = 401;
                next(err);
            }
        });


    }else{
        //* User credentials are not valid.
        const err = new Error(`credentials are not valid.`);
        err.status = 401;
        next(err);
    }
};