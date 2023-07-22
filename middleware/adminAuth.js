const isLogin = async(req,res,next)=>{
    next()
    // try {

    //     if(!req.session.admin){
    //       return res.redirect('/admin_sign_in')
    //     }
    //     next()
    // } catch (error) {
    //     console.log(error.message);
    // }

}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.admin){
           return res.redirect('/admin_dashboard')
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