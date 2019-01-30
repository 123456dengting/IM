<template>
      <Sider  hide-trigger  width="140">
        <Menu :active-name="activeName" theme="dark" width="auto" >
            <div v-for="(menu,index) in menuList" :key="index">
                    <MenuItem v-if="!menu.child" :name=" ''+index " v-show="menu.isShow" @click.native="onRoute(menu.path)">
                        <Icon :type="menu.icon" size="16"></Icon>
                        <span>{{menu.title}}</span>
                    </MenuItem>
                    <Submenu v-else :name=" ''+index ">
                        <template slot="title">
                            <Icon :type="menu.icon" size="16"></Icon>
                            <span>{{menu.title}}</span>
                        </template>
                        <MenuItem v-for="(childmenu,t) in menu.child " :key="t" :name="index+'-'+t" @click.native="onRoute(childmenu.path)">{{childmenu.title}}</MenuItem>
                    </Submenu>
            </div>
        </Menu>
    </Sider>
</template>
<script>
import {menuList} from "@/assets/utils/config"

export default {
  data() {
    return {
        menuList:menuList,
        activeName:"1-0"
    };
  },
  methods: {
      //点击路由跳转
      onRoute(path){
          console.log("path",path)
          this.$router.push({ path: `/${path}` });
      },
      //修改默认高亮菜单
      onDefaultLight(){
            let targetPath = this.$route.name;
            this.menuList.forEach( (item,index) => {
                if (targetPath == item.path) {
                    this.activeName = `${index}`
                }
            })
      }
  },
  mounted(){
      this.onDefaultLight()
  },
  components: {

  }
};
</script>
<style lang="less">
.ivu-menu .ivu-menu-item,.ivu-menu .ivu-menu-submenu-title{
    padding: 0;
    padding-left: 10px;
    height: 50px;
    line-height: 50px;
    .ivu-icon{
        margin-right: 0px;
    }
    .ivu-menu-submenu-title-icon{
        top:18px;
        right:5px;
    }
}

</style>
