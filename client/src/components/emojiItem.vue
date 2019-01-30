<template>
       <label class="im-emoji-item" :style="emojiStyle" ></label>
</template>
<script>
import emojiImg from "@/assets/images/emoji.png"

export default {
  props:{
    emojiIndex:{
      type:Number,
      default(){
        return 0
      }
    },
    emojiSize:{
      type:Number,
      default(){
        return 30
      }
    },
    scale:{
      type:Number,
      default(){
        return 1
      }
    }
  },
  data() {
    return {
      emojiImg:emojiImg,
      emojiStyle:null,
    };
  },
  methods: {

  },
  created(){
    let posiX = this.emojiIndex * this.emojiSize;
    this.emojiStyle = {
            "display" : `inline-block`,
            "cursor" : `pointer`,
            "background" : `url(${emojiImg}) no-repeat -${posiX}px  0px`,
            "width" : `${this.emojiSize}px`,
            "height" : `${this.emojiSize}px`,
            "background-size" : `auto ${this.emojiSize}px`,
            "transform" : `scale(${this.scale})`,
    }
  },
};
</script>
