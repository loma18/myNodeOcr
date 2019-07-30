import appStore from 'stores/appStore';
import request from 'utils/request';

/**
 * 通用 get 请求
 * toggleLoading 是否启动全局 loading
 * */
export const fireGetRequest = async (api, values = {}, config = {}) => {
	if (config && config.toggleLoading) {
		appStore.showLoading();
	}
	const resp = await request.get(api, { params: values, ...config });

	appStore.hideLoading();
	return Promise.resolve(resp.data);
};

/**
 * 通用 post 请求
 * toggleLoading 是否启动全局 loading
 * */
export const firePostRequest = async (api, values, config) => {
	if (config && config.toggleLoading) {
		appStore.showLoading();
	}
	const resp = await request.post(api, values, config);

	appStore.hideLoading();
	return Promise.resolve(resp.data);
};

/**
 * 通用 post 请求-JSON 格式
 * */
export const firePostJsonRequest = (api, values) => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	return firePostRequest(api, values, config);
};
