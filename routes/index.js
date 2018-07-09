var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var express = require('express');
var path = require('path');
var fs = require('fs');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/* GET home page. */
router.use('/static', express.static('resources'));
//
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/sendFile', function (req, res) {
    var form = new multiparty.Form();
    var controlPassword;
    var uploadFile = {uploadPath: '', type: '', size: 0};
    var errors = [];

    form.on('field', function (name, value) {
        controlPassword = parseInt(value);
    });


    form.on('part', function (part) {
        if(controlPassword != '999') {
            //res.write('dsf');
            res.end('Error password!');
            return;
        }

        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        uploadFile.path = './uploadDir/' + part.filename;

        if (errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
            res.end('Download are successful!');
        }
        else {
            part.resume();
        }
    });

    form.parse(req);
});

module.exports = router;
