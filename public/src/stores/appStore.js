import { action, observable } from 'mobx';

class AppStore {
	@observable
	loading;

	constructor() {
		this.loading = false;
		this.isLogined = false;
	}

	@action.bound
	loginSubmit = (values) => {
		window.localStorage.clear();
		this.isLogined = true;
	};

	// 全局加载
	@action
	showLoading = () => {
		this.loading = true;
	};

	@action
	hideLoading = () => {
		this.loading = false;
	};
}

const appStore = new AppStore();

export default appStore;
export { AppStore };
