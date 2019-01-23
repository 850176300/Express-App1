var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var app = express();
var URL = require('url');
var http = require('http')
var querystring = require('querystring')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
    var params = req.body;
    var postUrl = URL.parse('https://api.weixin.qq.com/sns/jscode2session', true)
    var isHttp = postUrl.protocol == 'http:'
    var datas = {
        appid:params.appid,
        secret:'8a2e1506b2ff816b828ec6905598ca49',
        js_code:params.code,
        grant_type:'authorization_code'
    }
    var content = querystring.stringify(datas)
    var options = {
        host:postUrl.hostname,
        port:postUrl.port || (isHttp ? 80:443),
        path:postUrl.path,
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length':content.length
        }
    }
    var req = require(isHttp?'http':'https').request(options, function(res){
        console.log("-----------httpVersion-------------------",res.httpVersion);
        console.log("-----------headers-------------------",res.headers);

        console.log("-----------trainers-------------------",res.trainers);

        console.log("-----------method-------------------",res.method);

        console.log("-----------url-------------------",res.url);

        console.log("-----------statusCode-------------------",res.statusCode);

        console.log("-----------socket-------------------",res.socket);

    })

    req.write(content)
    req.end()
    
 
    var user = {}
    var response = {status:1,data:"user"};
    res.send(JSON.stringify(response));
 
});

router.get('/login', function(req, res, next) {
 
    var params = URL.parse(req.url, true).query;
 
    console.log(params)
    var postUrl = URL.parse('https://api.weixin.qq.com/sns/jscode2session', true)
    var isHttp = postUrl.protocol == 'http:'
    var datas = {
        appid:params.appid,
        secret:'8a2e1506b2ff816b828ec6905598ca49',
        js_code:params.code,
        grant_type:'authorization_code'
    }
    var content = querystring.stringify(datas)
    var options = {
        host:postUrl.hostname,
        port:postUrl.port || (isHttp ? 80:443),
        path:postUrl.path,
        method:'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length':content.length
        }
    }
    var req = require(isHttp?'http':'https').request(options, function(res){
        console.log("-----------httpVersion-------------------",res.httpVersion);
        console.log("-----------headers-------------------",res.headers);

        console.log("-----------trainers-------------------",res.trainers);

        console.log("-----------method-------------------",res.method);

        console.log("-----------url-------------------",res.url);

        console.log("-----------statusCode-------------------",res.statusCode);

        console.log("-----------socket-------------------",res.socket);
        res.on('data', function(data){
            console.log("---------------data----------------", data)
        });
    })

    req.write(content)
    req.end()
 
    var response = {status:2,data:"user"};
    res.send(JSON.stringify(response));
 
});
 

app.use('/', router)
 
module.exports = app;