<template>
  <modelComponent >
    <div slot="content">
      <div class="im-permission" v-for="(per,index) in permissionArr" :key="index">
        <p class="im-permission-first">
          <Checkbox class="im-setlabel" :indeterminate="firstPermission[index].type" :value="firstPermission[index].value"  @on-change="checkAllChange(index)" >{{ per.text }}</Checkbox>
        </p>
        <div class="im-permission-secend" @click="secondCange(index)">
            <CheckboxGroup v-model="secondPerssion[index]" @on-change="checkAllGroupChange" size="large">
              <Checkbox class="im-setlabel" v-for="(item,t) in per.child" :key="t"  :label="item.value" >{{ item.text }}</Checkbox>
            </CheckboxGroup>
        </div>
      </div>
    </div>
    <div slot="submit">
      <Button type="primary" @click="onSubmit" size="large">确定</Button>
    </div>
  </modelComponent>
</template>
<script>
import modelComponent from '@/components/model.vue'
import {putPermiss} from "@/assets/utils/ajax"
import {
    EnumPermission,             //权限管理枚举
    EnumConversationManager,    //会话管理枚举
    EnumUserManager,            //客服管理枚举
    EnumTagManager,             //标签管理枚举
} from "@/assets/utils/enum"
import {get2nToArr,getArrTo2n,getUser} from "@/assets/utils/common"

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
    }
  },
  data() {
    return {
      EnumObj:{
            EnumConversationManager,    //会话管理枚举
            EnumUserManager,            //客服管理枚举
            EnumTagManager,             //标签管理枚举
      },
      permissionArr:[],
      //一级权限点控制
      firstPermission:[
        {
          type:false,   
          value:false
        },
        {
          type:false,
          value:false,
        },
        {
          type:false,
          value:false
        }
      ],
      //所有二级权限全部选中
      allSecondPerm:[[],[],[]],
      //当前,二级权限控制
      secondPerssion:[[],[],[]],

      changeIndex:0,

    };
  },
  mounted(){
     //获取用户信息
     this.userInfo = getUser();
     //获取所有权限点
     this.permissionArr = this.getAllPermiss();

     //当前客服具有的权限
     let getper = this.row.permissions.slice();
     this.secondPerssion.forEach((item,index) => {
      this.changeIndex = index;
      if (getper[index] && getper[index].codes) {
        this.checkAllGroupChange(getper[index].codes);
      }
      
     })

  },
  methods: {
    async onSubmit(){
      let permissions = [];
      this.secondPerssion.forEach( (item,index) => {
        let module = Math.pow(2,index);
        let codes = getArrTo2n(item);
        if (codes) {
          let perObj = {
            module:module,
            codes
          }
          permissions.push(perObj)
        }
      })
      let data = {
        userId:this.row.userId,
        permissions,
      }
      let res = await putPermiss(data);
      if (res.data == true) {
        this.$Modal.remove();
          this.$Message.success("成功")
      }else{
        this.$Message.error("失败")
      }
    },
    //改变一级权限点
    checkAllChange(index){
      //改变样式
      if (this.firstPermission[index].type) {
        this.firstPermission[index].value = false;
      } else {
        this.firstPermission[index].value = !this.firstPermission[index].value
      }
      this.firstPermission[index].type = false;

      //改变二级权限点的值
      if (this.firstPermission[index].value) {
        this.secondPerssion[index] = this.allSecondPerm[index];
      } else {
        this.secondPerssion[index] = [];
      }
    },

    secondCange(index){
      this.changeIndex = index;
    },
    //改变二级权限
    checkAllGroupChange(data){
      //防止有些浏览器是事件冒泡形式
      // setTimeout(()=>{
        //对应下标的选中值,等于对应的事件返回数组
        this.secondPerssion[this.changeIndex] = data;
        //全选按钮的值
        this.firstPermission[this.changeIndex].value = this.secondPerssion[this.changeIndex].length == this.allSecondPerm[this.changeIndex].length;
        //全选按钮的样式 
        this.firstPermission[this.changeIndex].type = this.secondPerssion[this.changeIndex].length > 0 && this.secondPerssion[this.changeIndex].length < this.allSecondPerm[this.changeIndex].length ? true : false;
      // },1)
    },
    //获取所有权限点
    getAllPermiss(){
      let arr = []
      Object.keys(EnumPermission).forEach((key,index) => {
        if (key == "_items") {
          return;
        } 
        let item = EnumPermission[key];
        let text = item.text;
        let value = item.value;
        let child = this.EnumObj[key].items.map((t,i) => {
        //所有二级权限存储在二维数组里面,全选的时候值等于该数组对应的值
        this.allSecondPerm[index].push(t.value)
          return {text:t.text, value:t.value}
        }) 
        let obj = {
          text,
          value,
          child
        }
        arr.push(obj)     
      })
      return arr;
    }
  },
  components:{
    modelComponent
  }
};
</script>
<style lang="less" scoped>
.im-setlabel-title{
  font-weight: bold;
  margin-right: 20px;
  margin-bottom: 20px;
}
.im-setlabel{
  width: 30%;
  margin: 5px 0;
}
.im-permission:first-child{
  border-width: 0;
}
.im-permission{
  border-top:1px solid #e2e2e2;
  padding: 15px 0;
}
.im-permission-secend{
  margin-left: 20px;
}
</style>
