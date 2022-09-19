<template>
  <el-main>
    <!-- 新增按钮 -->
    <el-button type="success" icon="el-icon-plus" @click="openAddWindow">新增</el-button>
      <!-- 数据表格 -->
      <el-table
        style="margin-top: 10px"
        :height="tableHeight"
        :data="menuList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
        :border="true" stripe>
        <el-table-column prop="menuName" label="菜单名称"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon" v-if="scope.row.icon.includes('el-icon')" >
            </i>
            <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="路由名称"></el-table-column>
        <el-table-column prop="path" label="路由地址"></el-table-column>
        <el-table-column prop="component" label="组件路径"></el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editMenu(scope.row)"
            >编辑
            </el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteMenu(scope.row)"
            >删除
            </el-button
            >
          </template>
          </el-table-column>
      </el-table>
  </el-main>
</template>

<script>
//导入menu.js脚本文件
import menu from '@/api/menu'
export default {
  name: 'menu',
  data(){
    return{
      menuList:[],
      tableHeight:0,
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

    }
  },
}
</script>

<style scoped>

</style>
