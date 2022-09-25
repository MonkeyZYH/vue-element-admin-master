import http from '@/utils/request'

export async function login(data) {
  return await http.login("/user/login",data);
}

export async function getInfo() {
  return await http.get("/user/getInfo");
}

export async function logout() {
  return await http.get("/user/logout")

}

/**
 *获取用户菜单信息
 */
export async function getMenuList(){
  return await http.get("/users/getMenuList");
}

/**
 *  查询用户列表
 */
export default {
  async getUserList(params){
    return await http.get("/users/list",params)
  }
}
