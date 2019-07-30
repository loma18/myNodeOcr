import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from 'components/App';
import { Provider } from 'mobx-react';
import ErrorBoundary from 'components/common/Errors/ErrorBoundary';
import * as stores from 'stores';
import './app.less';

class Index extends Component {
	render() {
		return (
			<div className={'lomaBlog'}>
				<LocaleProvider locale={zhCN}>
					<Provider {...stores}>
						<BrowserRouter>
							<ErrorBoundary>
								<App />
							</ErrorBoundary>
						</BrowserRouter>
					</Provider>
				</LocaleProvider>
			</div>
		);
	}
}
ReactDOM.render(<Index />, document.getElementById('ocr'));
