// 应用express框架
const express = require("express");
// 处理路径
const path = require("path");
// 引入body-parser模块 用来处理post请求
const bodyParser = require("body-parser");
// 导入express-session模块
const session = require("express-session");
// 导入art-template模版引擎
const template = require("art-template");
// 导入dateformat第三方模块
const dateFormat = require("dateformat");
// 导入morgan模块
const morgan = require("morgan");
// 导入config模块
const config = require("config");
// 创建网站服务器
const app = express();
// 数据库连接
require("./model/connect");
//处理post请求参数
app.use(bodyParser.urlencoded({extended: false}))
// 配置session
app.use(session({
    secret: "secret key",
    resave: false, 
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 60
    }
}));

// 当渲染后缀为art的模版时，所使用的模版引擎是什么
app.engine("art", require("express-art-template"));
// 告诉express框架模版的位置
app.set("views", path.join(__dirname, "views"));
// 告诉express框架模版默认后缀
app.set("view engine", "art");
// 向模版内部导入dateFormate变量
template.defaults.imports.dateFormat = dateFormat;

// 开放静态资源文件
app.use(express.static(path.join(__dirname, "public")));

console.log(config.get("title"));

// 判断是开发环境或者生产环境
if(process.env.NODE_ENV == "development"){
    // 开发环境
    console.log("是开发环境");
    // 在开发环境中 将客户端发送到服务器端的请求信息打印到控制台中
    app.use(morgan("dev"));
}else{
    // 生产环境
    console.log("是生产环境");
}


// 引入路由模块
const home = require("./route/home");
const admin = require("./route/admin");
// 拦截admin的请求
app.use("/admin", require("./middleware/loginGuard"));

// 为路由匹配请求路径
app.use("/home", home);
app.use("/admin", admin);

//错误处理
app.use((err, req, res, next) => {
    // 将字符串对象转换成对象类型
    // JSON.parse()
    const result = JSON.parse(err);

    let params = [];
    for(let attr in result){
        if(attr != "path"){
            params.push(attr + "=" + result[attr]);
        }
    }
    res.redirect(`${result.path}?${params.join("&")}`);
});

// 监听端口
app.listen(3000);
console.log("服务器启动成功");