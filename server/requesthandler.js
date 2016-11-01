var mysql = require("mysql");
var fs = require("fs");
var crypto = require("crypto");

function index(response, param) {
    console.log("index has been called");
    response.writeHead(200, { contentType: "text/html", "Access-Control-Allow-Origin": "*" });
    var indexpath = "../page/helloworld.html";
    fs.readFile(indexpath, function(err, data) {
        response.end(data);
    });
}

function jquery(response, param) {
    console.log("jquerysource has been called");
    response.writeHead(200, { contentType: "text/javascript", "Access-Control-Allow-Origin": "*" });
    var indexpath = "../resourse/jquery-3.1.0.min.js";
    fs.readFile(indexpath, function(err, data) {
        response.end(data);
    });
}

function csslist(response, param) {
    console.log("csslist has been called");
    response.writeHead(200, { contentType: "text/css", "Access-Control-Allow-Origin": "*" });
    var indexpath = "../css/csslist.css";
    fs.readFile(indexpath, function(err, data) {
        response.end(data);
    });
}

function exitpng(response, param) {
    console.log("exit has been called");
    response.writeHead(200, { contentType: "text/png", "Access-Control-Allow-Origin": "*" });
    var indexpath = "../resourse/exit.png";
    fs.readFile(indexpath, function(err, data) {
        response.end(data);
    });
}

function eventjs(response, param) {
    console.log("event.js has been called");
    response.writeHead(200, { contentType: "text/javascript", "Access-Control-Allow-Origin": "*" });
    var indexpath = "../js/event.js";
    fs.readFile(indexpath, function(err, data) {
        response.end(data);
    });
}

function userconfirm(response, param) {
    response.writeHead(200, { contentType: "text/json", "Access-Control-Allow-Origin": "*" });
    var sqlconnection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'dongbaoliang',
        password: 'dongbaoliang',
        port: '3306',
        database: 'helloworld'
    });
    sqlconnection.connect(function(err) {
        if (err) {
            console.log("connect failed");
            return;
        }
        console.log("connect succeed");
    });
    sqlconnection.query("select * from user", function(err, rows, field) {
        var result = {};
        if (err) {
            console.log("userconfirm failed!");
            result.success = false;
            result.err = err;
            response.end(JSON.stringify(result));
            return;
        }
        var password = crypto.createHash('md5').update(param.password).digest('hex');
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].username == param.username && rows[i].password == password) {
                result.success = true;
                result.id = rows[i].id;
                response.end(JSON.stringify(result));
                console.log("userconfirm succeed : " + JSON.stringify(result));
                break;
            }
        }
        if (!result.success) {
            result.success = false;
            response.end(JSON.stringify(result));
            console.log("userconfirm failed : " + JSON.stringify(result));
        }
    });
    sqlconnection.end();
}

function saveuser(response, param) {
    response.writeHead(200, { contentType: "text/json", "Access-Control-Allow-Origin": "*" });
    var sqlconnection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'dongbaoliang',
        password: 'dongbaoliang',
        port: '3306',
        database: 'helloworld'
    });
    sqlconnection.connect(function(err) {
        if (err) {
            console.log("connect failed");
            return;
        }
        console.log("connect succeed");
    });
    var username = param.username;
    var password = crypto.createHash('md5').update(param.password).digest('hex');
    sqlconnection.query("insert into user(username,password) values(?,?)", [username, password], function(err) {
        var result = {};
        if (err) {
            console.log("saveuser failed!");
            result.success = false;
            result.err = err;
            response.end(JSON.stringify(result));
            return;
        }
        result.success = true;
        console.log("save user succeed: " + JSON.stringify(result));
        response.end(JSON.stringify(result));
    });
    sqlconnection.end();
}

function placeshavebeen(response, param) {
    response.writeHead(200, { contentType: "text/json", "Access-Control-Allow-Origin": "*" });
    var sqlconnection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'dongbaoliang',
        password: 'dongbaoliang',
        port: '3306',
        database: 'helloworld'
    });
    sqlconnection.connect(function(err) {
        if (err) {
            console.log("connect failed");
            return;
        }
        console.log("connect succeed");
    });
    sqlconnection.query("select * from locationlist where id=?", [param.id], function(err, rows, field) {
        var result = {};
        if (err) {
            console.log("select locationlist failed!");
            result.success = false;
            response.end(JSON.stringify(result));
            return;
        }
        result.success = true;
        result.content = [];
        for (var i = 0; i < rows.length; i++) {
            result.content.push(rows[i]);
        }
        console.log("select locationlist success! " + JSON.stringify(result));
        response.end(JSON.stringify(result));
    });
    sqlconnection.end();
}

function addmark(response, param) {
    response.writeHead(200, { contentType: "text/json", "Access-Control-Allow-Origin": "*" });
    var sqlconnection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'dongbaoliang',
        password: 'dongbaoliang',
        port: '3306',
        database: 'helloworld'
    });
    sqlconnection.connect(function(err) {
        if (err) {
            console.log("connect failed");
            return;
        }
        console.log("connect succeed");
    });
    sqlconnection.query("select count(*) as count from locationlist where id = ? and time = ?", [param.id,param.time], function(err, rows, field) {
        var result = {};
        if (err) {
            console.log("select locationlist failed!");
            result.success = false;
            response.end(JSON.stringify(result));
            return;
        }
        if (rows[0].count == 0) {
            sqlconnection.query("insert into locationlist(id,lat,lng,address,time) values(?,?,?,?,?)", [param.id, param.lat, param.lng, param.address, param.time], function(err) {
                var result = {};
                if (err) {
                    console.log("addmark failed! "+err);
                    result.success = false;
                    result.err = err;
                    response.end(JSON.stringify(result));
                    return;
                }
                result.success = true;
                console.log("addmark succeed: " + JSON.stringify(result));
                response.end(JSON.stringify(result));
                sqlconnection.end();
            });
        }
        console.log("select locationlist success! " + JSON.stringify(result));
        response.end(JSON.stringify(result));
    });

   // sqlconnection.end();
}


exports.index = index;
exports.jquery = jquery;
exports.csslist = csslist;
exports.exitpng = exitpng;
exports.eventjs = eventjs;
exports.userconfirm = userconfirm;
exports.saveuser = saveuser;
exports.placeshavebeen = placeshavebeen;
exports.addmark = addmark;
