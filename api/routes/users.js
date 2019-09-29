// * Import Express
const express = require(`express`);
const router  = express.Router();

// * Import Validation
const { check , validationResult } = require(`express-validator`);

// * Import BCrypt For Password Checks
const bcrypt = require(`bcryptjs`);

//* Import Models and Authentication
const { User } = require(`../models`);
const authUser = require (`./authentication`);

// ! Async Handler
// * Passes a call back and returns an asynchronus middleware function.
const asyncHandler = cb => {
    return async(req, res, next) => {
        try{ await cb(req,res,next); }catch(err) { next(err); }
    }
}

// * Return the currently authenticated user.
router.get(`/`, authUser, asyncHandler( async (req, res, next) => {
    const user = await req.currentUser;
    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
    });
    res.status(200);
    res.end();
}));

// ! Validation for null user fields.
router.post(`/`, 
    // * Using express-validator to validate the request object.
    // * check([name]) will the following for .[name]:
    // *    - req.body
    // *    - req.cookies
    // *    - req.headers
    // *    - req.params
    // *    - req.query
    // * Express-Validator Documentation: https://express-validator.github.io/docs/index.html
[
    check('firstName').exists({ checkFalsy: true}).withMessage(`Please provide a first name.`),
    check('lastName').exists({checkNull: true, checkFalsy: true}).withMessage(`Please provide a last name.`),
    check('emailAddress').isEmail().exists({checkNull: true, checkFalsy: true}).custom(value => {
        return User.findOne({
            where: {
                emailAddress: value,
            }
        }).then(user => {
            if(user){
                return Promise.reject("This e-mail already exists.");
            }
        })
    }).withMessage(`Please provide an e-mail.`),
    check('password').exists({checkNull: true, checkFalsy: true}).withMessage(`Please provide a password.`),
], asyncHandler(async(req, res, next) => {

    // * Check to see if there is any validation errors.
    const errors = validationResult(req);

    // * See if there is any validation errors from the middleware above.
    if(!errors.isEmpty()){
        const msgs = errors.array().filter(error => error.msg !== "Invalid value");
        const messages = msgs.map(error => error.msg);
        res.status(400).json({ errors: messages });
    }else{
        const user = req.body;
        
        // * Encrpyt password before passing to database.
        user.password = bcrypt.hashSync(user.password);
        
        // * Create User
        await User.create(user)
        .then( user => {
            res.location = `/`;
            res.status(201).end();
        });
    }
}));

module.exports = router;