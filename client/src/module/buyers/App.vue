<template>
  <chatInfo :chatOption="chatOption" :styleOptions="styleOptions"></chatInfo>
</template>
<script>
import chatInfo from "@/components/chatInfo"
import {EnumIdentity} from "@/assets/utils/enum"

var buyersUser =  window.parent.buyersUser 



export default {
  data() {
    return {
      chatOption:{
        sender: buyersUser ? buyersUser.sender : "30000",
        receiver: buyersUser ? buyersUser.receiver : "60000",
        identity:EnumIdentity.getItemFromText("买家").value
      },
      styleOptions:{
        height:"72px",
        padding:"12px 15px",
      }
    };
  },
  components: {
    chatInfo
  }
};
</script>
