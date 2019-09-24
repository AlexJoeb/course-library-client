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
    Course.findAll({
            order: [
                [`id`, `ASC`]
            ],
            attributes: [`id`, `userId`, `title`, `description`, `estimatedTime`, `materialsNeeded`],
            include: [{
                model: User,
                attributes: [`id`, `firstName`, `lastName`, `emailAddress`],
            }]
        })
        .then(courses => {
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
    Course.findOne({
        attributes: ['id', 'userId', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }],
        where: {
            id: req.params.id
        }
    }).then(course => {
        if (course) {
            res.json({
                course
            })
        } else {
            res.status(404).json({
                message: 'Route not found'
            });
        }
    })
}))

router.post('/', [
    check('title').exists().withMessage(`Please provide a title.`),
    check('description').exists().withMessage(`Please provide a description`)
], authUser, asyncHandler(async (req, res, next) => {

    // * Get Current User's ID.
    const user = req.currentUser.id;

    // * See if there is any validation errors
    const errors = validationResult(req);

    //* Check if there are any validation errors
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({
            errors: errorMessages
        });
    } else {
        // * Checks passed, create course.
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

router.put('/:id', [
    check('title').exists().withMessage(`Please provide a title.`),
    check('description').exists().withMessage(`Please provide a description`)
], authUser, asyncHandler(async (req, res, next) => {

    // * Get Current User's ID.
    const user = req.currentUser.id;

    // * See if there is any validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({
            errors: errorMessages
        });
    } else {
        await Course.findOne({
                where: [{
                    id: req.params.id
                }]
            })
            .then((course) => {
                if (course.userId === user) {
                    if (course) {
                        course.update(req.body);
                        res.status(204).end();
                    } else {
                        next();
                    }
                } else {
                    res.status(403).json({
                        message: `Current user does not own the selected course.`
                    }).end();
                }
            })
    }
}))

router.delete('/:id', authUser, asyncHandler(async (req, res, next)=> {
    // * Get Current User's ID.
    const user = req.currentUser.id;

    await Course.findOne({ 
      where: [{ id: req.params.id }]
    })
    .then((course) => {
            if (course.userId === user) {
              if (course) {
                course.destroy();
                res.status(204).end();
            } else {
              next(); 
            }
         } else {
          res.status(403).json({ message: `Current user does not own the selected course.` }).end(); 
         }
      })    
  }))

  module.exports = router;