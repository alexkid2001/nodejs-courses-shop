const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphds = require('express-handlebars')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const User = require('./models/user')

const app = express()

const hbs = exphds.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('62c967c3f3239d0622e22647')
        req.user = user
        next()
    } catch (e) {
        console.error(e)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = 'mongodb+srv://alexandr:YAfCfMR8r2pEb7tm@cluster0.0yksntw.mongodb.net/shop?retryWrites=true&w=majority'
        await mongoose.connect(url, {
            useNewUrlParser: true
        })
        const candidate  = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'test@test.ru',
                name: 'Alex',
                cart: {items:[]}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.error(e)
    }

}

start()





// Alexandr
// D3EHztW95P76LGih
