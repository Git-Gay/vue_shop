<template>
    <div class="login_container">
        <div class="login_box">
         <div class="avater_box">
            <img src="../assets/logo.png" alt="">
         </div>
         <!--表单-->
         <el-form class="form_box" :model="userForm" :rules="loginRules" ref="loginRef">
         <!--username-->
            <el-form-item prop="username">
                <el-input  prefix-icon="el-icon-user" v-model="userForm.username"></el-input>
            </el-form-item>
        <!--password-->
            <el-form-item prop="password">
                <el-input type="password" prefix-icon="el-icon-lock" v-model="userForm.password"></el-input>
            </el-form-item>
        <!--按钮区域-->
            <el-form-item class="btn">
                <el-button type="primary" @click="loginValidate">登录</el-button>
                <el-button type="info" @click="resetLogin">重置</el-button>
            </el-form-item>
        </el-form>
        </div> 
    </div>
</template>

<script>
export default {
    name:'Login',
    data() {
        return {
            userForm:{
                username:'admin',
                password:'123456'
            },
            loginRules:{
                username:[  
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' } ],
                password:[  
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' } ]
            }
        }
    },
    methods: {
        resetLogin(){
            this.$refs.loginRef.resetFields();
        },
        loginValidate(){
            this.$refs.loginRef.validate(async valid =>{
              if(!valid) return;
              //{data:{data:{...},meta:{...}},config:{...},headers:{...},....}
              //es6变量的解构赋值，将data赋给res
              const {data: res} = await this.$http.post("login",this.userForm);   
              if(res.meta.status !== 200) return this.$message.error("登录失败");
              this.$message.success("登录成功");
              //1.将登陆成功之后的taken，保存到客户端的sessionStorage中
              // 1.1项目中除了登录之外的其他api接口必须在登录之后才能访问
              // 1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
              window.sessionStorage.setItem("token",res.data.token);
              //2.通过编程式导航跳转到后台主页，路由地址是/home
              this.$router.push("/home");
            });
        }
    },
}
</script>

<style  scope>
    .login_container{
        width: 100%;
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box{
        width:450px;
        height: 300px;
        border-radius: 3px;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .avater_box{
        width: 130px;
        height: 130px;
        padding: 10px;
        border: 1px solid #eee;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        box-shadow:0,0,10px #ddd;
    }
    .avater_box img{
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background-color: #eee;
    }
    .form_box{
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 30px;
        margin-bottom: 10px;
    }
    .btn{
        display: flex;
        justify-content: flex-end;
    }
</style>