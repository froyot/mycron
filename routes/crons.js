var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cron list' });
});


//抓取当地新闻
router.get('/news', function(req, res, next) {

  var news = require('../utils/news');
  news.getNews(req.query.city, 1,function(data){
    res.send(data)
  });
  // res.render('index', { title: 'cron news' });
  //deviceid = 3ccf96be431e38d659ff7cdf334cc8a9;


});

//获取活动
router.get('/act', function(req, res, next) {

  var act = require('../utils/act');
  act.getActs(req.query.city,function(data){
    res.send(data)
  });
  // res.render('index', { title: 'cron news' });
  //deviceid = 3ccf96be431e38d659ff7cdf334cc8a9;


});


module.exports = router;
