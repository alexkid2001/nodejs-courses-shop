const {Router} = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id }).populate('user.userId')
        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => ({
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price
        }, 0)
            }))
        })
    } catch (e) {
        console.error(e)
    }
})

router.post('/', auth, async (req, res) => {

    try {
        const user = await req.user.populate('cart.items.courseId')
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {title: i.courseId._doc.title, price: i.courseId._doc.price}
        }))
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        })
        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (err) {
        console.error(err)
    }

})

module.exports = router