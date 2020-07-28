<template>
<el-container class="home-container">
<!--头部-->
  <el-header>
    <span>电商管理系统</span>
    <el-button type="info" @click="logout">退出</el-button></el-header>
<!--主体区域-->
  <el-container>
    <el-aside :width="isActive ? '64px':'200px'">
    <!--侧边栏菜单-->
    <div class="toggle-button" @click="toggleMenu">|||</div>
    <el-menu
        background-color="#333747"
        text-color="#fff"
        active-text-color="#409efe" unique-opened 
        :collapse="isActive" 
        :collapse-transition="false"
        :router="true">
        <!--一级-->
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
            <i :class="iconObj[item.id]"></i>
            <span>{{item.authName}}</span>
            </template>
            <!--二级-->
            <!--进行路由跳转时，默认把index传过去-->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span> {{subItem.authName}}</span>
            </template>
                </el-menu-item>
        </el-submenu>
    </el-menu>
    </el-aside>
    <!--右侧主体部分-->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
    name:'Home',
    created() {
        this.getMenuList()
    },
    data() {
        return {
            menuList: [],
            iconObj: {
                '125': 'el-icon-user-solid',
                '103': 'el-icon-s-check',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-data'   
               },
            isActive: false
        }
    },
    methods: {
        //退出
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取菜单数据
        async getMenuList(){
            const {data: res} = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
            // console.log(res)
        },
        toggleMenu(){
            this.isActive = !this.isActive
        }
    },
}
</script>
<style scope>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        font-size: 20px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .el-aside{
        background-color: #333747;
    }
    .el-menu{
        border-right: none;
    }
    .el-main{
        background-color: #eaedf1;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0.3em;
        cursor: pointer;
    }
</style>