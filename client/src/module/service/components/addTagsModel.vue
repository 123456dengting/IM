<template>
  <modelComponent >
    <div slot="content">
      <Form ref="addTagsForm" :model="addTagsForm" :rules="ruleCustom" :label-width="80">
        <FormItem label="标签名称" prop="tagName">
          <Input type="text" v-model="addTagsForm.tagName" placeholder=""></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="submit">
      <Button type="primary" @click="onSubmit('addTagsForm')" size="large">确定</Button>
    </div>
  </modelComponent>
</template>
<script>
import modelComponent from '@/components/model.vue'
import {addTags,editTags} from "@/assets/utils/ajax"

export default {
  props:{
    tagId:{
      type: String,
      default(){
        return ""
      }
    },
    tagName:{
      type: String,
      default(){
        return ""
      }
    }
  },
  data() {
    return {
      addTagsForm: {
        tagName: ''
      },
      ruleCustom: {
        tagName: [
          { required: true, message: '标签名称必填', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
     onSubmit(name){
      this.$refs[name].validate(val => {
        if (val) {
          this.tagId || this.onAddTags(this.addTagsForm)
          this.tagId && this.onAddTags(this.addTagsForm)
        }
      }) 
    },
    //添加标签
    async onAddTags(data){
         let res =  await addTags(data);
         this.$Modal.remove();
        if (res.data == true) {
            this.$Message.success("成功")
        }else{
          this.$Message.error("失败")
        }
    },
    //添加编辑标签
    async onEditTags(data){
         data.tagId = this.tagId;
         let res =  await editTags(data);
        this.$Modal.remove();
        if (res.data == true) {
            this.$Message.success("成功")
        }else{
          this.$Message.error("失败")
        }
    }
  },
  mounted(){
    if (this.tagId && this.tagName) {
      this.addTagsForm.tagName = this.tagName
    }
  },
  components:{
    modelComponent
  }
};
</script>
