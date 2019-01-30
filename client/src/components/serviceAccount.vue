<template>
  <modelComponent :closeText="closeText">
    <div slot="content">
      <Form ref="formAccount" :model="formAccount" :rules="ruleCustom" :label-width="80">
        <FormItem label="所属平台Id" prop="platformId">
          <Input type="text" v-model="formAccount.platformId" placeholder=""></Input>
        </FormItem>
        <FormItem label="商家名称" prop="platformId">
          <Input type="text" v-model="formAccount.merchantName" placeholder=""></Input>
        </FormItem>
        <FormItem label="用户名" prop="userName">
          <Input type="text" v-model="formAccount.userName" placeholder=""></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="formAccount.password" placeholder=""></Input>
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input type="text" v-model="formAccount.nickname" placeholder=""></Input>
        </FormItem>
        <FormItem label="头像地址" prop="avatar">
          <Input type="text" v-model="formAccount.avatar" placeholder=""></Input>
        </FormItem>
        <FormItem label="工号" prop="jobNumber">
          <Input type="text" v-model="formAccount.jobNumber" placeholder=""></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="submit">
      <Button type="primary" @click="onSubmit('formAccount')" size="large">确定</Button>
    </div>
  </modelComponent>
</template>
<script>
import modelComponent from '@/components/model.vue'

export default {
  props:{

  },
  data() {
    return {
      closeText: '取消',
      formAccount: {
        platformId: '',
        merchantName: '',
        userName: '',
        password: '',
        avatar: '',
        nickname:'',
        jobNumber: ''
      },
      ruleCustom: {
        platformId: [
          { required: true, message: '', trigger: 'blur' }
        ],
        platformId: [
          { required: true, message: '', trigger: 'blur' }
        ],
        merchantName: [
          { required: true, message: '', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '', trigger: 'blur' }
        ],
        nickname:[
          { required: true, message: '', trigger: 'blur' }
        ],
        jobNumber: [
          { required: true, message: '', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    onSubmit(){
      console.log("click")
    }
  },
  components:{
    modelComponent
  }
};
</script>
