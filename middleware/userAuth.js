const isLogin = async(req,res,next)=>{
    // next()
    try {

        if(!req.session.user){
          return res.redirect('/user_login')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }

}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.admin){
           return res.redirect('/my_account')
        }
        next()

    } catch (error) {
        console.log(error.message);
    }

}

module.exports ={
    isLogin,
    isLogout
}