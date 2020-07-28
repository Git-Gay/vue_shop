<template>
<div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!--搜索与添加区域-->
      <el-row :gutter="25">
        <el-col :span="8">
             <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
                <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" stripe border>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
            <!--作用域插槽，scope.row存放着整一行的数据-->
                <template slot-scope="scope">
                <!--{{scope.row}}-->
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" >
                <template>
                     <el-tooltip  effect="dark" content="编辑角色" placement="top" :enterable="false">
                         <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                    </el-tooltip>
                     <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                         <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                   
                    <el-tooltip  effect="dark" content="删除角色" placement="top" :enterable="false">
                         <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
</div>
<!--卡片区域-->

</template>
<script>
export default {
    name:'User',
    data() {
        return {
           queryInfo:{
               query: '',
               //当前页码
               pagenum: 1,
               //每页多少条
               pagesize: 2
           } ,
           userList:[],
           total: 0
        }
    },
    created() {
       this.getUserList() 
    },
    methods: {
        //获取用户列表
       async getUserList(){
          const {data: res} = await this.$http.get('users',{params: this.queryInfo })
        //   console.log(res)
          if(res.meta.status !== 200){
              //请求失败
              this.$message.error("res.meta.msg")
          }
          this.userList = res.data.users
          this.total = res.data.total
       },
       //监听pagesize的改变
       handleSizeChange(newSize){
           this.queryInfo.pagesize = newSize
           this.getUserList()
       } ,
       //监听页码值的改变
       handleCurrentChange(newPage){
           this.queryInfo.pagenum = newPage
           this.getUserList()
       },
       //监听switch开关状态的改变
       async userStateChanged(userinfo){
        //    console.log(userinfo)
          const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          if(res.meta.status!== 200){
              userinfo.mg_state = !userinfo.mg_state
              return this.$message.error('更新用户状态失败')
          } 
          this.$message.success('更新用户状态成功')

       }
    },
}
</script>
<style scope>
    .el-card{
        margin-top: 18px;
        box-shadow: 0 1px 1px rgb(0,0,0,0.15) !important; 
    }
    .el-table{
        margin-top: 15px;
        font-size: 12px;
    }
    .el-pagination{
        margin-top: 15px;
    }
</style>