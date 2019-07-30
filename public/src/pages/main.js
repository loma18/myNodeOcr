import React, { Component } from 'react';
import { Upload, Button, message } from 'antd';
import { firePostRequest, fireGetRequest } from 'service/app';
import './style.less';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			imageUrl: '',
			file: '',
			dataList: []
		};
	}

	getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	beforeUpload = (file) => {
		const isJPG = file.type.indexOf('image/') > -1;
		if (!isJPG) {
			message.error('You can only upload JPG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		return isJPG && isLt2M;
	}

	handleChange = info => {
		if (info.file.status === 'uploading') {
			this.setState({ loading: true });
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			this.getBase64(info.file.originFileObj, imageUrl =>
				this.setState({
					imageUrl,
					file: info.file.originFileObj,
					loading: false,
				}, () => {
					console.log('done');
				}),
			);
		}
	};

	handleClick = () => {
		const { file } = this.state;
		let obj = new FormData();
		obj.append('img', file);
		// firePostRequest('/uploadPhoto', obj, { headers: { dataType: 'file' }, responseType: 'blob' }).then(res => {
		firePostRequest('/uploadPhoto', obj).then(res => {
			if (res.code === 200) {
				this.setState({ dataList: res.words_result });
			}
		}).catch(err => console.log(err))
	}

	handleDownLoad = () => {
		fireGetRequest('/downLoad/file', {}, { responseType: 'blob' }).then(res => {
			// if (res.code === 200) {
			let blob = new Blob([res], { type: 'application/msword' });
			let objUrl = URL.createObjectURL(blob);
			window.location.href = objUrl;
			// }f
		}).catch(err => console.log(err))
	}

	transformWordData = () => {
		this.dataExport('docx');
	}

	dataExport(type) {
		var doc = "";
		var html = '';
		let marginTop = 0,
			location = {},
			lines = 0,
			spanCount = 0,
			left = 0; //当前font元素marginLeft
		let list = this.transformData();
		for (let i = 0; i < list.length; i++) {
			location = list[i].location;
			html = '';
			if (i > 0) {
				marginTop = location.top - (list[i - 1].location.top + list[i - 1].location.height);
				marginTop = marginTop > 0 ? marginTop : 0;
				if (marginTop > location.height) {
					lines = Math.floor(marginTop / (location.height + location.top / 2));
					for (let j = 0; j < lines; j++) {
						doc += `<p class=MsoNormal style="margin-left:0pt;mso-char-indent-count:1.0000;margin-top:0pt;margin-bottom:0pt"><span
						style="mso-spacerun:'yes';font-family:Calibri;mso-bidi-font-family:黑体;font-size:11.0000pt;">
						<font face="Calibri"></font>
					</span><span style="mso-spacerun:'yes';font-family:Calibri;mso-bidi-font-family:黑体;font-size:11.0000pt;">
						<o:p></o:p>
					</span></p>`;
					}
				}
			} else {
				marginTop = 0;
			}
			html += `<span
			style="mso-spacerun:'yes';font-family:Calibri;mso-bidi-font-family:黑体;font-size:11.0000pt;"><font face="Calibri">${list[i].words}</font></span>`;
			if (list[i].children) {
				for (let z = 0, len = list[i].children.length; z < len; z++) {
					if (z === 0) {
						left = list[i].children[z].location.left - list[i].location.left - list[i].location.width;
					} else {
						left = list[i].children[z].location.left - list[i].children[z - 1].location.left - list[i].children[z - 1].location.width;
					}
					spanCount = Math.ceil(left / 36);
					for (let y = 0; y < spanCount; y++) {
						html += `<span style="mso-spacerun:'yes';font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;
						mso-bidi-font-family:Calibri;font-size:11.0000pt;mso-font-kerning:0.0000pt;">&#9;</span>`;
					}
					html += `<span
					style="mso-spacerun:'yes';font-family:Calibri;mso-bidi-font-family:黑体;font-size:11.0000pt;">
					<font face="Calibri">${list[i].children[z].words}</font></span>`;
				}
			}
			doc += `<p class=MsoNormal style="margin-left:${location.left}pt;mso-char-indent-count:1.0000;margin-top:${marginTop}pt;margin-bottom:0pt">
			${html}
		<span style="mso-spacerun:'yes';font-family:Calibri;mso-bidi-font-family:黑体;font-size:11.0000pt;">
			<o:p></o:p>
		</span></p>`;
		}
		var docFile = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' 
		xmlns:dt='uuid:C2F41010-65B3-11d1-A29F-00AA00C14882'  xmlns='http://www.w3.org/TR/REC-html40'>
		<head>
		<meta http-equiv=Content-Type content="text/html; charset=utf-8">
		<meta name=ProgId content=Word.Document>
		<meta name=Generator content="Microsoft Word 14">
		<meta name=Originator content="Microsoft Word 14">
		<title></title>
		<style>
		@font-face {
			font-family: "Times New Roman";
		}

		@font-face {
			font-family: "宋体";
		}

		@font-face {
			font-family: "Calibri";
		}

		@font-face {
			font-family: "Calibri";
		}

		@font-face {
			font-family: "黑体";
		}

		@font-face {
			font-family: "Wingdings";
		}

		p.MsoNormal {
			mso-style-name: 正文;
			mso-style-parent: "";
			font-family: Calibri;
			mso-bidi-font-family: 黑体;
			font-size: 11.0000pt;
		}

		span.10 {
			font-family: Calibri;
		}

		span.msoIns {
			mso-style-type: export-only;
			mso-style-name: "";
			text-decoration: underline;
			text-underline: single;
			color: blue;
		}

		span.msoDel {
			mso-style-type: export-only;
			mso-style-name: "";
			text-decoration: line-through;
			color: red;
		}

		table.MsoNormalTable {
			mso-style-name: 普通表格;
			mso-style-parent: "";
			mso-style-noshow: yes;
			mso-tstyle-rowband-size: 0;
			mso-tstyle-colband-size: 0;
			mso-padding-alt: 0.0000pt 5.4000pt 0.0000pt 5.4000pt;
			mso-para-margin: 0pt;
			mso-para-margin-bottom: .0001pt;
			mso-pagination: widow-orphan;
			font-family: 'Times New Roman';
			font-size: 10.0000pt;
			mso-ansi-language: #0400;
			mso-fareast-language: #0400;
			mso-bidi-language: #0400;
		}

		@page {
			mso-page-border-surround-header: no;
			mso-page-border-surround-footer: no;
		}

		@page Section0 {
			margin-top: 72.0000pt;
			margin-bottom: 72.0000pt;
			margin-left: 90.0000pt;
			margin-right: 90.0000pt;
			size: A4 portrait;
			layout-grid: 18.0000pt;
		}

		div.Section0 {
			page: Section0;
		}
		</style>
		</head>
		<body style="tab-interval:36pt;">
		<!--StartFragment-->
		<div class="Section0" style="layout-grid:18.0000pt;">${doc}</div>
		<!--EndFragment-->
		</body>
		</html>`;
		var base64data = "base64," + window.btoa(unescape(encodeURIComponent(docFile)));
		if (type == 'docx') {
			window.open('data:application/msword;' + base64data);
		} else if (type == 'excel') {
			window.open('data:application/vnd.ms-excel;' + base64data);
		}
	}

	transformData = () => {
		const { dataList } = this.state;
		let list = JSON.parse(JSON.stringify(dataList)),
			minLeft = list[0].location.left,
			location = {}, //记录当前行记录信息
			location1 = {}, //记录上一行位置信息
			lastTop = 0;
		for (let i = 0, len = list.length; i < len; i++) {
			location = list[i].location;
			if (location.left < minLeft) {
				minLeft = location.left;
			}
		}
		for (let j = 0, len1 = list.length; j < len1; j++) {
			location = list[j].location;
			location.left -= minLeft;
		}
		for (let z = 1; z < list.length; z++) {
			location = list[z].location;
			location1 = list[z - 1].location;
			if (!lastTop) {
				lastTop = location1.top;
			}
			if (Math.abs(location.top - location1.top) <= 4) {
				if (!list[z - 1].children) {
					list[z - 1].children = [];
				}
				list[z - 1].children.push(list[z]);
				list.splice(z, 1); //合并同行信息
				z--;
				continue;
			}
			//判断是否是相同段落,如果是,则拼接到上一行
			if (Math.abs(location.top - lastTop - location1.height) < location.height && location.left < 40) {
				list[z - 1].words += list[z].words;
				lastTop = list[z].location.top;
				list.splice(z, 1); //拼接上一行信息
				z--;
				continue;
			} else {
				lastTop = location.top;
			}
		}
		return list;
	}

	render() {
		const { imageUrl, dataList } = this.state;
		return (
			<div className={'container'}>
				<Upload
					name="avatar"
					listType="picture-card"
					className="avatar-uploader"
					showUploadList={false}
					action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
					beforeUpload={this.beforeUpload}
					onChange={this.handleChange}
				>
					{imageUrl ? <img src={imageUrl} alt="avatar" /> : ' '}
				</Upload>
				<Button onClick={this.handleClick} disabled={!imageUrl}>转换图片</Button>
				<Button onClick={this.handleDownLoad} disabled={dataList.length == 0}>下载转换后word格式文件</Button>
				<Button onClick={this.transformWordData} disabled={dataList.length == 0}>生成word文档</Button>
				<div id="afterTransfer">
					{dataList.map((item, key) => {
						return <p key={key}>{item.words}</p>
					})}
				</div>
			</div>
		);
	}
}
export default Main;
