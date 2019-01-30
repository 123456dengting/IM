<template>
  <div class="im-chat-win">
    <!-- 聊天窗头部信息 -->
    <div class="im-chat-head">
        <div class="im-user" v-if="reciverInfo">
              <div class="im-user-left im-floatleft">
                <img class="im-head-img" v-lazy="reciverInfo.head_img" :key="reciverInfo.head_img">
              </div> 
              <div class="im-user-right im-floatright">
                <div>
                    <span class="im-name">{{reciverInfo.name}}</span>
                    <span class="im-tip-color">({{reciverInfo.adder}})</span>
                </div>
              </div> 
          </div>
          <a href="###" class="im-floatright" @click="closeWebsocket">{{ ws ? "结束服务" : "建立链接"}}</a>
          <Select class="select-item im-floatright im-transfer"   placeholder="转接客服" >
            <Option v-for="(item,t) in customerArr" :value="customerArrVal" :key="t">{{ item.text }}</Option>
          </Select>
    </div>
    <!-- 显示消息 -->
    <div class="im-chat-msg im-scorllY" :style="{ 'font-size': `${showMsgSize}px`  }">
      <div v-for="(msg,index) in msgList" :key="index"  class="chat-image-box">
          <!-- 消息归属头像 -->
          <div class="im-msg-head" :class="msg.sender == chatOption.sender ? 'im-floatright' : 'im-floatleft' ">
              <img class="im-msg-head-img" v-lazy="reciverInfo.head_img" :key="reciverInfo.head_img">
          </div>
          <div >
              <!-- 发送时间 -->
              <div class="im-chat-time im-tip-color" :class="msg.sender == chatOption.sender ? 'im-floatright' : 'im-floatleft' ">
                <p >{{msg.sendTime ?  msg.sendTime : new Date().getTime() | format('yy-MM-dd hh:mm:ss')}}</p>
              </div>
              <!-- 消息内同 -->
              <div :class="msg.sender == chatOption.sender ? 'im-self-msg' : 'im-other-msg' ">
                  <span v-if="msg.state == 0" class="im-resend" @click="reSend(msg,index)">重传</span>
                  <!-- 文字.图片.表情 -->
                  <div class="im-chat-content" v-if="msg.type == 'text'" v-for="content in msg.content" >
                    <span v-if="content.type == 'text'" v-for="(t,i) in content.text" :key="i">
                      <span v-if="t.type == 'test'" v-html="t.test"></span>
                      <emojiItem v-if="t.type == 'emoji'" :emojiIndex="Number(t.emojiIndex)" :emojiSize="showMsgSize" ></emojiItem>
                    </span>
                    <img style="margin: 0 5px;" v-if="content.type == 'image'" :src="content.src"  />
                  </div>
                  <!-- 文件 -->
                  <div v-if="msg.type == 'file'" class="im-file">
                        <div> 
                          <img class="im-file-img" :src="fileLogo" alt="">
                          <p class="im-file-download" >{{msg.content}} <a class="im-file-download" :href="msg.url"  download="" v-if="msg.sender != chatOption.sender" >下载</a></p>  
                        </div>
                        <div class="im-progress-box" v-if="msg.sender == chatOption.sender &&　msg.progress != undefined">
                            <div class="im-progress-num">{{msg.progress}}</div>
                            <div class="im-progress" :style="{width:msg.progress}"></div>
                        </div>             
                  </div>
                </div>
            </div>
          </div>
          
    </div>
    <!-- 编辑区域 -->
    <div class="im-chat-edit">
      <div class="im-chat-type">
        <!-- 选择表情 -->
        <imEmojiSelect @change="changeEmoji"  :emojiSize="emojiSize" @click.native="openMore('emoji')"></imEmojiSelect>
        <!-- 选择图片 -->
        <input type="file" :accept="accept" id="im-files" value="" @change="changeFile">
        <Button type="default" size="large" shape="circle" class="im-chat-input-type" icon="ios-image-outline"  @click="openMore('image')"></Button>
        <Button type="default" size="large" shape="circle" class="im-chat-input-type" icon="ios-folder-open-outline" @click="openMore('file')"></Button>
        <Button type="default" size="large" shape="circle" class="im-chat-input-type" icon="ios-thumbs-up-outline" @click="openMore('')"></Button>
        <div class="im-history im-floatright" @click="onHistory">消息记录</div>
        <Button type="default" size="large" shape="circle"  @click="onHistory" class="im-chat-input-type im-floatright" icon="ios-thumbs-up-outline"></Button>
      </div>
      <div class="im-chat-input" contenteditable="true" :id="chatInputId"  ></div>
      <div class="im-send">
        <!-- <imEmojiItem :emojiOptions="emojiOptions"></imEmojiItem> -->
        <Button class="im-floatright" type="primary" :disabled="!ws"  @click="sendMsg">发送</Button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  selectImage,
  dataURLtoBlob,
  reciverImgFormat,
  senderEmojiFormat,
  reciverEmojiFormat,
  keepLastIndex,
  getRangeAt,
  showContentToSendContent,
  isMac,
  getUser,
} from "@/assets/utils/common";
import { webSocketHost, heartTime } from "@/assets/utils/config";
import {
  WebSocketServer,
  Message,
  LiveMessage
} from "@/assets/utils/WebSocketServer";
import { EnumIdentity } from "@/assets/utils/enum";
import { VMmessage } from "@/assets/utils/message.js";
import { login } from "@/assets/utils/ajax.js";
import imEmojiSelect from "@/components/imEmojiSelect";
import emojiItem from "@/components/emojiItem";
import Emoji from "@/assets/utils/emoji";
import fileLogo from "@/assets/images/zip.png";
import { setTimeout, setInterval, clearInterval, clearTimeout } from "timers";
import Bus from "@/assets/utils/eventBus";
import { getConversation, getMessage, getCustomer, getOnLineCustomer } from "@/assets/utils/ajax";

// window.onbeforeunload = onbeforeunload_handler;
// function onbeforeunload_handler() {
// }

export default {
  name: "chat",
  props: {
    /**
     *  @param sender     //用户ID
     *  @param receiver   //聊天对方ID
     *  @param identity   //用户类型 根据 EnumIdentity 枚举取值
     */
    chatOption: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      userInfo:"",
      version: "1.1.1",
      groupId: "100",
      platfrom: "pc-windows",
      emojiSize: 35,
      showMsgSize: 21, //展示消息区域,文字大小
      chatInputId: "im-chat-input",
      ws: null,
      msgList: [],  //待确认的消息
      ackMsgList: [], //已确认的消息
      allMsgList: [], //展示区的消息
      isByte: false, //是否用二进制传输
      InputEle: null, //输入文字标签
      fileByte: null, //保存选择的图片二进制
      fileLogo: fileLogo,
      setReSendTime:2000,   //失败重传时间
      reciverInfo:"",
      customerArrVal:"1",
      isService:false,    //是否是客服
      customerArr:[
        {
          text:"客服1",
          value:"1"
        },
        {
          text:"客服2",
          value:"2"
        },
        {
          text:"客服3",
          value:"3"
        }
      ],
      accept:"image/*"
    };
  },
  created(){
    this.isService = EnumIdentity.getItemFromText("客服").value == this.chatOption.identity;
    //接收方信息
    let self = this;
    Bus.$on("changeUser",(info)=>{
      self.reciverInfo = info;
    });
    //监听 ctrl+enter
    document.onkeydown = function(e)
		{
			var e = window.e || e;
			if (e.keyCode == 13 && e.ctrlKey) {
				self.sendMsg();
			}
		}
  },
  mounted() {
    this.userInfo = getUser()
    //初始化建立连接
    this.init();
    //获取输入区域元素
    this.InputEle = document.getElementById(this.chatInputId);
    //获取转交客服
    this.getCustomer();
    //显示光标
    keepLastIndex(this.InputEle);

  },
  methods: {
    init() {
      //初始化消息类固定属性
      Message.__version = this.version;
      Message.__sender = this.chatOption.sender;
      Message.__receiver = this.chatOption.receiver;
      Message.__groupId = this.groupId;
      Message.__platfrom =  isMac() ? "pc-mac" : "pc-windows";
      Message.__userType = this.isService ?　'seller' : 'buyer';
      //创建websocket对象
      this.ws = new WebSocketServer(
        webSocketHost,
        heartTime,
        this.chatOption.identity
      );
      //重写消息处理方法
      this.ws.onresove = this.onresoveMsg;
      //重写消息发送之前的处理方法
      this.ws.sendbefor = this.onsendbefor;
    },
    async getCustomer(){
      let data = {
        merchantId:1
      }
      let res = await getCustomer(data)
      console.log("res",res);
    },
    //点击消息重传
    reSend(msg,index){
      this.msgList.splice(index,1);
      if (msg.type == "file") {
          let fileMsg = new LiveMessage(
            "file",
            msg.content,
            null,
            this.fileByte.length
          );
          this.ws.send(fileMsg);
          fileMsg.progress = "0%";
          let awaitTime = Math.ceil( this.fileByte.length /  ( 1024 * 1024))
          this.setReSendParam(fileMsg,awaitTime*1000)
          this.msgList.push(fileMsg);
          return;
      }
      msg = this.setReSendParam(msg,this.setReSendTime);
      let content = showContentToSendContent(msg.content);
      let sendMsg = new LiveMessage("text",content)
      this.ws.send(sendMsg);
      msg.sendTime = sendMsg.sendTime
      this.msgList.push(msg);

      if (content.indexOf(":|:<img>:|:") > -1) {
        //重传文件
        if (this.fileByte) {
          let filenameMsg = new LiveMessage("image", this.filename, null, this.fileByte.length);
          this.ws.send(filenameMsg);
        }
      }
    },
    //设置失败重传参数
    setReSendParam(msg,time = 2000){
      let isFile = false;
      if (Array.isArray(msg.content)) {
        msg.content.forEach(item => {
          if (item.type == "image" || item.type == "file") {
              isFile = true;
          }
        })
      }else{
        //传文件
        isFile = true;
      }
      msg.isFile = isFile;
      msg.state = 1;
      msg.timeOut = setTimeout(()=>{
        msg.state = 0;
      },time)
      return msg;
    },
    //点击发送消息
    sendMsg() {
      let msg = this.InputEle.innerHTML;
      if (msg.trim() == "") {
        return;
      }
      //转码表情
      msg = senderEmojiFormat(msg);
      //解析图片,并发送,返回展示到发送者页面的内容数组
      let msgItem = this.ws.IMSend(msg);
      //解析表情,输出到发送者聊天记录
      msgItem.content = reciverEmojiFormat(msgItem.content);
      //设置失败重传时间参数
      msgItem = this.setReSendParam(msgItem,this.setReSendTime);
      this.msgList.push(msgItem);
      this.InputEle.innerHTML = "";
    },
    //选择表情
    changeEmoji(index) {
      let emoji = new Emoji(index, 18);
      this.onappendChild(this.InputEle, this.selection, emoji);
    },
    //点击结束服务
    closeWebsocket() {
      if (this.ws) {
        this.ws.disconnect();
        this.ws = null;
      } else {
        this.init();
      }
    },
    //点击表情,图片文件按钮
    openMore(type) {
      //获取光标位置
      this.selection = getRangeAt(this.InputEle);
      if (type == "file") {
        this.accept = "application/msexcel,application/msword,application/pdf,.zip,.rar"
        setTimeout(()=>{
          document.getElementById("im-files").click();
        },10)
      }else if(type == "image"){ 
        this.accept = "image/*"
        setTimeout(()=>{
          document.getElementById("im-files").click();
        },10)
      }
    },
    //选择文件
    changeFile(e) {
      let files = e.target.files[0];
      this.filename = files.name;
      selectImage(files, res => {
        this.fileByte = dataURLtoBlob(res, "byte");
        let type = files.type ? files.type.split("/")[1] : "";
        let imgReg = /png|jpg|jpeg|gif/gi;
        if (type.match(imgReg)) {
          let imgStr = `<img style="width:150px;margin:0 5px;" filename="${files.name}" src=${res}>`;
          this.onappendChild(this.InputEle, this.selection, imgStr);
        } else {
          let fileMsg = new LiveMessage(
            "file",
            files.name,
            null,
            this.fileByte.length
          );
          this.ws.send(fileMsg);
          fileMsg.progress = "0%";
          let awaitTime = Math.ceil( this.fileByte.length /  ( 1024 * 1024))
          this.setReSendParam(fileMsg,awaitTime*1000)
          this.msgList.push(fileMsg);
        }
      });
    },
    onHistory(){
      Bus.$emit('openHistory',"消息历史记录")
    },
    //在元素的指定位置插入特性的内容;
    /***
     * @param ele 容器元素
     * @param param 参数,包含开始位置,结束位置
     * @param content html元素或者字符串
     */
    onappendChild(ele, param, content) {
      let start = 0,
        end = 0;
      if (param && (param.startOffset || param.endOffset)) {
        start = param.startOffset;
        end = param.endOffset;
      }
      let text = ele.innerHTML;
      if (typeof content == "string") {
        ele.innerHTML =
          text.slice(0, start) + content + text.slice(end, text.length);
      }
      if (content.tagName) {
        //如果传入的是标签
        ele.innerHTML = text.slice(0, start);
        ele.appendChild(content);
        ele.innerHTML = ele.innerHTML + text.slice(end, text.length);
      }
      //把光标设置在文本区域的末尾
      keepLastIndex(ele);
      this.selection = null;
    },
    //重写方法,处理消息
    onresoveMsg(msg) {
      if (msg instanceof Blob) {
        //如果接受到的是二进制流,把图片地址替换
        this.msgList[this.msgList.length - 1].content.forEach(item => {
          if (item.type == "image") {
            selectImage(msg, res => {
              item.src = res;
            });
          }
        });
        return;
      }
      try {
        msg = JSON.parse(msg);
        let cmd = msg.cmd;
        switch (cmd) {
          case "1":
            console.log("确认心跳");
            break;
          case "2":
            console.log("上线");
            break;
          case "3":
            console.log("下线");
            this.ws.disconnect();
            break;
          case "4":
            //处理数据
            this.resoveLiveMessage(msg);
            break;
          default:
            if (msg.type == "ack") {
              //确认消息
              this.ackMsg(msg)
            }
            break;
        }
      } catch (error) {
        console.log("消息处理出错",error);
      }
    },
    ackMsg(msg,ackType){
      let len = this.msgList.length;
      for (let i = 0; i < len; i++) {
            let item = this.msgList[i];
            if ((item.sendTime == msg.sendTime) && !item.isFile) {
                clearTimeout(this.msgList[i].timeOut);
                break;
            }
            if (item.isFile && ackType) {
                clearTimeout(this.msgList[i].timeOut);
                break;
            }  
      }
    },
    //处理后台正常返回的数据消息
    resoveLiveMessage(msg) {
      if (msg.type == "text") {
        msg.content = reciverImgFormat(msg.content);
        msg.content = reciverEmojiFormat(msg.content.content);
        this.msgList.push(msg);
      } 
      if (msg.type == "image" || msg.type == "file") {
        //返回值格式  {"stopByte":42252,"fileSize":42252,"startByte":0,"cmd":"4","complete":false,"type":"image"}
        if (!msg.complete) {
          if (this.fileByte) {
            let sendByte = this.fileByte.slice(msg.startByte, msg.stopByte);
            this.ws.socket.send(sendByte);

          //计算进度条,如果全部传完,显示99%,待收到确认的时候再显示100%;
          if (msg.type == "file") {
              let pros = (msg.stopByte / this.fileByte.length * 100).toFixed(0);
              this.msgList[this.msgList.length - 1].progress =
                (pros >= 100 ? 99 : pros) + "%";
            }
          }
        } else {
          //图片和文件确认
          this.fileByte = false;
          this.ackMsg(msg,1)
          if (msg.type == "file") {
            if (msg.sender) {
              //接收方
              this.msgList.push(msg);
            } else {
              //发送方收到确认完成
              setTimeout(() => {
                this.msgList[this.msgList.length - 1].progress = "100%";
              }, 10);
            }
          }
        }
      }
    },
    //重写方法
    onsendbefor(msg) {
      if (typeof msg == "object") {
      }
      console.log("发送:", msg);
      return msg;
    }
  },

  components: {
    imEmojiSelect,
    emojiItem
  }
};
</script>
<style lang="less" scoped>
@import "../assets/theme/index.less";
#im-files {
  width: 0;
  height: 0;
  opacity: 0;
}
.im-chat-win {
  height: 100%;
  background-color: @chatwindow-bgc;
  // background-color: #f5f7f9;
  box-sizing: border-box;
  .im-chat-head {
    box-sizing: border-box;
    padding: 5px;
    height: 40px;
    border: 1px solid 1px solid rgba(238,238,238,1);
    line-height: 30px;
    .im-transfer{
      margin-top: -2px;
      margin-right: 10px; 
    }
    .im-user{
        height: 100%;
        display: inline-block;
        box-sizing: border-box; 
        .im-user-left{
          height: 100%;
          box-sizing: border-box;
          margin-right: 10px;
          margin-left: 20px;
          .im-head-img{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid #e2dede;
          }
        }
        .im-user-right{
          line-height: 30px;
          height: 100%;
          font-size: 12px;
          .im-name{
            font-size: 14px;
            display:inline-block;
            margin-bottom: 8px;
          }
        }
      }
  }
  .im-chat-msg {
    height: 70%;
    // overflow-y: auto;
    border-bottom: 1px solid #e2e2e2;
    .im-chat-time {
      width: 50%;
      font-size: 1rem;
    }
    .chat-image-box {
      overflow: hidden;
      width: 100%;
      .im-msg-head{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin: 20px;
        .im-msg-head-img{
          width: 60px;
          height: 60px;
        }
      }
      .im-chat-content{
        word-wrap: break-word
      }
      .im-resend{
        font-size: 12px;
        color: orange;
      }
      img {
        width: 30%;
      }
      .im-file-img {
        width: 60px;
        height: 60px;
        margin-right: 15px;
      }
    }

    .im-other-msg,
    .im-self-msg {
      width: 50%;
      margin: 10px 0;
      padding: 10px;
      box-sizing: border-box;
      text-align: left;
      border-radius: 10px;
      position: relative;
    }
    .im-other-msg {
      float: left;
      background-color: rgba(243,243,243,1);
    }
    .im-self-msg {
      float: right;
      background-color: rgba(227,235,248,1);
      // text-align: right;
    }
    .im-other-msg:after,.im-self-msg:after{
      	content: '';
			  position: absolute;
			  width: 0;
			  height: 0;
        border: 15px solid;
			  top: 25px;
			  margin-top: -15px;
    }
    .im-self-msg:after{
       left: 100%;
       border-color: rgba(255,255,255,0);
       border-left-color: rgba(227,235,248,1);
    }
    .im-other-msg:after{
      right: 100%; 
      border-color: rgba(255,255,255,0);
      border-right-color: rgba(243,243,243,1);
    }

    .im-file {
      line-height: 1;
      .im-progress-box {
        width: 100px;
        height: 8px;
        display: inline-block;
        // margin-top: -5px;
        border-radius: 5px;
        border: 1px solid rgb(0, 169, 209);
        position: relative;
        .im-progress-num {
          width: 100%;
          text-align: center;
          font-size: 12px;
          margin-top: 10px;
          color: rgb(0, 169, 209);
        }
        .im-progress {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          height: 100%;
          background: rgb(0, 169, 209);
          transition: width 0.5s ease 0s;
        }
      }
      .im-file-download {
        font-size: 12px;
      }
    }
  }
  .im-chat-edit {
    height: 30%;
    max-height: 30%;  
    overflow: hidden;
    .im-chat-type {
      height: 40px;
      
      .im-chat-input-type {
        border-width: 0;
        border-radius: 0;
        font-size: 30px;

        cursor: pointer;
        &:hover {
          color: dodgerblue;
        }
        // 去掉按钮事件边框
        &:focus,
        &:active {
          border-width: 0;
          border-color: rgba(0, 0, 0, 0, 0);
          border-radius: 0;
          outline: none;
          box-shadow: none;
        }
      }
      .im-history{
        font-size: 16px;
        height: 100%;
        margin-right: 10px;
        padding-top: 10px;
        box-sizing:border-box;
      }
    }
    .im-chat-input {
      width: 100%;
      height: calc(100% - 130px);
      padding: 10px;
      box-sizing: border-box;
      border-width: 0;
      font-size: 21px;
      outline: none; //去除焦点边框
      word-break: break-all; //解决表情后面超过一行自动进入下一行问题
      overflow-y: auto;
      .im-chat-img {
        width: 100px;
      }
    }
    #im-chat-input,
    #im-chat-input > h1 {
      display: inline-block !important;
    }
    .im-send {
      padding: 0 10px;
    }
  }
}
</style>


