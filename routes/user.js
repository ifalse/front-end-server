var express = require('express');
var router = express.Router();

/* GET login page. */
router.route("/login").get(function(req, res) { // 到达此路径则渲染login文件，并传出title值供 login.html使用
  res.render("user/login", { title: 'User Login' });
}).post(function(req, res) { // 从此路径检测到post方式则进行post数据的处理操作
  //get User info
  //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
  var User = global.dbHandel.getModel('User');
  var uname = req.body.uname; //获取post上来的 data数据中 uname的值
  User.findOne({ username: uname }, function(err, doc) { //通过此model以用户名的条件 查询数据库中的匹配信息
    if (err) { //错误就返回给原post处（login.html) 状态码为500的错误
      res.send(500);
      console.log(err);
    } else if (!doc) { //查询不到用户名匹配信息，则用户名不存在
      res.send({code: 0,msg: '用户不存在！'});
    } else {
      doc.comparePassword(req.body.upwd, function(err, isMatch) {
        if (err) throw err;
        if (!isMatch) {
          res.send({code: 1,msg: '密码错误！'});
        } else {
          req.session.user = doc;
          res.send({code: 2,msg: '登录成功！'});
        }
      });
    }
  });
});

/* GET register page. */
router.route("/register").get(function(req, res) { // 到达此路径则渲染register文件，并传出title值供 register.html使用
  res.render("user/register", { title: 'User register' });
}).post(function(req, res) {
  //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
  var User = global.dbHandel.getModel('User');
  var uname = req.body.uname;
  var upwd = req.body.upwd;
  User.findOne({ username: uname }, function(err, doc) { // 同理 /login 路径的处理方式
    if (err) {
      res.send(500);
      console.log(err);
    } else if (doc) {
      res.send(500);
      console.log('用户名已存在！');
    } else {
      var u = new User({ // 创建一组user对象置入model
        username: uname,
        password: upwd
      });
      u.save(function(err, doc) {
        if (err) {
          res.send(500);
          console.log(err);
        } else {
          res.send(200);
        }
      });
    }
  });
});

/* GET logout page. */
router.get("/logout", function(req, res) { // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
  req.session.user = null;
  res.redirect("/");
});

module.exports = router;