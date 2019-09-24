// * Import Express
const express = require(`express`);
const router  = express.Router();

// * Import Validation
const { check , validationReesult } = require(`express-validator`);

// * Import BCrypt For Password Checks
const bcrypt = require(`bcryptjs`);

//* Import Models and Authentication
const { User } = require(`../models`);
const authUser = require (`./authentication`);

// ! Async Handler
const asyncHandler = cb => {
    return async(req, res, next) => {
        try{ await cb(req,res,next); }catch(err) { next(err); }
    }
}

/* * Create User Routes * */
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
router.post(`/`, [
    check('firstName').exists({checkNull: true, checkFalsy: true}).withMessage(`Please provide a first name.`),
    check('lastName').exists({checkNull: true, checkFalsy: true}).withMessage(`Please provide a last name.`),
    check('emailAddress').exists({checkNull: true, checkFalsy: true}).withMessage(`Please provide an e-mail.`),
    check('password').exists({checkNull: true, checkFalsy: true}).withMessage(`Please provide a password.`),
], asyncHandler(async(req, res, next) => {
    // * Check to see if there is any validation errors.
    const errors = validationReesult(req);

    if(!errors.isEmpty()){
        const messages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: messages });
    }else{
        const user = req.body;

        user.password = bcryptjs.hashSync(user.password);

        await User.create(user)
            .then( user => {
                res.location = `/`;
                res.status(201).end();
            });
    }
}));

module.exports = router;