

import Vue from 'vue';

//自定义时间过滤器
Vue.filter('format', function (val, fmt) {
    if (!val) {
        return "";
    }
    var test = val;
    var val = new Date(val);
    var o = {
        "M+": val.getMonth() + 1, //月份 
        "d+": val.getDate(), //日 
        "h+": val.getHours(), //小时 
        "m+": val.getMinutes(), //分 
        "s+": val.getSeconds(), //秒 
        "q+": Math.floor((val.getMonth() + 3) / 3), //季度 
        "S": val.getMilliseconds(), //毫秒
        //      "w":this.getDay()
    };
    var week = ["", "一", "二", "三", "四", "五", "六", "日"];
    //年
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (val.getFullYear() + "").substr(4 - RegExp.$1.length));
    //星期  w  ww  
    if (/(w+)/i.test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? week[val.getDay()] : val.getDay());
    for (var k in o) {
        if (o[k] + "" == "NaN") {
            return test;
        }
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt
})

