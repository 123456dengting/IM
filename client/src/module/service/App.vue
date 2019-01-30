
<template>
    <div class="layout">
        <imHeader></imHeader>
        <Layout class="ivu-layout-has-sider">
            <asideBar></asideBar>
            <Layout class="im-container">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import asideBar from "./components/asideBar"
import imHeader from "./components/header"
    export default {
        data () {
            return {
            }
        },
        methods: {

        },
        components:{
            asideBar,
            imHeader
        }
    }
</script>
<style lang="scss" scoped>
</style>
