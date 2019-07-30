var express = require('express');
var router = express.Router();
var fs = require("fs");
var formidable = require('formidable');
var toWord = require('../utils').toWord;

/* GET home page. */
// router.get("/uploadPhoto",function (req, res) { //两种调用方式
router.route("/uploadPhoto").get(function (req, res) {    // 到达此路径则渲染uploadPhoto文件，并传出title值供 uploadPhoto.html使用
    res.render("index", { title: '图片文字识别', message: "111" });
})

router.route("/uploadPhoto").post(function (req, res) {
    // 跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    // res.header("Content-type", "application/msword");

    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 编码
    form.keepExtensions = true; // 保留扩展名
    form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
    // form.uploadDir = 'C:/Users/qduser02/Desktop/OCR/Node_OCR/assets/OCR'  // 存储路径
    form.uploadDir = __dirname + '/../assets/OCR'  // 存储路径
    form.parse(req, function (err, fileds, files) { // 解析 formData数据
        if (err) { return console.log(err) }

        let imgPath = files.img.path // 获取文件路径
        let imgName = __dirname + "/../assets/OCR/test." + files.img.type.split("/")[1] // 修改之后的名字
        let data = fs.readFileSync(imgPath) // 同步读取文件

        fs.writeFile(imgName, data, function (err) { // 存储文件
            if (err) { return console.log(err) }

            fs.unlink(imgPath, function () { }) // 删除文件
            //上传图片成功返回code:1
            //res.json({code:1})
            global.nodeServer.getResult(res, imgName, toWord);
        })
    });
});

router.get('/downLoad/file', function (req, res) {
    res.writeHead(200, {
        // 注意这里的type设置，导出不同文件type值不同application/vnd.openxmlformats-officedocument.wordprocessingml.document
        // "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Type": "application/msword;chartset=utf-8",
        'Content-disposition': 'attachment; filename=out' + '.docx'
    });
    let pathname = __dirname + '/../assets/file/example.docx';
    let fReadStream = fs.createReadStream(pathname);

    //读取文件发生错误事件
    fReadStream.on('error', (err) => {
        console.log('发生异常:', err);
    });
    //已打开要读取的文件事件
    fReadStream.on('open', (fd) => {
        console.log('文件已打开:', fd);
    });
    //文件已经就位，可用于读取事件
    fReadStream.on('ready', () => {
        console.log('文件已准备好..');
    })
    fReadStream.on('data', (chunk) => {
        res.write(chunk, 'binary');
    });
    //文件读取完成事件
    fReadStream.on('end', () => {
        res.end();
    });
})

module.exports = router;
