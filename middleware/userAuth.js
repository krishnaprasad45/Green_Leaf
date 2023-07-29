const model = require('../server/model/user_register')
const User = model.user_register

const isLogin = async (req, res, next) => {
    // next()
    try {

        if (!req.session.user) {
            return res.redirect('/user_login')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }

}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin) {
            return res.redirect('/my_account')
        }
        next()

    } catch (error) {
        console.log(error.message);
    }

}

const blockCheck = async (req, res, next) => {

    try {

        if (req.session.user) {
            const userData = req.session.user;
            console.log(userData)
            const id = userData._id
            console.log(id)

            const user = await User.findById(id)
            console.log(user)


            if (user.is_blocked) {
                res.redirect('/user_logout')
            } else {
                next()
            }
        } else {
            next()
        }

    } catch (error) {
        console.log(error.message);
    }


}

module.exports = {
    isLogin,
    isLogout,
    blockCheck,
}