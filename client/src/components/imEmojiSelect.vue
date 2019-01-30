<template>
      <Poptip placement="top-start" class="im-emoji-content">
              <Button type="default" size="large" shape="circle" class="im-chat-input-type" icon="ios-happy-outline" ></Button>
              <!-- <Icon type="ios-happy-outline im-chat-input-type" :size="emojiSize"  /> -->
              <div slot="content" > 
                  <div class="im-height" style="width:300px;height:150px;overflow-y:scroll;">
                    <span class="im-emoji-setect-item"  v-for="index in 128" :key="index" @click="selectEmoji(index-1)">
                      <!-- <label class="im-emoji-item" :style="{'background-position': `-${(index-1)*30}px 0px`,'background-image': `url(${emojiImg})`}" ></label> -->
                      <emojiItem :emojiIndex="index-1" :emojiSize="30" :scale="0.7"></emojiItem>
                    </span>
                  </div>
              </div>
      </Poptip>
</template>
<script>
import emojiItem from "@/components/emojiItem"
import emojiImg from "@/assets/images/emoji.png"

export default {
  props:{
    emojiSize:{
      type:Number,
      default(){
        return 35
      }
    }
  },
  data() {
    return {
      emojiImg:emojiImg,
    };
  },
  methods: {
    selectEmoji(index){
      this.$emit("change",index);
    }
  },
  mounted(){
    
  },
  components:{
    emojiItem
  }
};
</script>
<style lang="less" >
.im-emoji-content{
  .ivu-poptip-body{
    padding: 5px 0px 5px 5px;
  }
  .im-chat-input-type{
        border-width: 0;
        border-radius: 0;
        font-size: 30px!important;
        cursor: pointer;
        &:hover{
          color:dodgerblue;
        }
        &:focus,&:active{
          border-width: 0;
          border-color: rgba(0,0,0,0,0);
          border-radius: 0;
          outline:none;
          box-shadow: none;
        }
  }
  .im-emoji-setect-item{
    width:30px;
    height:30px;
    display:inline-block;
    float: left;
    text-align:center;
    line-height:30px;
    cursor: pointer;
    border-radius: 5px;
    &:hover{
      background-color: #e2e2e2;
    }
  }
}


</style>
