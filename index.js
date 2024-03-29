const express = require('express')
const path = require('path')
const csrf = require('csurf')
const  flash = require('connect-flash')
const mongoose = require('mongoose')
// const exphds = require('express-handlebars')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const keys = require('./keys')



const app = express()

// const hbs = exphds.create({
//     defaultLayout: 'main',
//     extname: 'hbs'
//     helpers: require('./utils/hbs-helpers')
// })

const store = new MongoDBStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

// app.engine('hbs', hbs.engine)
app.set('view engine', 'pug')
app.set('views', 'views')

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('62c967c3f3239d0622e22647')
//         req.user = user
//         next()
//     } catch (e) {
//         console.error(e)
//     }
// })


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {

        await mongoose.connect(keys.MONGODB_URI, {
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
