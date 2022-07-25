const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/',  auth, (req, res, next) => {
    res.render('add', {title: 'New Course', isAdd: true })
})

router.post('/', auth,  async (req, res) => {
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
