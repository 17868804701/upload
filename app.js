var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

app.set('view engine', 'ejs');

//创建文件夹
var createFolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};
var uploadFolder = './upload/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        var extname = path.extname(file.originalname);//获取文件扩展名
        // 将保存文件名设置为 字段名 + 时间戳+文件扩展名，比如 logo-1478521468943.jpg
        cb(null, file.fieldname + '-' + Date.now() + extname);
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({storage: storage});

// 访问表单页面
app.get('/', function (req, res, next) {
    res.render('index')
});
// 单图上传
app.post('/upload', upload.single('logo'), function (req, res, next) {
    res.send({ret_code: '上传成功'});
});

//多图片上传
app.post('/uploads', upload.array('logo', 3), function (req, res, next) {
    res.send({ret_code: '上传成功'});
});

app.listen(3000);