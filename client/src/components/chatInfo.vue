<template>
  <div class="im-buyers-main">
        <div class="im-chat-list im-height im-scorllY">
            <userList :userList="userListData" :styleOptions="styleOptions" :identity="chatOption.identity" ></userList>
        </div>
        <div class="im-chat-box im-height">
          <chatWindow :chatOption="chatOption" ></chatWindow>
        </div>
        <div class="im-chat-right im-height im-scorllY">信息栏</div>
        <div class="im-move-content" :style="{left:moveLeft}">
            滑块
        </div>
  </div>
</template>
<script>
import imghead from "@/assets/images/head2.jpg"
import userList from "@/components/userList"
import chatWindow from "@/components/chat"
import Bus from "@/assets/utils/eventBus"

import  "@/assets/utils/message.js";

var buyersUser =  window.parent.buyersUser 


var userListData = [
  {
    name:"张三",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好,请问有什么需要我帮助的吗?你好,请问有什么需要我帮助的吗?你好,请问有什么需要我帮助的吗?你好,请问有什么需要我帮助的吗?",
    lastTime:"18-10-17",
    brageNum:3
  },
  {
    name:"张三1",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好",
    lastTime:"18-10-17",
    brageNum:1
  },
  {
    name:"张三2",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好",
    lastTime:"18-10-17",
    brageNum:0
  },
  {
    name:"张三3",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好",
    lastTime:"18-10-17",
    // brageNum:2
  },
  {
    name:"张三4",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好,请问有什么需要我帮助的吗?你好,请问有什么需要我帮助的吗?你好,请问有什么需要我帮助的吗?你好,请问有什么需要我帮助的吗?",
    lastTime:"18-10-17",
    brageNum:3
  },
  {
    name:"张三5",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好",
    lastTime:"18-10-17",
    brageNum:1
  },
  {
    name:"张三6",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好",
    lastTime:"18-10-17",
    brageNum:0
  },
  {
    name:"张三7",
    head_img:imghead,
    adder:"广东深圳",
    chatinfo:"你好",
    lastTime:"18-10-17",
    // brageNum:2
  }

]

export default {
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
    },
    styleOptions: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      userListData:userListData,
      moveLeft:"100%"
    };
  },
  methods: {
      onMove(content){
          this.moveLeft = this.moveLeft == "100%" ? "calc( 100% - 300px)" : "100%";
      }
  },
  mounted(){
      let self = this;
      Bus.$on('openHistory',(content)=>{
          self.onMove(content)
      })
  },
  components: {
    userList,
    chatWindow
  }
};
</script>
<style lang="less" scoped>
@import "../assets/theme/index.less";
.im-buyers-main{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  position: relative;
  .im-chat-list{
    flex:0 0 260px;
    background-color: @userlist-bgc;
  }
  .im-chat-right{
      flex: 0 0 300px;
      padding: 10px;
      box-sizing: border-box;
      background-color: @userlist-bgc;
  }
  .im-chat-box{
    width: 100%;
    box-sizing: border-box;
    border-left: 1px solid rgba(238,238,238,1);
    border-right: 1px solid rgba(238,238,238,1);
    background-color: @container-bgc;
  }
 .im-chat-info{
    height: 100%;
  }
  .im-move-content{
      position: absolute;
    //   left: calc( 100% - 300px);
      height: 100%;
      top: 0;
      width: 300px;
      padding: 10px;
      border: 1px solid red;
      box-sizing: border-box;
      transition: left .5s ease-in-out .1s
  }

}

</style>

