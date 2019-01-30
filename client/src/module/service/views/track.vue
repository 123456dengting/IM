<template>
  <div class="im-height im-manager im-track-main">
        <p class="im-manager-title">会话追踪</p>
        <div class="im-search-form">
             <DatePicker type="daterange"  confirm v-model="selectTimeVal"  placeholder="会话时间" style="width: 250px;"  ></DatePicker>
              <Select class="select-item" clearable	  placeholder="请选择客服" v-model="customerArrVal" >
                <Option v-for="(item,t) in customerArr" :value="item.userId" :key="t">{{ item.nickName }}</Option>
              </Select>
               <Button type="primary" @click="searchChat">查询</Button>
        </div>
        <Table  :columns="tableColumns" :data="report" @on-row-click="rowHandle"  stripe  :no-data-text="'暂无数据，请选择条件~~o(*￣︶￣*)o'"></Table>
        <div class="im-trackDetail" :style="{left:moveLeft}">
          
        </div>
  </div>
</template>
<script>
import {getConverList,getConverDetail,getUsersList} from "@/assets/utils/ajax"
import {EnumServiceStatus} from "@/assets/utils/enum"

export default {
  data() {
    return {
      tableColumns: [
        {
          title: '买家', //列头显示文字
          key: 'buyerName', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '国家(地区)', //列头显示文字
          align: 'center', //对齐方式
          tooltip:true,
          render:(h,params)=>{
            let {row,index} = params;
            let text = `${row.country}(${row.region})`
            return h("div", text);
          }
        },
        {
          title: '服务客服', //列头显示文字
          key: 'employeeName', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '服务状态', //列头显示文字
          key: 'status', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '会话发起时间', //列头显示文字
          key: 'createTime', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '客服回复时间', //列头显示文字
          key: 'startTime', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '服务结束时间', //列头显示文字
          key: 'endTime', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        {
          title: '服务时长', //列头显示文字
          key: 'createTime', //对应列内容的字段名
          align: 'center', //对齐方式
          tooltip:true,
        },
        // {
        //   title: '服务评分', //列头显示文字
        //   key: 'evelute', //对应列内容的字段名
        //   align: 'center', //对齐方式
        //   tooltip:true,
        // }
      ],
      report: [],
      selectTimeVal:"",
      customerArrVal:"0",
      customerArr:[],
      //列表分页
      PageIndex:1,
      PageSize:20,
      //会话详情分页
      detailPageIndex:1,
      detailPageSize:20,
      moveLeft:"100%"
    };

  },
  methods: {
    //点击搜索
    searchChat(){
      if (this.selectTimeVal[0] && this.selectTimeVal[1]) {
        let searchParam = {
          PageIndex:this.PageIndex,
          PageSize:this.PageSize,
          Filter:{
            StartTime:this.selectTimeVal[0].Format("yyyy-MM-dd hh:mm:ss"),
            EndTime:this.selectTimeVal[1].Format("yyyy-MM-dd hh:mm:ss"),
            EmployeeId:this.customerArrVal,
            KeyWord:"",
          }
        }
        this.getList(searchParam);
      } 
    },
    //请求列表数据
    async getList(searchParam){
      let res = await getConverList(searchParam);
      if (res.code == 0) {
        this.report = res.data.items
      }
      this.report.forEach(item=>{
        item.endTime = new Date(item.endTime).Format("yyyy-MM-dd hh:mm:ss")
        item.startTime = new Date(item.startTime).Format("yyyy-MM-dd hh:mm:ss")
        item.createTime = new Date(item.createTime).Format("yyyy-MM-dd hh:mm:ss")
        item.status = EnumServiceStatus.get(item.status).text;
      })
    },
    //点击某一行
    rowHandle(...args){
      let row = args[0];
      let index = args[1];
      this.getDetail(row)
    },
    async getDetail(row){
      let data = {
        PageIndex:this.detailPageIndex,
        PageSize:this.detailPageSize,
        Filter:{
          id:row.conversationId
        }
      }
      let res =  await getConverDetail(data)
      this.moveLeft = this.moveLeft == "100%" ? "calc( 100% - 350px)" : "100%";
    },
    async getServiceList(){
        let userParam = {}
        let res = await getUsersList(userParam)
        if (res.code == 0) {
          this.customerArr = res.data.items;
        }
    }
  },
  mounted(){
    console.log("会话追踪")
    this.getServiceList();

  },
  components: {

  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/theme/index.less";
.im-track-main{
  position: relative;
  .im-trackDetail{
    position: absolute;
    z-index: 10000;
    width: 350px;
    height: 100%;
    padding: 10px;
    border: 1px solid @line-color;
    background-color: #ffffff;
    box-sizing: border-box;
    top: 0;
    transition: left .5s ease-in-out .1s
  }
}
</style>
