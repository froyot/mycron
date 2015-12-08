var express = require('express');
var router = express.Router();

var superagent = require('superagent');
var cheerio = require('cheerio');
var Resource=require("APICloud").Resource;
var client = new Resource("A6966833672975", "2E50D9D3-9063-E9B5-F3B9-065418CF2432");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cron list' });
});

//抓取当地新闻
router.get('/news', function(req, res, next) {
  // res.render('index', { title: 'cron news' });
  //deviceid = 3ccf96be431e38d659ff7cdf334cc8a9;
  var start = 0;
  var page = 1;
  var url = "http://j.news.163.com/hy/newshot.s?deviceid=3ccf96be431e38d659ff7cdf334cc8a9&newchannel=news&channel=10&city="+req.query.city+"&offset="+(start*page)+"&limit=10";
  var model = client.Factory("news");
console.log(url);
  superagent.get(url)
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }

      //处理json
      var news = eval("("+sres.text+")");
      var handelNews = [];
      for(var i=0;i<news.length;i++)
      {
        var item = {
            "title":news[i]['title'],
            "url":"http://j.news.163.com"+news[i]['url_163'],
            "summary":news[i]['summary'],
            "udid":news[i]['simhash']
         }
        model.count({"filter":{"udid":news[i]['simhash']}},function (ret,err) {
            console.log(ret.count);
           if( 0 == ret.count )
           {

            model.save(item,function(ret,err){
                console.log("Model update:"+JSON.stringify(ret));
            });
           }
        });
        handelNews.push(item);
      }
      // var $ = cheerio.load(sres.text);
      // console.log(sres.text);
      // var items = [];
      // $('#linkcat-2 li').each(function (k, v) {
      //   var c = $(this).children();
      //   items.push({
      //     title: c.text(),//c.html(),
      //     href: c.attr('href')
      //   });
      // });

      res.send(handelNews);
    });

});

module.exports = router;
