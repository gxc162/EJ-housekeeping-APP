import {get,post_json,post} from '../../http/axios'
import {setToken,getToken,removeToken} from '../../utils/auth'
export default {
  namespaced:true,
  state: {
    token:getToken(),
    info:{} //用户信息
  },
  mutations: {
    refreshInfo(state,info){
      state.info = info;
    },
    refreshToken(state,token){
      state.token = token;
    }
  },
  actions: {
    // 登录
    async login(context,payload){
      // 1.登录
      let response = await post_json("/user/login",payload);
      let token = response.data.token;
      // 2.将token缓存起来？localStorage
      setToken(token);
      // 3. 将token维护到状态机中
      context.commit("refreshToken",token);
    },
    // 通过token获取info
    async info(context,token){
      console.log('info');
      let response = await get("/user/info",{token});
      // 将用户信息设置到info中
      await context.commit("refreshInfo",response.data)
      console.log('info-end');
    },
    // 退出
    async logout(context){
      // 1. 请求后台退出
      await post('/user/logout');
      // 2. 清理本地缓存
      removeToken();
      // 3. 清理store
      context.commit('refreshToken','');
      context.commit('refreshInfo',{});
    }
  }
}