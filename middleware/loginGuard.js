const guard = (req, res, next) => {
    // 如果用户访问的不是login页面并且没有登陆
    if(req.url != "/login" && !req.session.username){
        res.redirect("/admin/login");
    }else{
        // 如果用户是一个普通用户 则跳转到首页 阻止程序向下执行
        if(req.session.role == "normal"){
            return res.redirect("/home")
        }
        //用户登录状态 放行
        next();
    }
}

module.exports = guard;