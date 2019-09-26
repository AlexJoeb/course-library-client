// * Import Express
const express = require(`express`);
const router = express.Router();

// * Import Validation
const {
    check,
    validationResult
} = require(`express-validator`);

//* Import Models and Authentication
const {
    Course,
    User
} = require(`../models`);
const authUser = require(`./authentication`);

// ! Async Handler
// * Passes a call back and returns an asynchronus middleware function.
const asyncHandler = cb => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

router.get(`/`, asyncHandler(async (req, res, next) => {
    // * Using Sequelize's .findAll() to retrieve all courses with condition ->
    Course.findAll({
            order: [
                // * Order the results by ID in ascending order.
                [`id`, `ASC`]
            ],
            // * Include attributes [`id`, `userId`, `title`, `description`, `estimatedTime`, `materialsNeeded`] in the results.
            attributes: [`id`, `userId`, `title`, `description`, `estimatedTime`, `materialsNeeded`],
            // * Also include the User model that is associated with the Course.
            include: [{
                model: User,
                // * Include attributes [`id`, `firstName`, `lastName`, `emailAddress`] in the results.
                attributes: [`id`, `firstName`, `lastName`, `emailAddress`],
            }]
        })
        .then(courses => {
            // * After getting the Course object back, respond with the Object in JSON format.
            res.json({
                courses
            });
        })
        .catch(err => {
            err.status = 400;
            next(err);
        });
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
    // * Using Sequelize's .findOne() to retrieve one course with condition ->
    Course.findOne({
        // * Include attributes ['id', 'userId', 'title', 'description', 'estimatedTime', 'materialsNeeded'] in the results.
        attributes: ['id', 'userId', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: [{
            model: User,
            // * Include attributes [`id`, `firstName`, `lastName`, `emailAddress`] in the results.
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }],
        // * This is where you can put the conditions, here we are only looking for a course where the id === the `/courses/:id`.
        where: {
            id: req.params.id
        }
    }).then(course => {
        if (course) {
            // * After getting the Course object back, respond with the Object in JSON format.
            res.json({
                course
            });
        } else {
            res.status(404).json({
                message: 'Route not found'
            });
        }
    })
}))

router.post('/',
    // * Using express-validator to validate the request object.
    // * check([name]) will the following for .[name]:
    // *    - req.body
    // *    - req.cookies
    // *    - req.headers
    // *    - req.params
    // *    - req.query
    // * Express-Validator Documentation: https://express-validator.github.io/docs/index.html
    [
        check('title').exists().withMessage(`Please provide a title.`),
        check('description').exists().withMessage(`Please provide a description`)
    ], authUser, asyncHandler(async (req, res, next) => {

        // * Get the current user's id.
        const user = req.currentUser.id;

        // * See if there is any validation errors from the middleware above.
        const errors = validationResult(req);

        //* Check if there are any validation errors ->
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            // * Response with status 400 and serve the errors as a JSON object.
            res.status(400).json({
                errors: errorMessages
            });
        } else {
            // * No validation errors found ->

            // * Create the course.
            await Course.create({
                    ...req.body,
                    userId: user
                })
                .then((course) => {
                    if (course) {
                        res.status(201).location(`/api/courses/${course.id}`).end();
                    } else {
                        next();
                    }
                });
        }
    }));

// * Using express-validator to validate the request object. See above for documentation.
router.put('/:id', [
    check('title').exists().withMessage(`Please provide a title.`),
    check('description').exists().withMessage(`Please provide a description`)
], authUser, asyncHandler(async (req, res, next) => {

    // * Get Current User's ID.
    const user = req.currentUser.id;

    // * See if there is any validation errors
    const errors = validationResult(req);

    //* Check if there are any validation errors ->
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        // * Response with status 400 and serve the errors as a JSON object.
        res.status(400).json({
            errors: errorMessages
        });
    } else {
        // * Find one course where the id matches the `/courses/:id` param.
        await Course.findOne({
                where: [{
                    id: req.params.id
                }]
            })
            .then((course) => {
                // * Check if the current user is the owner of course.
                if (course.userId === user) {
                    // * Check if course found was valid.
                    if (course) {
                        // * Update the current course.
                        course.update(req.body);
                        res.status(204).end();
                    } else {
                        // * Course not found or is null.
                        next();
                    }
                } else {
                    // * Current user is not the owner.
                    res.status(403).json({
                        message: `Current user does not own the selected course.`
                    }).end();
                }
            })
    }
}))

router.delete('/:id', authUser, asyncHandler(async (req, res, next) => {
    // * Get Current User's ID.
    const user = req.currentUser.id;

    // * Find one course where the id matches the `/courses/:id` param.
    await Course.findOne({
            where: [{
                id: req.params.id
            }]
        })
        .then((course) => {
            // * Cheeck if current user owns the course.
            if (course.userId === user) {
                // * Make sure course was found and is not null.
                if (course) {
                    // * Delete the course.
                    course.destroy();
                    res.status(204).end();
                } else {
                    // * Course not found or is null.
                    next();
                }
            } else {
                res.status(403).json({
                    message: `Current user does not own the selected course.`
                }).end();
            }
        })
}))

module.exports = router;