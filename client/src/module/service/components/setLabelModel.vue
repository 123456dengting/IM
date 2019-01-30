<template>
  <modelComponent>
    <div slot="content">
        <p>
           <span class="im-setlabel-title"> 编辑客服标签</span>
          <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="onCheckAll">全选</Checkbox>
        </p>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" size="large">
          <Checkbox class="im-setlabel" v-for="item in tagArr" :label="item.tagId" :key="item.tagId"  >{{ item.tagName }}</Checkbox>
        </CheckboxGroup>
    </div>
    <div slot="submit">
      <Button type="primary" @click="onSubmit" size="large">确定</Button>
    </div>
  </modelComponent>
</template>
<script>
import modelComponent from '@/components/model.vue'
import {addLabel,delLabel,setLabel} from "@/assets/utils/ajax"

export default {
  props:{
    row:{
      type: Object,
      default(){
        return {}
      }
    },
    index:{
      type: Number,
      default(){
        return 0
      }
    },
    tagArr:{
      type: Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      //全选按钮样式
      indeterminate:true,
      //是否全选
      checkAll:false,
      //存储当前选项
      checkAllGroup:[],
      ////存储所有选项
      selectAllArr:[]
    };
  },
  methods: {
    //点击全选
    onCheckAll(){
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.selectAllArr;
      } else {
        this.checkAllGroup = [];
      }
    },
    //选择单个
    checkAllGroupChange(data){
      this.checkAllGroup = data;
      //如果长度等于所有的id数组,相当于全选
      this.checkAll = data.length == this.selectAllArr.length ? true : false;
      this.indeterminate = data.length > 0 && data.length < this.selectAllArr.length ? true : false;
    },
    async onSubmit(){
      let data = {
        userId:this.row.userId,
        tags:this.checkAllGroup
      }
      let res = await setLabel(data);
      if (res.data == true) {
        this.$Modal.remove();
          this.$Message.success("成功")
      }else{
        this.$Message.error("失败")
      }
    }
  },
  mounted(){
    //存储所有选项
    this.selectAllArr = this.tagArr.map(item => {
      return item.tagId
    })
    //存储当前选项
    this.checkAllGroup = this.row.tags.map(item => {
      return item.tagId
    })
    this.checkAllGroupChange(this.checkAllGroup)
  },
  components:{
    modelComponent
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/theme/index.less";
.im-setlabel-title{
  font-weight: bold;
  margin-right: 20px;
  margin-bottom: 20px;
}
.im-setlabel{
  width: 30%;
  margin: 5px 0;
}
</style>
