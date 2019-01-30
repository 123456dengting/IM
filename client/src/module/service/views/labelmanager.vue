
<template>
  <div class="im-height im-manager">
      <p  class="im-manager-title">标签管理</p>
      <Button class="im-floatright im-addtags-btn" type="primary" @click="onAddTags">新增标签</Button>
      <div class="">  
        <div class="im-search-form">
            <Input v-model="searchValue" placeholder="标签搜索"  @change="onSubmit" style="width: 200px" />
        </div>
         <Table  :columns="tableColumns" :data="report"  stripe  :no-data-text="'暂无数据'"></Table>
      </div>
  </div>
</template>

<script>
import {getTags,delTags} from "@/assets/utils/ajax";
import addTagsModel from "../components/addTagsModel";


export default {
  data() {
    return {
      searchValue:"",
      tableColumns: [
        {
          title: '标签', //列头显示文字
          key: 'tagName', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '人数', //列头显示文字
          key: 'employeeCount', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '操作', //列头显示文字
          key: 'edit', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: 'inline-block'
                  },
                  on: {
                    click: () => {
                      let {row,index} = params;
                      this.onEditTags(row,index)

                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: 'inline-block'
                  },
                  on: {
                    click: () => {
                      let {row,index} = params;
                      this.onDelTags(row.tagId,index)
                    }
                  }
                },
                '删除'
              ),
            ])
          }
        }
      ],
      report: [],

    };
  },
  methods: {
    //查询标签
    async onSubmit(){
      console.log("this.searchValue",this.searchValue);
      let data = {
        KeyWord : this.searchValue
      }
      let res = await getTags(data);
      if (res.code == 0) {
        this.report = res.data;
      }
    },
    //新增标签
    onAddTags(){
      this.$Modal.confirm({
        title:"新增标签",
        render:(h,params)=>{
          return h(addTagsModel)
        }
      })
    },
    //编辑标签
    onEditTags(row,index){
      this.$Modal.confirm({
        title:"编辑标签",
        render:(h,params)=>{
          return h(addTagsModel,{
            props: {
                tagId:row.tagId,
                tagName:row.tagName,
            }
          })
        }
      })
    },
    //删除标签
    async onDelTags(id){
      let res =  await delTags(id);
      if (res.data == true) {
          this.$Message.success("成功")
      }else{
        this.$Message.error("失败")
      }
    }   
  },
  computed:{
  },
  mounted(){

  },
  components: {

  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/theme/index.less";
.im-addtags-btn{
  margin-right: 20px;
}
</style>