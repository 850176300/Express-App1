var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var app = express();
var URL = require('url');
var http = require('http')
var crypto = require('crypto');
var querystring = require('querystring')
var User = require('../models/User')
var urlencode = require('urlencode')
var Buffer = require("buffer").Buffer;
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
    var req = require(isHttp?'http':'https').request(options, function(pres){
        pres.setEncoding('utf8')
        pres.on('data', function(data){
            console.log("---------------data----------------", data)
            res.send(data)
        });
    })

    req.write(content)
    req.end()
 
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
    var req = require(isHttp?'http':'https').request(options, function(pres){
        // pres.setEncoding('utf8')
        pres.on('data', function(data){
            console.log("---------------data----------------", data)
            res.send(data)
        });
       
    })

    req.write(content)
    req.end()
 
});

router.get('/register', function(req, res, next){
    var params = URL.parse(req.url, true).query;
    var user = new User();
    var userId = 0;
    var isNewUser = false;
    user.findUser(params.openId, function(data){
        if (data.code == 200){
            if (data.contain == false){
                isNewUser = true;
                user.registUser(params.openId, params.nickName, params.avatar, params.parentId ? parseInt(params.parentId) : 0, function(data2){
                    if (data2.code == 200){
                        res.send(JSON.stringify({code:200, userId:data2.id, newUser:true}))
                        userId = data2.id
                    }else {
                        res.send(JSON.stringify({code:data2.code}))
                    }
                })
            }else {
                res.send(JSON.stringify({code:200, userId:data.data.id, newUser:true}))
                userId = data.data.id
            }
        }else {
            res.send(JSON.stringify({code:data.code}))
        }
    })
    
});

router.get('/insertInvite', function(req, res, next){
    var params = URL.parse(req.url, true).query;
    var user = new User();
    console.log("------insertInvite-----------", params)
    if (params.parentId && params.inviteId){
        user.insertInviteUser(params.parentId, params.inviteId, function(data){
            res.send(JSON.stringify(data))
        })
    }else {
        res.send(JSON.stringify({code:500}))
    }
    
})


router.get('/userInfo', function(req, res, next){
    var params = URL.parse(req.url, true).query;
    var user = new User();
    if (params.userId){
        user.getUserInfo(params.userId, function(data){
            res.send(JSON.stringify(data))
        })
    }else {
        res.send(JSON.stringify({code:500}))
    }
})

router.get('/getInviteInfo', function(req, res, next){
    var params = URL.parse(req.url, true).query;
    var user = new User();
    if (params.userId){
        user.getInvitedUsers(params.userId, function(data){
            res.send(JSON.stringify(data))
        })
    }else {
        res.send(JSON.stringify({code:500}))
    }
})

router.get('/collectionRewards', function(req, res, next){
    var params = URL.parse(req.url, true).query;
    var user = new User();
    if (params.userId){
        user.collectionRewards(params.userId, function(data){
            res.send(JSON.stringify(data))
        })
    }else {
        res.send(JSON.stringify({code:500}))
    }
})

router.get('/getpois', function(req, res, next){
    var params = URL.parse(req.url, true).query;
    var str = '/geosearch/v2/bound?'
    Object.keys(params).forEach(function(key){
        str += key + '='
        str += urlencode(params[key])+'&'
    })
    str += 'geotable_id=202292&output=json&ak=lkm66St21BIVIOyXS7NcihuCa8zE2SaG'
    var snStr = str + 'nFlqiinVN45hbRngLjgO0cjcTDztKLBg'
    var buf = new Buffer(snStr);
    var bstr = buf.toString("binary");
    var sn = crypto.createHash("md5").update(bstr).digest("hex");
    str += '&sn='+sn;
    var lbsUrl = 'http://api.map.baidu.com' + str;
    console.log('----lbsUrl-----', lbsUrl)
    var parsedUrl = URL.parse(lbsUrl, true)
    var isHttp = parsedUrl.protocol == 'http:'
    var options = {
        host:parsedUrl.hostname,
        port:parsedUrl.port || (isHttp ? 80:443),
        path:parsedUrl.path,
        method:'GET',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
    var req = require(isHttp?'http':'https').request(options, function(pres){
        // pres.setEncoding('utf8')
        pres.on('data', function(data){
            console.log("---------------data----------------", data)
            res.set('Content-Type', 'text/html');
            res.send(data)
        });
       
    })
    req.end()
})
 

app.use('/', router)
 
module.exports = app;