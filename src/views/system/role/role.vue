<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true"
             size="small">
      <el-form-item>
        <el-input v-model="searchModel.roleName" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right"@click="resetValue">重置</el-button>
        <el-button type="success" icon="el-icon-plus"@click="openAddWindow()">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table :data="roleList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
      <el-table-column prop="id" label="角色编号" width="100" align="center"></el-table-column>
      <el-table-column prop="roleKey" label="角色权限字符串"></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="small"
                     @click="handleEdit(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small"
                     @click="handleDelete(scope.row)">删除</el-button>
          <el-button icon="el-icon-setting" type="primary" size="small"
                     @click="assignRole(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加和修改角色窗口 -->
    <system-dialog :title="roleDialog.title" :visible="roleDialog.visible" :width="roleDialog.width"
                    :height="roleDialog.height" @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="role" ref="roleForm" :rules="rules" label-width="80px" :inline="false"
                  size="small">
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="role.roleKey"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input type="textarea" v-model="role.remark" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 分配权限树窗口 -->
    <system-dialog :title="assignDialog.title" :visible="assignDialog.visible" :width="assignDialog.width"
                   :height="assignDialog.height" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
      <div slot="content">
        <el-tree ref="assignTree" :data="assignTreeData" node-key="id" :props="defaultProps" empty-text="暂无数据"
                 :show-checkbox="true" :highlight-current="true" default-expand-all></el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入role.js中的方法
import {getRoles,addRole,updateRole,checkRole,deleteRole,getAssignTreeApi} from '@/api/role'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
import leafUtils from '@/utils/leaf'


export default {
  name: 'department',
  components:{
    SystemDialog
  },
  data() {
    return {
      rules: {
        roleKey: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
        name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }]
      },

      //分配权限窗口属性
      assignDialog: {
        title: '',
        visible: false,
        height: 450,
        width: 300
      },
      roleId: '', //角色ID
      assignTreeData: [], //树节点数据
      //树节点属性
      defaultProps: {
        children: 'children',
        menuName: 'menuName'
      },

      //添加和修改角色窗口属性
      roleDialog: {
        title: '',
        visible: false,
        height: 230,
        width: 500
      },
      //角色对象
      role: {
        id:"",
        roleKey:"",
        name:"",
        remark:"",
        createUser:this.$store.getters.userId
      },

//查询条件
      searchModel: {
        roleName: '',
        pageNo:1,
        pageSize:10,
        userId:this.$store.getters.userId
      },
      roleList: [], //数据列表
      tableHeight: 0, //表格高度
      pageNo: 1, //当前页码
      pageSize: 10, //每页显示数量
      total: 0, //总数量
    }
  },
  created(){
    this.search()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods:{
   async search(pageNo=1,pageSize=10){
     //修改当前页码
     this.searchModel.pageNo=pageNo
     //修改每页显示数量
     this.searchModel.pageSize=pageSize
      let res=await getRoles(this.searchModel)
     if (res.success){
       console.log(res)
       this.roleList=res.data.records
       this.total=res.data.total
     }
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    handleSizeChange(size){
      //修改每页显示数量
      this.pageSize=size
      this.search(this.pageNo,size)
    },
    /**
     * 当页码发生变化时触发该事件
     */
    handleCurrentChange(page){
      //修改当前页码
      this.pageNo=page
      this.search(page,this.pageSize)
    },

    resetValue(){
      this.searchModel.roleName=''
      this.search()
    },
    handleEdit(row){
      //数据回显
      this.$objCopy(row, this.role); //将当前编辑的数据复制到role对象中
      //设置窗口标题
      this.roleDialog.title = "编辑角色";
      //显示编辑角色窗口
      this.roleDialog.visible = true;
    },
    async handleDelete(row){
      //检查角色是否被使用
      let result=await checkRole({id:row.id})
      if (!result.success){
        this.$message.warning(result.msg)
      }else {
        //确定是否删除
        let confirm=await this.$myconfirm("确定要删除该数据吗?")
        if (confirm){
          let res=await deleteRole({id:row.id})
          if (res.success){
            this.$message.success("删除成功!")
            this.search(this.pageNo,this.pageSize)
          }else {
            this.$message.error("删除失败!")
          }
        }
      }
    },
    async assignRole(row){
      //设置角色ID
      this.roleId = row.id
      //构建查询参数
      let params={
        roleId:row.id,//角色ID
        userId:this.$store.getters.userId//用户ID
      }
      //发送查询分配权限菜单请求
      let res=await getAssignTreeApi(params)
      if (res.success){
        //获取到当前登录用户所拥有的菜单权限
        console.log(res)
        let menuList=res.data.menuList
        //获取当前被分配角色的已经拥有的菜单权限
        let checkList=res.data.checkList
        //判断当前菜单是否是最后一级
        let {setLeaf}=leafUtils()
        //设置权限菜单列表
       let newMenuList = setLeaf(menuList)
        //设置树节点菜单数据
        this.assignTreeData=newMenuList
        //将回调延迟到下次DOM更新循环之后执行,在修改数据之后立即使用它,然后等待DOM更新。
        this.$nextTick(() => {
        //获取树菜单的节点数据
          let nodes = this.$refs.assignTree.children
        //设置子节点
          this.setChild(nodes, checkList)
        });
    }
      //设置窗口标题
      this.assignDialog.title = `给【${row.name}】分配权限`
      //显示窗口
      this.assignDialog.visible = true
    },

    /**
     *设置子节点
     */
    setChild(childNodes, checkList){
      //判断是否存在子节点
      if (childNodes&&childNodes.length>0) {
        //循环所有权限
        for (let i = 0; i < childNodes.length; i++) {
          //根据data或key获取树组件中的node节点
          let node = this.$refs.assignTree.getNode(childNodes[i])
          //判断是否已经拥有对应的角色数据
          if (checkList && checkList.length > 0) {
            //循环遍历已有的权限集合
            for (let j = 0; j < checkList.length; j++) {
              //找到已经存在的菜单权限节点
              if (checkList[j] == childNodes[i].id) {
                //如果节点是展开状态，则将树节点选中
                if (childNodes[i].open) {
                  this.$refs.assignTree.setChecked(node, true)
                  break
                }
              }
            }
          }
          //如果存在子节点，则递归选中
          if (childNodes[i].children) {
            this.setChild(childNodes[i].children, checkList)
          }
        }
      }
    },

    /**
     * 分配权限窗口取消事件
     */
    onAssignClose() {
      this.assignDialog.visible = false
    },
    /**
     * 分配权限窗口确认事件
     */
    async onAssignConfirm() {

    },

    /**
     * 打开添加窗口
     */
    openAddWindow(){
      //清空表单数据
      this.$resetForm("roleFrom",this.role);
      this.roleDialog.title = '新增角色'//设置窗口标题
      this.roleDialog.visible = true//显示窗口
    },
    /**
     * 窗口取消事件
     */
    onClose(){
      this.roleDialog.visible=false
    },
    /**
     * 窗口确认事件
     */
    onConfirm(){
      //表单验证
      this.$refs.roleForm.validate(async (valid)=>{
        //验证通过
        if (valid){
          let res=null
          //判断当前是新增操作还是修改操作
          if (this.role.id===""){
            //发送添加请求
            res=await addRole(this.role)
          }else {
            res=await updateRole(this.role)
          }
          //判断是否成功
          if (res.success){
            this.$message.success("添加成功!")
            //刷新数据
            this.search()
            //关闭窗口
            this.roleDialog.visible=false;
          }else {
            this.$message.error("添加失败!")
          }
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
