const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('../models/user')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const {registerValidators} = require('../utils/validators')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: keys.SENDGRID_API_KEY
    }
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
        loginError: req.flash('loginError'),
        registrationError: req.flash('registrationError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })

})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Password is incorrect')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'This user is not exist')
            res.redirect('/auth/login#registratioin')
        }
    } catch (err) {
        console.error(err)
    }
})

router.post('/registration', registerValidators, async (req, res) => {
    try {
        const {email, password, name } = req.body
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            req.flash('registrationError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#registration')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}
        })
        await user.save()
        await transporter.sendMail({ ...regEmail(email)  })
        res.redirect('/auth/login#login')

    } catch (err) {
        console.error(err)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', ({
        title: 'Reset password',
        error: req.flash('error')
    }))
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) return res.redirect('/auth/login')

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if (!user) return res.redirect('/auth/login')

        res.render('auth/password', ({
            title: 'Reset password',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        }))
    } catch (err) {
        console.error(err)
    }
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if(err) {
                req.flash('error', 'Something wrong, try again later')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = (Date.now() + 60 * 60 * 1000)
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'This email user dos not exist')
                res.redirect('/auth/reset')
            }
        })
    } catch(err) {
        console.error(err)
    }
})

router.post('/password', async (req, res) => {
    console.log('Exp Time:', new Date(Date.now()))
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'token life time is finished')
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.error(err)
    }
})

module.exports = router