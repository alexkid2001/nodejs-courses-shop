const {body} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correct email').custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if(user) {
                    return Promise.reject('User with that email already exist')
                }
            } catch (err) {
                console.error(err)
            }
        })
        .normalizeEmail(),
    body('password', 'Password mast be min 6 chars')
        .isLength({min: 6,  max: 20})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must be equal')
            }

            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Name must have min 3 chars')
        .trim()
]

exports.courseValidators = [
    body('name').isLength({min: 3}).withMessage('Min name length is 3 chars').trim(),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('preview', 'Enter correct url preview').isURL()
]