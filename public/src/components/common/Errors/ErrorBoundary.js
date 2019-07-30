import React, { Component } from 'react';
import { Button, Col, Row, Result } from 'antd';
import './style.less';

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});
	}

	render() {
		const { error, errorInfo } = this.state;
		let resultProps = {
			title: '程序发生错误了',
			subTitle: 'Please check and modify the left information before resubmitting.',
			extra: [
				<a href={'/'} key={'id'}>
					<Button
						style={{ width: 180, height: 40, marginTop: 40, marginLeft: 140 }}
						type="primary"
					>
						<span>返回首页</span>
					</Button>
				</a>
			]
		};
		if (errorInfo) {
			return (
				<div id={'error-boundary-wrap'}>
					<h1>捕捉到错误啦！</h1>
					<Row>
						<Col span={12} offset={1}>
							<section style={{ whiteSpace: 'pre-wrap' }}>
								{error && error.toString()}
								<br />
								{errorInfo.componentStack}
							</section>
						</Col>
						<Col span={10}>
							<Row>
								<Result status={'error'} {...resultProps} />
							</Row>
						</Col>
					</Row>
				</div>
			);
		}
		// Normally, just render children
		return this.props.children;
	}
}
