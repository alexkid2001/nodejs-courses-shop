const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find().populate('userId', 'email name')

        const tmp = courses.map(c => ({
            id: c._id,
            title: c.title,
            price: c.price,
            img: c.img,
            userId: c.userId
        }))
        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses: tmp
        })
    } catch(err) {
        console.error(err)
    }

})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const course = await  Course.findById(req.params.id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course: {
                title: course.title,
                price: course.price,
                img: course.img,
                cart: course.cart,
                id: course._id
            }
        })
    } catch (err) {
        console.error(err)
    }


})

router.post('/edit', auth,  async (req, res) => {
    try {
        const {id} = req.body
        req.body._id = req.body.id
        delete req.body.id
        const course = await Course.findById(id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch (err) {
        console.error(err)
    }
})

router.post('/remove', auth,  async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: `Course ${course.title}`,
            course
        })
    } catch (err) {
        console.error(err)
    }
})

module.exports = router
