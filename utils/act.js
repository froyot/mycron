var superagent = require('superagent');
var cheerio = require('cheerio');

var apiUtils = require("./apicloudUtils");
var client = apiUtils.client;

var act = {};
act.city = "chenzhou";
act.baseUrl = "http://www.meituan.com";

act.getActs = function(city,callback){
    act.city = city;
    act.baseUrl = "http://"+act.city+".meituan.com/";
    getTopAct(callback);
}


function getTopAct(callback)
{
    var acts = [];
    console.log(act.baseUrl);
    superagent.get(act.baseUrl)
    .end(function (err, sres) {
      if (err)
      {
        return ;//console.log(err);
      }

      var $ = cheerio.load(sres.text);


      $('.choice__item').each(function (k,item) {

            var img = $(this).find('.img').attr('src');
            var title = $(this).find('.xtitle').text();
            var source = $(this).find('.xtitle').attr('href');
            var desc = $(this).find('.desc').text();

             var urlReg=/http:\/\/.*deal\/(\d+)\.html/i;
            var r = source.match(urlReg);
            if( r )
            {
                source = "http://i.meituan.com/deal/"+r[1]+".html";
            }

            var item = {
                "img":img,
                "title":title,
                "source":source,
                "summary":desc,
                "city":act.city
            };
            acts.push(item);
            saveToData(item);
      });
      console.log("time");
      callback(acts);
  });
}


function saveToData(item)
{
  var model = client.Factory("activity");
  model.count({"filter":{"source":item['source']}},function (ret,err) {
              // console.log(ret.count);
     if( 0 == ret.count )
     {
      model.save(item,function(ret,err){
        // console.log(ret);
          getContent(ret.id, ret.source);
          // console.log("Model update:"+JSON.stringify(ret));
      });
     }
  });
}

function getContent(id, url)
{
  // i.meituan.com/deal/32990943.html
  var model = client.Factory("activity");

  superagent.get(url)
    .end(function (err, sres) {
      if (err)
      {
        return ;//console.log(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      var content = $('#deal-details').html()+$('#deal-terms').html();
      var address = $('.address').text();
      model.save({"_id":id}, {"intro":content,"address":address},function(ret,err){
                  // console.log("Model update:"+JSON.stringify(ret));
      });
    });
}

//anchor-bizinfo

module.exports = act;
