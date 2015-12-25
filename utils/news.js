var superagent = require('superagent');
var cheerio = require('cheerio');

var Resource=require("APICloud").Resource;
var client = new Resource("A6966833672975", "2E50D9D3-9063-E9B5-F3B9-065418CF2432");

var news = {};
var banner_count = 0;

// news.getFrontPage = function(city,totalPage,callback)
// {

//   var handelNews = [];
//   for(var i=1;i<=totalPage;i++){
//     news.getNews(city,i,function(data){
//       handelNews.concat(data);
//       if( i == totalPage )
//       {
//         callback(handelNews);
//       }
//     });
//   }
// }
news.getNews = function(city, cityuid, page, callback)
{


  var start = 0;

  var url = "http://j.news.163.com/hy/newshot.s?deviceid=3ccf96be431e38d659ff7cdf334cc8a9&newchannel=news&channel=10&city="+city+"&offset="+(start*page)+"&limit=40";

  superagent.get(url)
    .end(function (err, sres) {
      if (err) {
        return ;
      }

      //处理json
      var news = eval("("+sres.text+")");
      var handelNews = [];

      for(var i=0;i<news.length;i++)
      {
        var item = {
                "title":news[i]['title'],
                "source":"http://j.news.163.com"+news[i]['url_163'],
                "summary":news[i]['summary'],
                "udid":news[i]['simhash'],
                "from":news[i]['source'],
                "publisTime":news[i]['publish_time'],
                "city":cityuid
        }
        if( undefined != news[i]['pic_url'] )
        {
          var pics = eval("("+news[i]['pic_url']+")");
          var myPics = [];
          for(var t=0;t<pics.length;t++)
          {
            myPics.push({
              "url":pics[t]['url']
            });

          }
          if(myPics.length >0 )
          {
            item['img'] = myPics[0]['url'];
            item['pics'] = myPics;
          }

        }
        handelNews.push(item);
        sendToData(item);
      }
      callback(handelNews);
    });
}
function sendToData(item)
{
  var model = client.Factory("news");
  model.count({"filter":{"udid":item['udid']}},function (ret,err) {
              // console.log(ret.count);
             if( 0 == ret.count )
             {
              model.save(item,function(ret,err){
                  if(undefined == ret || !("id" in ret))
                  {
                    return;
                  }
                  saveBanner(ret,"news");
                //console.log(ret);
                  getContent(ret.id, ret.source);
                  // console.log("Model update:"+JSON.stringify(ret));
              });
             }
  });
}

function saveBanner(mod,type)
{

  if(!mod["img"])
  {
    return false;
  }
  if(banner_count == 3)
    return;
  banner_count++;
  var model = client.Factory("banner");
  model.count({"filter":{"model_id":mod['id'],"model":"news"}},function (ret,err) {
              // console.log(ret.count);
             if( 0 == ret.count )
             {
              var item = {"name":mod.title,"img":mod["img"],"model":"news","model_id":mod["id"],"city":mod['city']};
              // console.log(item);
              model.save(item,function(ret,err){
                  if(undefined == ret || !("id" in ret))
                  {
                    return;
                  }

             });
            }
  });
}

function getContent(id, url)
{
  var model = client.Factory("news");

  superagent.get(url)
    .end(function (err, sres) {
      if (err)
      {
        return ;//console.log(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      var content = $('.endText').first().html();
      model.save({"_id":id}, {"content":content},function(ret,err){
                  // console.log("Model update:"+JSON.stringify(ret));
      });
    });
}


module.exports = news;
