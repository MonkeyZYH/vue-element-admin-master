<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 右侧用户数据 -->
    <!-- 表格数据 -->
    <el-main>
      <!-- 查询条件 -->
      <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true"
               size="small">
        <el-form-item>
          <el-input v-model="searchModel.userName" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.nickName" placeholder="请输入真实姓名"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.phonenumber" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary"
                     @click="search(pageNo, pageSize)">查询</el-button>
          <el-button icon="el-icon-delete" @click="resetValue()">重置</el-button>
              <el-button icon="el-icon-plus" size="small" type="success"
                         @click="openAddWindow()">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 用户表格数据 -->
      <el-table
        :height="tableHeight"
        :data="userList"
        border
        stripe
        style="width: 100%; margin-bottom: 10px"
      >
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="phonenumber" label="电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column align="center" width="290" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary"
                     size="mini" @click="handleEdit(scope.row)" >编辑</el-button>
            <el-button icon="el-icon-delete" type="danger"
                       size="mini" @click="handleDelete(scope.row)">删除</el-button>
              <el-button icon="el-icon-setting" type="primary"
                         size="mini" @click="assignRole(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
      </el-table>
      <!-- 分页工具栏 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo"
                     :page-sizes="[10, 20, 30, 40, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
import user from '@/api/user'
export default {
  name: 'user',
  data(){
    return{
      containerHeight: 0, //容器高度
      //查询条件对象
      searchModel: {
        userName: "",
        nickName:"",
        phonenumber: "",
        pageNo: 1,
        pageSize: 10,
      },
      userList: [], //用户列表
      tableHeight: 0, //表格高度
      pageNo: 1, //当前页码
      pageSize: 10, //每页显示数量
      total: 0, //总数量
    }
  },
  created() {
//调用查询用户列表
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
//内容高度
      this.containerHeight = window.innerHeight - 85;
//表格高度
      this.tableHeight = window.innerHeight - 220;
    })
  },


  methods:{
    /**
     * 查询用户列表
     */
    async search(pageNo = 1, pageSize = 10) {
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      //发送查询请求
      let res = await user.getUserList(this.searchModel);
      console.log(res)
      if (res.success) {
        this.userList = res.data.records;
        this.total = res.data.total;
      }
    },

    resetValue(){
      //清空查询条件
      this.searchModel = {};
      //重新查询
      this.search()

    },
    openAddWindow(){

    },
    handleEdit(row){

    },
    handleDelete(row){

    },
    assignRole(row){

    },
    handleCurrentChange(page){
      this.pageNo = page;
      //调用查询方法
      this.search(page,this.pageSize);
    },
    handleSizeChange(size){
      //将每页显示的数量交给成员变量
      this.pageSize = size;
      this.search(this.pageNo, size)
    },
  }
}
</script>

<style scoped>

</style>
