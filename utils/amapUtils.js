var amap_key = "51b10334da8ea31c464248853813e945";
var apiUtils = require("./apicloudUtils");
var client = apiUtils.client;
var superagent = require('superagent');
var amap = {};
amap.getAmapPios = function(city,page,type,callback)
{

  var keywords = '';
    switch(type)
    {
      case 'hospital':
        keywords = '医院';break;
      case 'shop':
        keywords = '便利店';break;
      case 'restaurants':
        keywords = '餐厅';break;
      case 'hotel':
        keywords = '酒店';break;
      case 'movie':
        keywords = '电影院';break;
      case 'ktv':
        keywords = 'ktv';break;
      case 'agritainmen':
        keywords = '农家乐';break;
      case 'tea':
        keywords = '茶楼';break;
      case 'pedicure':
        keywords = '足疗';break;
      case 'cosmetology':
        keywords = '美容';break;
      case 'photostudio':
        keywords = '影楼';break;
      default:
        keywords = 'fffffffffffffffffffffff';
        console.log(type);
        type ='error';
    }
    var url = "http://restapi.amap.com/v3/place/text?key="+amap_key+"&keywords="+keywords+"&city="+city+"&page="+page;

    superagent.get(url)
    .end(function (err, sres) {
      if (err) {
        console.log("error");
        return 'error';
      }
      //处理json
      var items = eval("("+sres.text+")");
      console.log(items);
      if(items.status != 1)
        return;

      var pios = items.pois;
      for(var i=0;i<pios.length;i++)
      {
        savePio(pios[i],city,type);
      }
      if( page*20 < items.count )
      {
        amap.getAmapPios(city,++page,type,callback);
      }
      else
      {
        callback('ok');
      }
    });
}

savePio = function(item,city,type)
{
    var model = client.Factory("local_server");
      model.count({"filter":{"udid":item['id']}},function (ret,err) {
        var location = item['location'].split(',');

         var data = {
            "udid":item['id'],
            "name":item['name'],
            "type":item['type'],
            "address":item['address'],
            "location":{"lng":location[0],"lat":location[1]},
            "tel":item['tel'],
            "dataType":type,
            "city":city
         };
         console.log(ret);
         if(undefined == ret)
          return;
         if( 0 == ret.count )
         {
          console.log(data);
          model.save(data,function(ret,err){

          });
         }
      });
}

module.exports = amap;
