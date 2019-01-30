<template>
  <div class="im-platform-main">
    <h1>第三方平台</h1>
    <div class="im-main">
      <div  class="im-left">
        <h3>买家sender账号和receiver账号</h3>
           <!-- <p>name ： <Input  placeholder="" v-model="buyersName" style="width: auto" /></p> -->
          <p>账号 ：<Input  placeholder=""  v-model="buyersSender" style="width: auto" /></p>
          <p>密码 ：<Input  placeholder=""   v-model="buyersReceiver" style="width: auto" /></p>
          <Button @click="openBuyers">买家入口</Button>
          <Modal
              draggable
              width="80%" 
              title="客服系统"
              v-model="modal1"
              :mask-closable="false">
              <iframe  v-if="modal1" width="100%" height="700px;"  src="http://localhost:8080/buyers.html#/" frameborder="0"></iframe>
          </Modal>
      </div>
      <div class="im-right">
        <h3>客服sender账号和receiver账号</h3>
          <!-- <p>name ： <Input  placeholder="" v-model="serviceName" style="width: auto" /></p> -->
          <p>sender ：<Input  placeholder="" v-model="serviceSender" style="width: auto" /></p>
          <p>receiver ：<Input  placeholder=""  v-model="serviceReceiver" style="width: auto" /></p>
          <Button @click="openService">客服入口</Button>
          <Button @click="onAccount">客服注册</Button>
          <Modal
              draggable
              width="80%" 
              title="客服系统"
              v-model="modal2"
              :mask-closable="false">
              <iframe  v-if="modal2" width="100%" height="700px;"  src="http://localhost:8080/service.html#/" frameborder="0"></iframe>
          </Modal>
      </div>
    </div>
  </div>
  </div>
</template>
<script>

import {Base64,caches} from "@/assets/utils/common";
import {login} from "@/assets/utils/ajax";
import serviceAccount from '@/components/serviceAccount.vue'
export default {
  name: "app",
  data() {
    return {
      modal1:false,
      modal2:false,
      buyersSender:"test",
      buyersReceiver:"123456",
      serviceSender:"test",
      serviceReceiver:"123456"
    };
  },
  methods: {
    //买家入口
    openBuyers(){
      if (this.buyersSender.trim() == "" || this.buyersReceiver.trim() == "") {
          this.$Message.warning ('请输入买家账号和密码');
      }else{
          window.buyersUser = {
            sender:this.buyersSender.trim(),
            receiver:this.buyersReceiver.trim(),
          }
      }
    },
    async serviceLogin(){
      let base = new Base64();
      let auth = "70201f42-099a-11e9-ba21-0242ac110003:7d8d2763-099a-11e9-ba21-0242ac110003";
      auth = base.encode(auth);
      let data = {
        userName:this.serviceSender.trim(),
        password:this.serviceReceiver.trim(),
      }
      let param = {
        headerParam:{
          Authorization: `Basic ${auth}`
        }
      }
      const result = await login(data,param);
      if (result.code == 0) {
        caches.add("Authorization", result.data.access_token)
        caches.add("UserInfo", JSON.stringify(result.data.userInfo))
        this.modal2 = true;
      }
    },
    //客服入口
    openService(){
      if (this.serviceSender.trim() == "" || this.serviceReceiver.trim() == "") {
          this.$Message.warning ('请输入客服sender账号和receiver账号');
      }else{
          window.serviceUser = {
            sender:this.serviceSender.trim(),
            receiver:this.serviceReceiver.trim(),
          }
          this.serviceLogin()
      }
    },
    //客服注册
    onAccount(){
      this.$Modal.confirm({
        title: "注册客服",
        render: (h, params) => {
          return h(serviceAccount);
        }
      });
    }
  },
  mounted(){

  },
  components: {

  }
};
</script>
<style lang="less" >
.im-platform-main{
  width: 50%;
  margin: 100px auto;
  text-align: center;
}
.ivu-modal-header-inner{
  text-align: center;
}

.im-main{
  height: 500px;
  .im-left{
    width: 50%;
    height: 100%;
    float: left;
  }
  .im-right{
    width: 50%;
    height: 100%;
    float: right;
  }
  p{
    margin: 20px 0; 
  }
}


</style>
