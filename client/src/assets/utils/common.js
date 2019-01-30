

export {
    caches,
    selectImage,    //将文件流转化为base64
    getBase64Image, //网络图像文件转Base64
    dataURLtoBlob,  //Base64字符串转二进制
    snederImgFormat,      //发送消息图片内容格式化
    reciverImgFormat,     //接受消息图片内容格式化
    senderEmojiFormat,          //发送表情格式化
    reciverEmojiFormat,         //接受表情格式化
    keepLastIndex,              //光标移至文本末尾
    getRangeAt,                 //获取光标位置
    showContentToSendContent,
    Base64,                     //字符串转base64,base64转字符串         
    isMac,                      //是否mac           
    getUser,     
    get2nToArr,                 //与运算的结果返回为数组    
    getArrTo2n,                 //数组进行与运算
}

//缓存统一出入口
const caches = {
    //添加缓存
    add(key, value) {
        localStorage[key] = value;
    },
    //获取缓存
    get(key) {
        return localStorage[key] || null;
    },
    //删除缓存
    remove(key) {
        localStorage.removeItem(key);
    }
}


//
/**
 * 日期格式化
 *   let newDate = new Date(); 或者  let newDate = new Date('时间戳');
 *   newDate =  newDate.Format("yyyy-MM-dd hh:mm:ss")   里面的字母不能换,符号任意
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds(), //毫秒
        //      "w":this.getDay()
    };
    var week = ["", "一", "二", "三", "四", "五", "六", "日"];
    //年
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    //星期  w  ww  
    if (/(w+)/i.test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? week[this.getDay()] : this.getDay());
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



/**
 * 将选中的文件转化为base64
 * @param {*} file 文件流
 * @param {*} fn 回调函数
 */
const selectImage = (file, fn) => {
	var reader = new FileReader();
	reader.onload  = (function(file){
		return function(e){
			fn(e.target.result)
		}
	})(file)
	reader.readAsDataURL(file);
}


/**
 * 网络图像文件转Base64
 * @param {*} img 
 */
const getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}
 

/**
 * Base64字符串转二进制
 * @param {*} dataurl  base64
 * @param {*} type     blob,byte  默认转化为blob, byte转化为二进制 
 * 返回指定类型的流或者二进制
 */
const  dataURLtoBlob = (dataurl,type = 'blob') => {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    if (type == "byte") {
        return u8arr;
    } else {
        return new Blob([u8arr], {
            type: mime
        });
    }
}



/**
 * 发送消息格式化,处理图片
 * @param {*} msg  String
 * 返回数组 Array
 */
const snederImgFormat = (msg) => {
    // msg = `12232131 <img src="aaa" filename="zhansgan"> 32132123 <img src="bbb" filename="dhsjffsd"> 21322`
    let b=/<img(.*?)>/gi,    //提取img标签内容
        r = /src="(.*?)"/gi,  //提取src内容
        n = /filename="(.*?)"/gi,  //提取filename内容
        imgArr = [],              //保存图片参数
        imgStr = ":|:<img>:|:",   //用来替换img标签
        imgLabel = "<img>",
        msgSplit = ":|:";         //用来分割消息内容
    let imgs = msg.match(b);
    if (!imgs) {
        return [{
                    text:msg,
                    type:"text"
                }]
    }
    msg = msg.replace(b,imgStr);
    imgArr.push({
        text:msg,
        type:"text"
    })
    let msgArr = msg.split(msgSplit);
    //获取img标签的filename属性和src属性
    imgs.forEach((item,index)=>{
      let src = item.match(r)[0];
      src = src.replace(/"/g, '').split("=")[1];
      let filename = item.match(n)[0];
      filename = filename.replace(/"/g, '').split("=")[1];
      imgArr.push({
        filename,
        src,
        type:"image"
      })
    })

    return imgArr;
  }


  /**
   * 接受消息格式化,处理图片
   * @param {*} msg  string
   * 返回值
   * {
   *    content:Array,
   *    type:  "text" : "image"
   * }
   */
  const reciverImgFormat = (msg) => {
        let imgStr = ":|:<img>:|:",   //用来替换img标签
        imgLabel = "<img>",
        msgSplit = ":|:";         //用来分割消息内容
        //如果不包含图片字符,直接返回字符串
        let isStr = msg.indexOf(imgStr);
        let msgArr = msg.split(msgSplit).filter(val => val);  
        msgArr = msgArr.map(item => {
            if (item == imgLabel) {
                item = { type:"image", src:"",}
            }else{
                item = { type:"text", text:item}
            }
            return item;
        })
        return {
            content:msgArr,
            type: isStr == -1 ? "text" : "image"
        }
  }



  
  /**
   * 将输入框的表情字符串格式化
   * @param {*} msg String
   * 返回格式化之后的字符串 String
   */
  const senderEmojiFormat = (msg)=>{
    let b=/<im-emoji(.*?)im-emoji>/gi,    //提取emoji标签内容
    n = /emojiindex="(.*?)"/gi,  //emojiindex内容
    emojiStr = "&|&<emoji>&|&",   //用来替换img标签
    emojiLabel = "<emoji>",
    emojiSplit = "&|&";         //用来分割消息内容
    
    
    let emojis = msg.match(b);
    if (!emojis) {
        return msg
    }
    let emojiIndexArr = []
    emojis.forEach((item,index)=>{
        let emojiIndex = item.match(n)[0];
        emojiIndex = emojiIndex.replace(/"/g, '').split("=")[1];
        emojiIndexArr.push(emojiIndex);
    })
    msg = msg.replace(b,emojiStr);
    
    let msgArr = msg.split(emojiSplit);
    msgArr = msgArr.map(item=>{
        if (item == emojiLabel) {
         let index =  emojiIndexArr.shift()  
         item = `<emoji emojiIndex=${index}>`   
        }
        return item;
    })

    return msgArr.join("");
  }

    /**
   * 接受表情格式化
   * @param {*} msg  Array
   * 返回值 Array
   */
  const reciverEmojiFormat = (arr)=>{
    let emojiStr = "&|&<emoji>&|&",
    emojiSplit = "&|&",         //用来分割消息内容
    b = /<emoji(.*?)>/gi,    //提取emoji标签内容
    n = /emojiIndex=(.*?)>/gi,  //emojiindex内容
    emojiIndexArr = [],
    msgContentArr = arr.slice();



    msgContentArr.forEach((item,index) => {
        if (item.type == "text") {
            let emojis = item.text.match(b);

            if (emojis) {
                emojis.forEach((t,index)=>{
                    let emojiIndex = t.match(n)[0].replace(">","");
                    emojiIndex = emojiIndex.replace(/"/g, '').split("=")[1];
                    emojiIndexArr.push(emojiIndex);
                })
            }
            item.text = item.text.replace(b,emojiStr);
            item.text = item.text.split(emojiSplit).filter(val => val);
            item.text = item.text.map(item => {
                if (item == '<emoji>') {
                     item = {
                        type:"emoji",
                        emojiIndex:emojiIndexArr.shift()
                     }    
                }else{
                    item = {
                        type:"test",
                        test:item
                    }
                }
                return item;
            })
        }
    })
    return msgContentArr;
  }



/**
 *   //光标移动到目标元素的末尾
 * @param {*} obj  一个dom元素对象
 */
const keepLastIndex = function (obj) {
    if (window.getSelection) { //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
    } else if (document.selection) { //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
    }
}


/**
 * 获取可编辑div光标位置
 * @param {*} obj  一个dom元素对象
 * 返回值中startOffset  endOffset 代表选中区域的起始位置和结束位置, 两个值相同代表光标位置
 */
const getRangeAt = function (obj){
    let nodes = obj.childNodes;
    if (window.getSelection) { //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        let target = range.focusNode;
        if (range.focusNode.parentNode != obj) {
            target = range.focusNode.parentNode;
        }
        let targetSelection = range.getRangeAt(0);    //点击的子节点光标位置,相对于子节点
        let len = 0;
        //解决可编辑div中含有标签元素的时候光标定位不准问题
        for (let index = 0; index < nodes.length; index++) {
            let item = nodes[index];
            if(target != item){
               //当点击的node不等于循环的node的时候
               if (item.tagName) {
                   //如果item是标签
                   len += item.outerHTML.trim().length;
               }else if(item.nodeName == "#text"){
                   //如果item是纯文本
                   len += item.data.trim().length
               }
            }else{
                //当点击的node等于循环的node的时候
               if (item.tagName) {
                   //如果item是标签
                   len += item.tagName.length;
               }else if(item.nodeName == "#text"){
                   //如果item是纯文本
               }
               break;
            }
            
        }
        let selectCus = {
            startOffset:targetSelection.startOffset + len,
            endOffset:targetSelection.endOffset + len
        }
        return  selectCus
    }else{
        //暂不支持
    }
}


/**
 * 重传的时候将显示在聊天框的消息,转化为发送给后台的消息
 * @param {*} content 
 */
const showContentToSendContent = function (content){
    let str = ""
    if (Array.isArray(content)) {
        content.forEach(item => {
            if (item.type == "text") {
                //文本消息(文字,表情,图片占位符)
                item.text.forEach((temp)=>{
                    if (temp.type == "test") {
                        str += temp.test
                    }
                    if (temp.type == "emoji") {
                        str += `<emoji emojiIndex=${temo.emojiIndex}>`
                    }
                })
            }else{
                //图片信息
                str += ":|:<img>:|:"
            }
        })
    }else if(typeof content == "string"){
        str = content;
    }
    return str;
}

//字符串和base64互转  
/**
 * let base64 = new Base64()
 * let str64 = base64.encode(str)
 * let str  =  base64.decode(str64)
 * 
 */
const Base64 = function () {  
   
    // private property  
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
    var _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  
   
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
    var _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c , c1 , c2;
        c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                var c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}


/** * 是否为mac系统（包含iphone手机） * */ 
const isMac = function() { 
    return /macintosh|mac os x/i.test(navigator.userAgent); 
}

/** * 是否为windows系统 * */
const isWindows = function() { 
    return /windows|win32/i.test(navigator.userAgent);
}

//获取用户信息
let userInfo;
const getUser = () => {
    if (!userInfo) {
        userInfo = caches.get("UserInfo") ? JSON.parse(caches.get("UserInfo")) : false;
    }
    return userInfo;
}

//与运算的2的n次方拆分为数组
const get2nToArr = (n) => {
    let isNumber = typeof n == "number" ? true : false
    n = Number(n);
    let arr = [],t;
    for (let index = 0; index < 32; index++) {
       t = Math.pow(2,index)
       if ( t & n) {
           if (isNumber) {
            arr.push(t)
           }else{
            arr.push(t.toString())
           }
           
       }
    }
    return arr;
}


//数组进行与运算
const getArrTo2n = (arr) => {
    let t;
    arr.forEach(item => {
        t = t | Number(item);
    })
    return t;
}



let  arr = []

let t = 1 < arr[0].off;

console.log("ttt",t)
