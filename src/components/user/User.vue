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
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
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
                <template  slot-scope="scope"> 
                     <el-tooltip  effect="dark" content="编辑角色" placement="top" :enterable="false">
                         <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialog(scope.row.id)"></el-button>
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

    <!--添加用户提示框-->
    <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose()">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!--修改用户提示框-->
    <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
            <el-form-item label="用户名" >
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
             <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateForm">确 定</el-button>
        </span>
    </el-dialog>
</div>
<!--卡片区域-->

</template>
<script>
export default {
    name:'User',
    data() {
         //验证邮箱的规则
            var checkEmail = (rule ,value ,cb) =>{
                const regEmail = /^[a-z,A-Z,0-9]+@[a-z,A-Z]+.[a-z,A-Z]+$/
                if(regEmail.test(value)){
                    //合法邮箱
                    return cb()
                }
                cb(new Error('请输入合法的邮箱地址'))
            }
            //验证手机号的规则
            var checkMoblie = (rule ,value ,cb) =>{
                const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
                if(regMobile.test(value)){
                    //合法邮箱
                    return cb()
                }
                cb(new Error('请输入合法的手机号码'))
            }

        return {
           queryInfo:{
               query: '',
               //当前页码
               pagenum: 1,
               //每页多少条
               pagesize: 2
           } ,
           userList:[],
           total: 0,
           //控制提示框显示与否
           dialogVisible:false,
           //添加用户的数据
           addForm: {
               username: "",
               password: "",
               email: "",
               mobile: ""
           },
           //添加用户的验证规则
           addFormRules:{
               username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
                password:[  
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' } ],
                email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    {validator: checkEmail, targger: 'blur'}],
                mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
                     {validator: checkMoblie, targger: 'blur'}],    
           },
            //修改提示框显示与否
           editDialogVisible:false,
           //修改用户的数据
           editForm:{},
           //修改用户的验证规则
           editFormRules:{
                email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    {validator: checkEmail, targger: 'blur'}],
                mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
                     {validator: checkMoblie, targger: 'blur'}],    
           }
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

       },
       //重置添加表单
       dialogClose(){
           this.$refs.addFormRef.resetFields()
       },
       //添加用户
       addUser(){
           this.$refs.addFormRef.validate(async valid =>{
               if(!valid) return;
               //发起添加用户的网络请求
             const {data: res} = await this.$http.post('users',this.addForm)
             if(res.meta.status!==201){
                 this.$message.error('添加用户失败')
             }
             this.$message.success('添加用户成功')
             this.dialogVisible = false
             this.getUserList()
           })
       },
       //获取修改前的数据展示在表单中
       async editDialog(id){
           //`users/${id}`
           const {data: res} = await this.$http.get('users/'+id)
           if(res.meta.status !== 200){
                return this.$message.error('获取失败')
           }
           this.editForm = res.data
           this.editDialogVisible = true
       },
       //提交修改后的数据
        updateForm(){
           this.$refs.editFormRef.validate(async valid =>{
               if(!valid) return;
               const {data: res} = await this.$http.put('users/'+ this.editForm.id,{
                   email: this.editForm.email,
                   mobile: this.editForm.mobile
               })
               if(res.meta.status !== 200){
                return this.$message.error('修改失败')
           }    
               this.$message.success('修改成功')
               this.editDialogVisible = false
               this.getUserList()
           })
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