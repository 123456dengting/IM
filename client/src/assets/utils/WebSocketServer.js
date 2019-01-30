export {
  WebSocketServer, //websocket类
  Message, //消息体类
  LiveMessage, //行为消息   
  OfflineMessage, //下线消息
  OnlineMessage, //上线消息       
}

import {
  EnumIdentity
} from "@/assets/utils/enum"
import {
  dataURLtoBlob,
  snederImgFormat,
  reciverImgFormat
} from "@/assets/utils/common";
/**
 * 封装WebSocketServer类
 * 
 */

class WebSocketServer {
  constructor(url, heartTime, identity) {
    this.socket = null;
    this.url = url;
    this.heartTime = heartTime * 1000;
    this.isDisconnect = false; //是否主动断开链接
    this.sendMsgList = [] //存储发送消息队列
    this.identity = identity; //买家 1  客服 2
    let self = this;
    this.heartCheck = {
      timeout: self.heartTime,
      timeoutObj: null,
      reset: function () {
        clearTimeout(this.timeoutObj);
        this.start();
      },
      start: function () {
        this.timeoutObj = setTimeout(function () {
          let heatMsg = new HeartMessage();
          self.send(heatMsg);
        }, this.timeout)
      }
    }
    this.createWebSocket(url)
  }
  createWebSocket(url) {
    this.socket = this.isSupportSocket(url);
    if (!this.socket) {
      console.log("您的浏览器不支持websocket协议,请您升级浏览器")
      return
    }
    //处理this指向WebSocket问题
    this.socket.onopen = this.onopen.bind(this);
    this.socket.onmessage = this.onmessage.bind(this);
    this.socket.onclose = this.onclose.bind(this);
    this.socket.onerror = this.onerror.bind(this);
  }

  /**
   * 判断是否支持WebSocKet协议
   * @param {*} url 建立链接的对象
   */
  isSupportSocket(url) {
    if ("WebSocket" in window) {
      return new WebSocket(url)
    } else {
      return false;
    }
  }

  /**
   * 发送消息处理,实例化对象之后需要重写
   * @param {*} msg 
   */

  sendbefor(msg) {
    return msg
  }

  /**
   * 接受消息先一步处理,实例化对象之后需要重写
   * @param {*} msg 
   */
  onresove(msg) {
    return msg
  }
  /**
   * 发送消息
   * @param {*} msg 消息数据,类型为object
   */
  send(msg) {
    msg = this.sendbefor(msg);
    if (typeof (msg) == "object") {
      msg = JSON.stringify(msg)
      this.socket.send(msg)
    } else {
      this.socket.send(msg)
    }
  }
  /**
   * 建立链接
   */
  onopen() {
    console.log("建立链接成功")
    //客服需要发心跳消息,买家不需要发心跳消息
    if (EnumIdentity.getItemFromText("客服").value == this.identity) {
      if (this.heartCheck.timeoutObj) {
        clearTimeout(this.heartCheck.timeoutObj)
      }
      this.heartCheck.start();
    }
    let OnMsg = new OnlineMessage()
    //打开连接自动发送上线消息
    this.send(OnMsg)
  }
  /**
   * 接受消息
   * @param {*} evt 后台返回的函数
   */
  onmessage(evt) {
    // console.log("接受消息",evt.data);
    if (EnumIdentity.getItemFromText("客服").value == this.identity) {
      this.heartCheck.reset();
    }
    return this.onresove(evt.data);
  }
  /**
   * 关闭连接
   */
  onclose() {
    if (this.isDisconnect) {
      console.log("主动断开链接")
      clearTimeout(this.heartCheck.timeoutObj);
    } else {
      console.log("异常断开链接")
      this.reconnection()
    }
  }
  /**
   * 链接失败
   */
  onerror() {
    console.log("链接失败")
  }
  /**
   * 断线重连
   */
  reconnection() {
    setTimeout(() => {
      this.createWebSocket(this.url);
    }, this.heartTime)
  }
  /**
   * 主动断开连接,下线.
   */
  disconnect() {
    let OffMsg = new OfflineMessage();
    this.send(OffMsg)
    this.isDisconnect = true;
    this.socket.close();
  }

  /**
   * 点击发送按钮
   * 除了文件之外的发送
   */
  IMSend(msg) {
    //格式化获取的HTML内容
    let msgArr = snederImgFormat(msg);
    //点击发送,输出到自己窗口的内容
    let sendArr = reciverImgFormat(msgArr[0].text).content;
    //为每次消息都使用统一的发送时间
    let time = new LiveMessage("text", "","").sendTime
    let imgArr = [];
    msgArr.forEach((item) => {
      let type = item.type;
      switch (type) {
        case "text":
          let inputMsg = new LiveMessage("text", item.text, time)
          this.send(inputMsg);
          break;
        case "image":
          imgArr.push(item);
          let byteArr = dataURLtoBlob(item.src, "byte");
          let filenameMsg = new LiveMessage("image", item.filename, time, byteArr.length);
          //发送文件名
          this.send(filenameMsg);
          break;
        default:
          break;
      }
    })
    sendArr.forEach((item) => {
      if (item.type == "image") {
        item.src = imgArr.shift().src
      }
    })
    return new LiveMessage("text", sendArr,time);
  }
}


/**
 * 消息格式
 *           
         "version":"1.0", //版本
         "sender":"10000", //发送人用户ID
         "receiver":"20000", //接收人用户ID
         "userType":"buyer"  //买加buyer,卖家seller
         "groupId":"", //群组ID
         "platfrom":"pc-windows", //发送平台：mobile-ios, mobile-android, pc-windows, pc-mac
         "cmd":"4", //请求命令： 1心跳 2上线 3下线 4消息
         "type":"",:"text", //消息类型：text:文本，image: 图片，file：文件，ack：消息确认，evaluate：				 评价 如果需要可以继续追加其它类型
         "content":"hello", //消息内容
         "fileSize":3234546  //文件大小
         "sendTime":"2018-12-17 12:12:12" //页面的发送时间

    //发送二进制图片的时候接受的消息格式
    {
     "version":"1.0",                       //版本
     "cmd":"4",                             //请求命令： 1心跳  2上线  3下线 4消息
     "sender":"10000",                      //发送人用户ID
     "receiver":"20000",                    //接收人用户ID
     "groupId":"",                          //群组ID
     "platfrom":"pc-windows",               //发送平台：mobile-ios, mobile-android, pc-windows, pc-mac
     "type":"text",                         //消息类型：text:文本，image: 图片，file：文件，ack：消息确认，read:已读 evaluate：评价   
     "content":"hello",                     //消息内容
     "fileSize":803781,                     //文件长度
     "startByte":0,                         //分片上传起始位置
     "stopByte":65536,                      //分片上传结束位置
     "complete":true,                       //是否上传完成
     "url":"",                              //文件的URL地址
     "sendTime":"2018-12-17 12:12:12"       //页面的发送时间
}

*/

/**
 * 消息类
 * 固定属性,进入页面初始化一次
 */
class Message {
  constructor() {}
  static __version;
  static __sender;
  static __receiver;
  static __groupId;
  static __platfrom;
  static __userType;
  getTime() {
    return new Date().getTime();
  }
}
/**
 * 用户,客服行为消息
 * @param type 消息类型
 * @param content 消息内容
 */
class LiveMessage extends Message {
  constructor(type, content, time = "", fileSize = "") {
    super()
    this.cmd = "4"
    this.version = Message.__version
    this.sender = Message.__sender
    this.receiver = Message.__receiver
    this.userType = Message.__userType
    this.groupId = Message.__groupId
    this.platfrom = Message.__platfrom
    this.sendTime = time ? time : this.getTime()
    this.type = type;
    this.content = content;
    if (fileSize) {
      this.fileSize = fileSize
    }
  }
}

/**
 * 心跳消息
 */
class HeartMessage extends Message {
  constructor() {
    super()
    this.cmd = "1"
    this.version = Message.__version
    this.sender = Message.__sender
    this.sendTime = this.getTime()
  }
}

/**
 * 上线消息
 */
class OnlineMessage extends Message {
  constructor() {
    super()
    this.cmd = "2"
    this.version = Message.__version
    this.sender = Message.__sender
    this.sendTime = this.getTime()
  }
}

/**
 * 下线消息
 */
class OfflineMessage extends Message {
  constructor() {
    super()
    this.cmd = "3"
    this.version = Message.__version
    this.sender = Message.__sender
    this.sendTime = this.getTime()
  }
}
