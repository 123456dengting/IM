<template>
  <chatInfo :chatOption="chatOption" :styleOptions="styleOptions"></chatInfo>
</template>
<script>
import chatInfo from "@/components/chatInfo"
import {EnumIdentity} from "@/assets/utils/enum"


var serviceUser = window.parent.serviceUser;

export default {
  data() {
    return {
      chatOption:{
        sender:  serviceUser ? serviceUser.sender : "60000",
        receiver: serviceUser ? serviceUser.receiver : "30000",
        identity:EnumIdentity.getItemFromText("客服").value
      },
      styleOptions:{
        height:"72px",
        padding:"12px 15px",
      }
    }
  },
  methods: {

  },
  mounted(){
  },
  components: {
    chatInfo
  }
};
</script>

