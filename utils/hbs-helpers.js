module.exports = {
    ifeq(a, d, options) {
        if(a === b) {
            return options.fn(this)
        }

        return options.inverse(this)
    }
}