var fs = require("fs");
var net = require("net");
var path = require("path");

var server = net.createServer();
var server2 = net.createServer();

var out
var count=1;
server.on('connection', function (conn) {
    console.log('Peer 2 connected.');

    // Receive the filename from Peer 1
    var filename = '';
    conn.on('data', function (data) {
        filename += JSON.parse(data.toString());
        const des = path.join(process.cwd(), "downloads", filename);
        console.log(des);
        out = fs.createWriteStream(des);
        conn.write("hello")
    });
   


        // Receive data and write it to the file
        
}).listen(8881);
console.log('Peer 2 listening on port 8881.');

server2.on('connection', function (conn) {
    console.log('Peer 2 connected.');
        conn.pipe(out)
            .on('finish', function () {
                console.log('File received and saved');
                conn.end(); // Close the connection after receiving the file
            })
            .on('error', function (err) {
                console.error('Error writing file:', err);
            });
}).listen(8882);
console.log('Peer 2 listening on port 8882.');
