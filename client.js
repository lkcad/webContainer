let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path');

var server = http.createServer((req, res) => {
    //mime类型
    var mime = {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
    };
    var pathName = decodeURI(url.parse(req.url).pathname);

    if (pathName === '/') {
        pathName = '/index.html'
    }

    var ext = path.extname(pathName);
    ext = ext ? ext.slice(1) : 'unknown';

    var contentType = mime[ext] || "text/plain";

    if (contentType === "image/jpeg") {
        res.writeHeader(200, {
            'Content-Type': contentType
        });
        var stream = fs.createReadStream(__dirname + pathName);
        var responseData = [];//存储文件流
        if (stream) {//判断状态
            stream.on('data', function (chunk) {
                responseData.push(chunk);
            });
            stream.on('end', function () {
                var finalData = Buffer.concat(responseData);
                res.write(finalData);
                res.end();
            });
        }
    } else {
        fs.readFile(pathName.substring(1), function (err, data) {
            if (err) {
                res.writeHeader(404, {
                    'Content-Type': "text/html"
                });
                res.end();
            } else {
                res.writeHeader(200, {
                    'Content-Type': contentType
                });
                res.write(data.toString())
                res.end();
            }

        })
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('server start complete')
});