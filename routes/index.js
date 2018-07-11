var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var express = require('express');
var path = require('path');
var fs = require('fs');

/*var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();*/
var passworws = {
    passToDownloads: '999',
    passToGetListFiles: '999'
}

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/* GET home page. */
router.use('/static', express.static('resources'));
//
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/listOfFiles/:id', function (req, res) {

    if(req.params.id != passworws.passToGetListFiles){
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
        controlPassword = parseInt(value);
    });


    form.on('part', function (part) {
        if(controlPassword != passworws.passToDownloads) {
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

/*router.post('/sendFile', multipartyMiddleware, function (req, res) {
    var file = req.files.file;
    req.files
    console.log(file.name);
    console.log(file.type);
    console.log(file.path);

    fs.writeFile('./uploadDir/' + file.name, file, function (err) {
        if (err) {
            return console.warn(err);
        }
        console.log("The file: " + file.name + " was saved to " + file.path);
    });
});*/

module.exports = router;
