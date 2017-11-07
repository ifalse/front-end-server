var express = require('express');
var fs = require("fs");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var data = fs.readFileSync('./public/static/html/index.html');
	res.render('test', {
		textHtml: data.toString(),
		title:'我的标题111'
	});
});
module.exports = router;