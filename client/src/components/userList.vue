<template>
      <div>
          <div class="im-user" v-for="(item,index) in userList" :key="index" :style='styleOptions' @click="onSelect(item)">
                  <div class="im-user-left im-floatleft">
                    <img class="im-head-img" v-lazy="item.head_img" :key="item.head_img">
                  </div> 
                  <div class="im-user-right im-floatright">
                    <div>
                        <span class="im-name">{{item.name}}</span>
                        <span class="im-tip-color" v-if="isService">({{item.adder}})</span>
                        <span class="im-floatright im-msg-brage"><Badge :count="item.brageNum"></Badge></span>
                    </div>
                    <div class="im-msg-first">
                      <p class="im-text-one im-floatleft">{{item.chatinfo}}</p>
                      <span class="im-floatright im-tip-color">{{item.lastTime}}</span>
                    </div>
                  </div> 
          </div>
      </div>
</template>
<script>
import {EnumIdentity} from "@/assets/utils/enum"
import Bus from "@/assets/utils/eventBus"

export default {
  name: "userList",
  props:{
    userList:{
      type:Array,
      default(){
        return [];
      }
    },
    styleOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    identity: {
      type: String,
      default(){
        return "1"
      }
    }
  },
  data() {
    return {
      isService:false,  //是否是客服
    };
  },
  methods: {
    onSelect(info){
      Bus.$emit("changeUser",info);
    }
  },
  mounted(){
    Bus.$emit("changeUser",this.userList[0]);
    this.isService = EnumIdentity.getItemFromText("客服").value == this.identity;
  },
  components: {

  }
};
</script>
<style lang="less" scoped>
  //弹性布局,左侧头像区域固定高度,右侧信息自适应宽度
  .im-user{
    border-bottom: 1px solid #d2d2d2;
    max-width:100%;
    box-sizing: border-box;
    cursor: pointer;
    &:hover{
      background-color: rgba(245,248,253,1);
    }
    .im-user-left{
      width:  26%;
      height: 100%;
      box-sizing: border-box;
      .im-head-img{
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid #e2dede;
      }
    }
    .im-user-right{
      width:74%;
      height: 100%;
      font-size: 12px;
      .im-name{
        font-size: 14px;
        display:inline-block;
        margin-bottom: 8px;
      }
      .im-msg-first{
        width: 100%;
        height: 18px;
        p{
          width: 65%;
        }
        span{
          display: inline-block;
          text-align: right;
          width: 35%;
        }
      }
    }
  }
</style>
