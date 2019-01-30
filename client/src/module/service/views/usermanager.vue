<template>
  <div class="im-height im-manager">
        <p  class="im-manager-title">客服管理</p>
        <div class="im-search-form">
              <Input v-model="searchForm.KeyWord" placeholder="昵称" style="width: 200px" />
              <Select class="select-item" clearable v-model="searchForm.tagId"  placeholder="请选择标签" >
                <Option v-for="(item,t) in tagArr" :value="item.tagId" :key="t">{{ item.tagName }}</Option>
              </Select>
              <Button type="primary" @click="onSubmit">查询</Button>
        </div>
        <Table  :columns="tableColumns" :data="report"  stripe  :no-data-text="'暂无数据,请选择搜索条件~~'"></Table>
  </div>
</template>
<script>
import {getUsersList,getTags,isDisable} from "@/assets/utils/ajax";
import setLabelModel from "../components/setLabelModel";
import setPermissModel from "../components/setPermissModel";
import {getUser,get2nToArr } from "@/assets/utils/common";
import {
    EnumPermission,             //权限管理枚举
    EnumConversationManager,    //会话管理枚举
    EnumUserManager,            //客服管理枚举
    EnumTagManager,             //标签管理枚举
} from "@/assets/utils/enum"

export default {
  data() {
    return {
      userInfo:{},
      searchForm:{
        KeyWord:"",
        tagId:0
      },
      EnumObj:{
            EnumConversationManager,    //会话管理枚举
            EnumUserManager,            //客服管理枚举
            EnumTagManager,             //标签管理枚举
      },
      tagArr:[],
      PageIndex:1,
      PageSize:10000,
      tableColumns: [
        {
          title: '姓名', //列头显示文字
          key: 'nickName', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '权限', //列头显示文字
          // key: 'permissions', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
          render: (h, params) => {
                let {row,index} = params;
                let permissions = row.permissions;
                let text = []
                permissions.forEach(item => {
                   item.codes = get2nToArr(item.permissionCodes.toString());
                   let key = EnumPermission.get(item.module).alias.key;
                   let enums = this.EnumObj[key]
                   item.codes.forEach(t=>{
                     text.push(enums.get(t).text)
                   })
                })
                text = text.join(" , ")
                return h("div",
                        {
                          class:"im-text-one",
                          attrs:{
                            title:text
                          }
                        }, 
                        text);
              }
        },
        {
          title: '标签', //列头显示文字
          // key: 'tags', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
          render: (h, params) => {
                let {row,index} = params;
                let tags = row.tags;
                let tagArr = tags.map(item => {
                  return item.tagName;
                })
                let text = tagArr.join(" , ")
                return h("div",
                        {
                          class:"im-text-one",
                          attrs:{
                            title:text
                          }
                        }, 
                        text);
              }
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
                      //设置权限
                      this.setPermission(row,index)
                    }
                  }
                },
                '权限'
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
                      //编辑标签
                      this.setServiceLabel(row,index)
                    }
                  }
                },
                '标签'
              ),
              h(
              'i-switch',
              {
                props: {
                  size: 'large',
                  value: !params.row.disabled
                },
                style: {
                  display:this.userInfo.userId === params.row.userId ? 'none' : 'inline-block'
                },
                on: {
                  'on-change': value => {
                    let {row,index} = params;
                    //编辑标签
                    this.onDisabled(row,index)
                  }
                }
              },
              [
                h(
                  'span',
                  {
                    slot: 'open'
                  },
                  '有效'
                ),
                h(
                  'span',
                  {
                    slot: 'close'
                  },
                  '禁用'
                )
              ]
            )
            ])
          }
        }
      ],
      report: []
    };

  },
  methods: {
    async onSubmit(){
        let userParam = {
          PageIndex:this.PageIndex,
          PageSize:this.PageSize,
          Filter: this.searchForm
        }
        let res = await getUsersList(userParam)
        if (res.code == 0) {
          this.report = res.data.items;
        }
        
    },
    //获取所有标签
    async onGetTags(){
      let res = await getTags();
      if (res.code == 0) {
        this.tagArr = res.data;
      }
    },
    //编辑客服标签
    setServiceLabel(row,index){
      this.$Modal.confirm({
        title:"",
        render:(h,params)=>{
          return h(setLabelModel,{
            props:{
              row,
              index,
              tagArr: this.tagArr
            }
          })
        }
      })
    },
    //设置权限
    setPermission(row,index){
      this.$Modal.confirm({
        title:"设置客服权限",
        render:(h,params)=>{
          return h(setPermissModel,{
            props:{
              row,
              index
            }
          })
        }
      })
    },
    //禁用
    async onDisabled(row,index){
      let data = {
        userId:row.userId,
        disabled:row.disabled ? "enable" : "disable"
      }
      let res = await isDisable(data)
      if (res.data == true) {
        this.report[index].disabled = !row.disabled
      }
    }
  },
  mounted(){
    this.userInfo = getUser();
    //获取标签
    this.onGetTags()
    //进入页面查新数据
    this.onSubmit()
  },
  components: {

  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/theme/index.less";
</style>
