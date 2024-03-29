const {Router} = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

function maoCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count,

    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', auth,  async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/cart')
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId')
    const courses = maoCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }
    res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
    // const card = await Card.fetch()
    const user = await req.user.populate('cart.items.courseId')
    const courses = maoCartItems(user.cart)

    console.log('USER', courses)
    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses,
        price: computePrice(courses)
    })
})

module.exports = router