var db = require('./database')

var User = function() {};

User.prototype.findUser = function(openId, callback){
    var sql = 'select * from userTB where openId = ?'
    db.pool.getConnection(function(err, connection){
        if (err){
            console.log('----------------err-----------', err)
            callback({code:400})
        }else {
            connection.query(sql, [openId], function(err, result){
                if (err){
                    console.log('----------------err-----------', err)
                    callback({code: 401})
                }else {
                    var resultArr = JSON.parse(JSON.stringify(result));
                    callback({
                        code:200,
                        contain:resultArr.length != 0,
                        data:resultArr[0]
                    })
                }
            })
        }
    })
}

User.prototype.registUser = function(openId, nickname, avatarUrl, parentId, callback){
    var sql = "insert into userTB (nickName,  openId, avatarUrl, parentId) values (?, ?, ?, ?)"
    db.pool.getConnection(function(err, connection){
        if (err){
            console.log('---------err-------------',err)
            callback({code:400})
        }else {
            connection.query(sql, [nickname,openId,avatarUrl,parentId], function(err, result){
                if (err){
                    console.log('---------err-------------',err)
                    callback({code: 401})
                }else {
                    var resultArr = JSON.parse(JSON.stringify(result));
                    callback({
                        code:200,
                        id:parseInt(resultArr.insertId)
                    })
                }
            })
        }
    })
}

User.prototype.insertInviteUser = function(parentId, inviteId, callback){
    var a = 0;
    var sql = 'CALL InsertInvite(?,?,@a)'
    db.pool.getConnection(function(err, connection){
        if (err){
            callback({code:400})
        }else {
            
            connection.query(sql, [parentId,inviteId], function(err, result){
                if (err){
                    console.log(err)
                    callback({code:401})
                }else {
                    callback({code:200})
                }
            })
        }
    })
}

User.prototype.getUserInfo = function(userId, callback){
    var sql = 'select id, nickName, avatarUrl, rose, money from userTB where id = ?';
    db.pool.getConnection(function(err, connection){
        if (err){
            callback({code:400})
        }else {
            connection.query(sql, [userId], function(err, result){
                if (err){
                    console.log(err)
                    callback({code:401})
                }else {
                    var resultArr = JSON.parse(JSON.stringify(result));
                    console.log("----------resultArr----------",resultArr)
                    callback({code:200, data:resultArr[0]})
                }
            })
        }
    })
}

User.prototype.getInvitedUsers = function(userId, callback){
    var sql = 'select userTB.nickName, userTB.avatarUrl, Tb2.rewardIndex, Tb2.rewardRose, Tb2.reward from userTB JOIN (SELECT inviteTB.reward, inviteTB.rewardRose, inviteTB.rewardIndex, inviteTB.invitedId FROM inviteTB WHERE inviteTB.parentId = ?) as Tb2 WHERE Tb2.invitedId = userTB.id';
    db.pool.getConnection(function(err, connection){
        if (err){
            callback({code:400})
        }else {
            connection.query(sql, [userId], function(err, result){
                if (err){
                    console.log(err)
                    callback({code:401})
                }else {
                    var resultArr = JSON.parse(JSON.stringify(result));
                    console.log("----------resultArr----------",resultArr)
                    callback({code:200, data:resultArr})
                }
            })
        }
    })

}

User.prototype.collectionRewards = function(userId, callback){
    var a = 0;
    var sql = 'CALL OneCollection(?,@a)'
    db.pool.getConnection(function(err, connection){
        if (err){
            callback({code:400})
        }else {
            connection.query(sql, [userId], function(err, result){
                if (err){
                    console.log(err)
                    callback({code:401})
                }else {
                    console.log('-------------result------------', result)
                    callback({code:200, rose:a})
                }
            })
        }
    })
}

module.exports = User;