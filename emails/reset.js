const keys = require('../keys')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Reset Password',
        html: `
            <h1>Are you forgot password</h1>
            <p>If you are not, then ignore this email</p>
            <p>Else click to link down the page</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
            <hr>
            <a href="${keys.BASE_URL}">Courses Shop</a>  
        `
    }
}