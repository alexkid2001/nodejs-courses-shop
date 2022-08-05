const keys = require('../keys')

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Registration is completed',
        html: `
            <h1>Welcome our shop</h1>
            <p>New account created success ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">Courses Shop</a>  
        `
    }
}