var http = require("http");
var url = require("url");
var query = require("querystring");
var objectassign = require("object-assign");
var path = require("path");
var fs = require("fs");

function start(route, handler) {

    function onRequest(request, response) {
        console.log("request received");
        var pathname = url.parse(request.url).pathname;
        var param = [];
        if (request.method == "GET") {
            param = url.parse(request.url, true).query;

        } else if (request.method == "POST") {
            var postdata = "";
            request.addListener("data", function(postchunck) {
                postdata += postchunck;
            });
            request.addListener("end", function() {
                param = objectassign(url.parse(request.url, true).query, query.parse(postdata));
            });
        }
        if (path.extname(pathname) !== "") {
            switch (path.extname(pathname)) {
                case ".html":
                    response.writeHead(200, { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" });
                    console.log(pathname + " has been called");
                    var indexpath = "../page" + pathname;
                    fs.readFile(indexpath, function(err, data) {
                        response.end(data);
                    });
                    break;
                case ".js":
                    response.writeHead(200, { "Content-Type": "text/javascript", "Access-Control-Allow-Origin": "*" });
                    console.log(pathname + " has been called");
                    var indexpath = "../js" + pathname;
                    fs.readFile(indexpath, function(err, data) {
                        response.end(data);
                    });
                    break;
                case ".css":
                    response.writeHead(200, { "Content-Type": "text/css", "Access-Control-Allow-Origin": "*" });
                    console.log(pathname + " has been called");
                    var indexpath = "../css" + pathname;
                    fs.readFile(indexpath, function(err, data) {
                        response.end(data);
                    });
                    break;
                case ".gif":
                    response.writeHead(200, { "Content-Type": "image/gif", "Access-Control-Allow-Origin": "*" });
                    break;
                case ".jpg":
                    response.writeHead(200, { "Content-Type": "image/jpeg", "Access-Control-Allow-Origin": "*" });
                    break;
                case ".png":
                    response.writeHead(200, { "Content-Type": "image/png", "Access-Control-Allow-Origin": "*" });
                default:
                    response.writeHead(404);
            }
        } else
            route(handler, pathname, response, param);
    }

    http.createServer(onRequest).listen(8888);
    console.log("server has started");
}
exports.start = start;
