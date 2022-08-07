const { Router } = require('express')
const {validationResult} = require('express-validator/check')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')
const router = Router()

router.get('/',  auth, (req, res, next) => {
    res.render('add', {title: 'New Course', isAdd: true })
})

router.post('/', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'New Course',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.name,
                price: req.body.price,
                img: req.body.preview,
            }
        })
    }

    const course = new Course({
        title: req.body.name,
        price: req.body.price,
        img: req.body.preview,
        userId: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})

module.exports = router
