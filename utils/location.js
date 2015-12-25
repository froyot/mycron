/**
 * 获取本地生活
 * @type {Object}
 */

var amap = require("./amapUtils");

var location = {};



location.getHospital = function(city,callback)
{
    amap.getAmapPios(city,1,'hospital',callback);
}

location.getShop = function(city,callback)
{
    amap.getAmapPios(city,1,'shop',callback);
}

location.getPio = function(city,type,callback)
{
    amap.getAmapPios(city,1,type,callback);
}
module.exports = location;
