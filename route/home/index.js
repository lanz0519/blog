const { Article } = require("../../model/article");
// 导入mongoose-sex-page模块 进行分页操作
const pagination = require("mongoose-sex-page");
module.exports = async (req, res) => {

    let page = req.query.page;

    // 从数据库中查询数据
    let articles = await pagination(Article).find().page(page).size(4).display(3).populate("author").exec();

    //res.send(articles);

    // 渲染模版并传递数据
    res.render("home/default", {
        articles: articles
    });
}