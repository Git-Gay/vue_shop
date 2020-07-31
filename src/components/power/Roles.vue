<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!--列表数据表-->
            <el-table :data="roleList" border stripe height="700">
                <!--展开列-->
                <el-table-column type="expand">
                     <template slot-scope="scope">
                        <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['rowBorder',index === 0 ? 'rowtop' : 'rowBorder']">
                            <!--一级权限-->
                            <el-col :span="5">
                                <el-tag>{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2,index2) in item.children" :key="item2.id" :class="[index2 === 0 ? '' : 'rowtop']">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                                <el-tag type="warning" @close="removeRightById(scope.row,item3.id)"
                                                v-for="item3 in item2.children"
                                                :key="item3.id" closable>{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" ></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="400px">
                    <template  class="btnGroup">
                        <el-button type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting"  size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    name:'Roles',
    data(){
        return{
            //角色列表数据
            roleList: []
        }
    },
    created(){
        this.getRoleList()
    },
    methods: {
        //获取所有角色列表
       async getRoleList(){
           const {data: res} = await this.$http.get('roles')
           if(res.meta.status !== 200){
               return this.$message.error('获取失败')
           }
           this.roleList = res.data
        //    console.log(this.roleList)
        },
        //删除用户权限
       async removeRightById(role,rightId){
          const result  = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err) 
        // console.log(result)
        if(result == 'confirm'){
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200){
                this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            // this.getRoleList() 
            role.children = res.data
           } 
       }
    }
}
</script>
<style scope>
   .el-table{
       margin-top: 15px;
   }
   .el-tag{
       margin: 7px;
       margin-right: 0;
   }
   .rowtop{
       border-top: 1px solid #eee;
   }
   .rowBorder{
       border-bottom: 1px solid #eee;
   }
</style>