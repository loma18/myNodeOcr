import axios from 'axios';

// axios.defaults.timeout = 18000000;
// axios.defaults.baseURL = '/hxAuth'; //增加代理路径
// axios.defaults.withCredentials = true;


/**
 * 如果登录了，就把token写入header
 * */
// 请求拦截

// axios.interceptors.request.use(
// 	config => {
// 		return ;
// 	},
// 	error => {
// 		return ;
// 	}
// );

// //响应拦截
// axios.interceptors.response.use(
// 	response => {
// 		appStore.hideLoading();

// 		return ;
// 	},
// 	error => {
// 		appStore.hideLoading();
// 		return ;
// 	}
// );

export default axios;
