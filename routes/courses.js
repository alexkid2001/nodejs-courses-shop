const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', async (req, res, next) => {
    const courses = await Course.find().populate('userId', 'email name')

    console.log('Courses', courses)

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
        courses: tmp
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await  Course.findById(req.params.id)

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
})

router.post('/edit', auth,  async (req, res) => {
    const {id} = req.body
    req.body._id = req.body.id
    console.log('edit body ', req.body)
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/remove', auth,  async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

module.exports = router
