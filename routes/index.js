var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var express = require('express');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');

var password;
var router = express.Router();

fs.readFile('./resources/hashKey', function(error, data){
    password = data.toString('utf8');
})

var sequrityFunc = function (secret) {
    const hash = crypto.createHash('md5', secret)
        .digest('hex');
    return hash;
}
//console.log(sequrityFunc());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/* GET home page. */
router.use('/static', express.static('resources'));
//
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/listOfFiles/:id', function (req, res) {

    if(sequrityFunc(req.params.id) != password){
        res.status(400).end('Error password!');
        return;
    }

    function objectSend(massOfFiles) {
        this.massOfFiles = massOfFiles;
    };

    var massSend=[];

    fs.readdir('./uploadDir', function(err, items) {
        var strPath = '';

        if (items.length != undefined){
            var objSend = new objectSend(items);
            res.send(objSend);
        } else {
            var it = [];    //если папка пустая оправляем пустой массив
            var objSend = new objectSend(it);
            res.send(objSend);
        }
    });
});

router.get('/getFile/:id', function (req, res) {
    function objectSend(massOfFiles) {
        this.massOfFiles = massOfFiles;
    };
    var massSend=[];

    fs.readFile('./uploadDir/' + req.params.id, function(error, data){
        if(error){

            res.statusCode = 404;
            res.end("Ресурс не найден!");
        }
        else{
            res.end(data);
        }
        return;
    })
});

router.post('/sendFile', function (req, res) {
    var form = new multiparty.Form();
    var controlPassword;
    var uploadFile = {uploadPath: '', type: '', size: 0};
    var errors = [];

    form.on('field', function (name, value) {
        controlPassword = sequrityFunc(parseInt(value));
    });


    form.on('part', function (part) {
        if(controlPassword != password) {
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
