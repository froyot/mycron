var express = require('express');
var router = express.Router();
var testNum = 1;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cron list' });
});


//抓取当地新闻
router.get('/news', function(req, res, next) {

 var cityList = {
    "chenzhou":"郴州"
  }


  var news = require('../utils/news');
  news.getNews(cityList[req.query.city], req.query.city,1,function(data){
res.send(data);
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


//获取医院信息
router.get('/hospital', function(req, res, next) {

  var location = require('../utils/location');
  location.getHospital(req.query.city,function(data){
    res.send(data)
  });
  // res.render('index', { title: 'cron news' });
  //deviceid = 3ccf96be431e38d659ff7cdf334cc8a9;


});

//获取医院信息
router.get('/shop', function(req, res, next) {

  var location = require('../utils/location');
  location.getShop(req.query.city,function(data){
    res.send(data)
  });
  // res.render('index', { title: 'cron news' });
  //deviceid = 3ccf96be431e38d659ff7cdf334cc8a9;

});

router.get('/movie', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'movie',function(data){
    res.send(data)
  });


});

router.get('/hotel', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'hotel',function(data){
    res.send(data)
  });

  //deviceid = 3ccf96be431e38d659ff7cdf334cc8a9;

});

router.get('/restaurants', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'restaurants',function(data){
    res.send(data)
  });


});

router.get('/ktv', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'ktv',function(data){
    res.send(data)
  });


});

router.get('/agritainmen', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'agritainmen',function(data){
    res.send(data)
  });
});

router.get('/tea', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'tea',function(data){
    res.send(data)
  });
});
router.get('/cosmetology', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'cosmetology',function(data){
    res.send(data)
  });
});

router.get('/photostudio', function(req, res, next) {

  var location = require('../utils/location');
  location.getPio(req.query.city,'photostudio',function(data){
    res.send(data)
  });
});
router.get('/allk', function(req, res, next) {

  var location = require('../utils/location');

  location.getPio(req.query.city,'pedicure',function(data){
    res.send(data)
  });
});



//获取所有,活动，新闻，每日更新
router.get('/allData', function(req, res, next) {

  var cityList = {
    "chenzhou":"郴州"
  }


  var news = require('../utils/news');
  news.getNews(cityList[req.query.city], req.query.city,1,function(data){

  });

  var act = require('../utils/act');
  act.getActs(req.query.city,function(data){

  });
  res.send("ok");
});

module.exports = router;
