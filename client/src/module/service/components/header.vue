<template>
    <div class="im-head">
        <div class="im-head-left">环球助理</div>
        <div class="im-head-right">在线</div>
    </div>
</template>
<script>


export default {
  data() {
    return {
    };
  },
  methods: {
  },
  mounted(){

  },
  components: {

  }
};
</script>
<style lang="less" scoped>
// @import "../../../assets/theme/index.less";
.im-head{
    width: 100%;
    height: 50px;
    .im-head-left{
        width: 140px;
        float: left;
        text-align: center;
        line-height: 50px;
        background-color:dodgerblue;
        color: #FFFFFF;
        font-size: 1.3rem;
    }
    .im-head-right{
        line-height: 49px;
        height: 49px;
        background-color: #FFFFFF;
        text-align: right;
        box-sizing: border-box;
        padding: 5px;
        border-bottom: 1px solid #e2e2e2;
    }
}
</style>