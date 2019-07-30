const officegen = require('officegen')
const fs = require('fs')

module.exports = {
    toWord: function (res, result) {
        // let text = '';
        // Create an empty Word object:
        let docx = officegen('docx')

        // Officegen calling this function after finishing to generate the docx document:
        docx.on('finalize', function (written) {
            console.log(
                'Finish to create a Microsoft Word document.'
            )
        })

        // Officegen calling this function to report errors:
        docx.on('error', function (err) {
            console.log(err)
        })

        // Create a new paragraph:
        let pObj = docx.createP()
        // pObj.options.align = 'right'
        pObj.options.indentLeft = 300
        pObj.options.Alignment  = 2
        result.words_result.map(function (item) {
            pObj = docx.createP();
            pObj.addText(item.words, { indentLeft: 450, border: 'dotted', });
        })
        let out = fs.createWriteStream(__dirname + '/../assets/file/example.docx')

        out.on('error', function (err) {
            console.log(err)
            res.json({ code: 500, msg: err })
        })

        out.on('finish', function () {
            result.code = 200;
            result.message = 'success';
            res.json(result);
        })

        // Async call to generate the output file:
        docx.generate(out);
        // res.writeHead(200, {
        //     // 注意这里的type设置，导出不同文件type值不同application/vnd.openxmlformats-officedocument.wordprocessingml.document
        //     // "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        //     "Content-Type": "application/msword",
        //     'Content-disposition': 'attachment; filename=out' + '.docx'
        // }); //moment(new Date().getTime()).format('YYYYMMDDhhmmss') +
        // res.json({ code: 200 });
        // docx.generate(res);
        // res.end();
    }
}