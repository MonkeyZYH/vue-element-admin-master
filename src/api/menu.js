import http from '@/utils/request';

export default {
  /**
   * 查询菜单列表
   * @param params
   * @returns
   */
  async getMenuList(params){
    return await http.get('/menu/list',params);
  },

  /**
   * 获取上级菜单
   * @returns
   */
  async getParentMenuList(params) {
    return await http.get("/menu/parent/list", params)
  },

  /**
   * 添加菜单
   * @returns
   */
  async add(params){
    return await http.post("/menu/add",params)
  },
  /**
   * 修改菜单
   * @returns
   */
  async update(params){
    return await http.put("/menu/update",params)
  },
  /**
   * 检查菜单下是否存在子菜单
   *
   */
  async check(param){
    return await http.getRestApi("/menu/check",param)
  },
  /**
   * 删除菜单
   */
  async delete(params){
    return await http.delete("/menu/delete",params)
  },
}
