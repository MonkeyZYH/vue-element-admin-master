import http from '@/utils/request'

export function getRoutes() {

}

/**
 * 查询角色列表
 * @param params
 * @returns
 */
export async function getRoles(params) {
  return await http.get('/role/list',params)
}

export async function addRole(data) {
  return await http.post("/role/add",data)
}

export async function updateRole(data) {
  return await http.put("/role/update",data)
}

/**
 * 检查角色是否被使用
 * @param params
 * @returns
 */
export async function checkRole(params) {
  return await http.getRestApi('/role/check',params)
}

export async function deleteRole(params) {
  return await http.delete("/role/delete",params)
}

/**
 * 查询分配权限树列表
 * @returns
 */
export async function getAssignTreeApi(params){
  return await http.get("/role/getAssignMenuTree",params);
}

