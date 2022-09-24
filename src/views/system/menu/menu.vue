<template>
  <el-main>
    <!-- 新增按钮 -->
    <el-button type="success" icon="el-icon-plus" @click="openAddWindow">新增父菜单</el-button>
      <!-- 数据表格 -->
      <el-table
        style="margin-top: 10px" :height="tableHeight" :data="menuList" row-key="id"
        default-expand-all :tree-props="{ children: 'children' }" :border="true" stripe>
        <el-table-column prop="menuName" label="菜单名称"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon" v-if="scope.row.icon.includes('el-icon')" ></i>
            <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="路由名称"></el-table-column>
        <el-table-column prop="path" label="路由地址"></el-table-column>
        <el-table-column prop="component" label="组件路径"></el-table-column>
        <el-table-column prop="perms" label="权限字段"></el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
<!--            <el-button type="text" size="small" @click="childMenu(scope.row.id)" v-if="scope.row.parentId == 0">新增子菜单</el-button>-->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editMenu(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteMenu(scope.row)">删除</el-button>
          </template>
          </el-table-column>
      </el-table>
    <!--新增或修改窗口-->
    <system-dialog :title="menuDialog.title" :visible="menuDialog.visible" :width="menuDialog.width"
                    :height="menuDialog.height" @onClose="onClose()" @onConfirm="onConfirm()">
      <div slot="content">
        <el-form :model="menu" ref="menuForm" :rules="rules" label-width="80px"
                 :inline="true" size="small">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="parentId" label="菜单类型">
                <el-radio-group v-model="menu.parentId">
                  <el-radio :label="0">父级菜单</el-radio>
                  <el-radio :label="1">子级菜单</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="parentName" size="small" label="所属菜单">
            <el-input @click.native="selectParentMenu" v-model="menu.parentName" :readonly="true"></el-input>
          </el-form-item>
        <el-form-item prop="menuName" size="small" label="菜单名称">
          <el-input v-model="menu.menuName"></el-input>
        </el-form-item>
        <el-form-item size="small" label="菜单图标">
        <my-icon @selecticon="setIcon" ref="child"></my-icon>
        </el-form-item>
        <el-form-item prop="name" size="small" label="路由名称">
          <el-input v-model="menu.name"></el-input>
        </el-form-item>
        <el-form-item prop="path" size="small" label="路由地址">
          <el-input v-model="menu.path"></el-input>
        </el-form-item>
        <el-form-item prop="component" size="small" label="组件路径">
          <el-input v-model="menu.component"></el-input>
        </el-form-item>
        <el-form-item prop="perms" size="small" label="权限字段">
          <el-input v-model="menu.perms"></el-input>
        </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 选择所属菜单弹框 -->
    <system-dialog :title="parentDialog.title" :width="parentDialog.width" :height="parentDialog.height"
                    :visible="parentDialog.visible" @onClose="onParentClose" @onConfirm="onParentConfirm">
      <div slot="content">
        <el-tree style="font-size: 14px" ref="parentTree" :data="parentMenuList" node-key="id" :props="defaultProps"
                  empty-text="暂无数据" :show-checkbox="false" default-expand-all :highlight-current="true" :expand-on-click-node="false"
                  @node-click="handleNodeClick">
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <!-- 长度为0说明没有下级 -->
            <span v-if="data.children.length == 0">
          <i class="el-icon-document" style="color: #8c8c8c; font-size: 18px"/></span>
            <span v-else @click.stop="openBtn(data)">
          <svg-icon v-if="data.open" icon-class="add-s"/>
          <svg-icon v-else icon-class="sub-s"/>
            </span>
            <span style="margin-left: 3px">{{ node.data.menuName }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入menu.js脚本文件
import menu from '@/api/menu'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog'
//导入自定义图标组件
import MyIcon from '@/components/system/MyIcon.vue'

export default {
  name: 'menu',
  components: {
    SystemDialog,
    MyIcon
  },
  data(){
    return{
      menuList:[],
      tableHeight:0,
      menuDialog:{
          title:"新增菜单",
          visible:false,
          width:630,
          height:270
      },
      //上级菜单弹框属性
      parentDialog: {
        title: '选择所属菜单',
        width: 280,
        height: 450,
        visible: false
      },
      //树属性定义
      defaultProps: {
        children: 'children',
        menuName: 'menuName'
      },
      parentMenuList: [], //所属菜单列表

      menu:{
        id:'',
        parentId:'',
        parentName:'',
        menuName:'',
        icon:'',
        name:'',
        path:'',
        component:'',
        perms:''
      },
      rules: {
        parentId: [{ required: true, trigger: "change", message: "请选择菜单类型"}],
        menuName: [{ required: true, trigger: "blur", message: "请输入菜单名称" }],
        name: [{ required: true, trigger: "blur", message: "请输入路由名称" }],
        path: [{ required: true, trigger: "blur", message: "请输入路由路径" }],
        component: [{ required: true, trigger: "blur", message: "请输入组件路径" }],
        perms: [{ required: true, trigger: "blur", message: "请输入权限字段" }],
      },
    }
  },
  created() {
    this.search()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180
    })
  },
  methods:{
   async search(){
      let res=await menu.getMenuList();
      if (res.success){
        this.menuList=res.data;
      }
    },
    //新增
    openAddWindow(){
     //快速清空数据
      this.$resetForm("menuForm",this.menu)
      //清空图标选择器
      this.$nextTick(()=>{
        this.$refs.child.userChooseIcon=''
      })
      this.menu.parentId=0
      this.menuDialog.title="新增菜单"
      this.menuDialog.visible=true;
    },
    //关闭取消按钮点击事件
    onClose(){
      this.menuDialog.visible=false;
    },
    //确认按钮点击事件
    onConfirm(){
     //表单验证
      this.$refs.menuForm.validate(async (valid)=>{
        if (valid){
          let res=null
          //判断当前是新增操作还是修改操作
          if (this.menu.id===""){
            //发送添加请求
            res=await menu.add(this.menu)
          }else {
            res=await menu.update(this.menu)
          }
          //判断是否成功
          if (res.success){
            this.$message.success("添加成功!")
            //刷新数据
            this.search()
            //关闭窗口
            this.menuDialog.visible=false;
          }else {
            this.$message.error("添加失败!")
          }
        }
      })
    },
    /**
     * 给icon绑定的点击事件
     * @param icon
     */
    setIcon(icon) {
      this.menu.icon = icon;
    },
    childMenu(id){
      console.log(id)
      this.menu.parentId=1
      this.menuDialog.title="新增菜单"
      this.menuDialog.visible=true;
    },

    /**
     * 选择所属菜单
     */
    async selectParentMenu() {
//显示窗口
      this.parentDialog.visible = true;
//发送查询请求
      let res = await menu.getParentMenuList();
//判断是否成功
      if (res.success) {
//赋值
        this.parentMenuList = res.data;
      }
    },
    /**
     * 选择所属菜单取消事件
     */
    onParentClose() {
      this.parentDialog.visible = false //关闭窗口
    },
    /**
     * 选择所属菜单确认事件
     */
    onParentConfirm() {
      this.parentDialog.visible = false //关闭窗口
    },
    /**
     * 切换图标
     * @param data
     */
    openBtn(data) {
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
    },
    /**
     * 所属菜单节点点击事件
     */
    handleNodeClick(data) {
//所属父级菜单ID
      this.menu.parentId = data.id;
//所属父级菜单名称
      this.menu.parentName = data.menuName;
    },
    /**
     * 打开编辑窗口
     */
    editMenu(row){
      //数据回显
      this.$objCopy(row,this.menu)
      //清空图标选择器
      this.$nextTick(()=>{
        this.$refs.child.userChooseIcon=row.icon
      })
      this.menuDialog.title="编辑菜单"
      this.menuDialog.visible=true;
    },
    /**
     *删除菜单
     */
   async deleteMenu(row){
      //判断菜单下是否存在子菜单
      let result=await menu.check({id:row.id})
      if (!result.success){
        this.$message.warning(result.msg)
      }else {
        //确定是否删除
        let confirm=await this.$myconfirm("确定要删除该数据吗?")
        if (confirm){
          let res=await menu.delete({id:row.id})
          if (res.success){
            this.$message.success("删除成功!")
            this.search()
          }else {
            this.$message.error("删除失败!")
          }
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
