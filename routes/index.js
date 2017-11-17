var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) { //到达/home路径首先判断是否已经登录
    res.redirect("/user/login"); //未登录则重定向到 /login 路径
  }
  const user = req.session.user;
  res.render("index", { username: user.username }); //已登录则渲染home页面
});

module.exports = router;