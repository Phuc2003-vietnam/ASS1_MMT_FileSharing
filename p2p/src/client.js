const fs = require("fs");
const net = require("net");
const path = require("path");
const EventEmitter = require('events');
const emitter = new EventEmitter();

const filename = '100kB.docx'; // The name of the file you want to send
const address = path.join(process.cwd(), "repo", filename);
const fileStream = fs.createReadStream(address);

const socket = new net.Socket();
const socket2 = new net.Socket();

socket.connect(8881, "127.0.0.1", function () {
    console.log('Peer 1 connected to Peer 2.');

    // Sending the filename to the server
    socket.write(JSON.stringify(filename));
    console.log("finish name");
    socket.on("data",()=>{
      emitter.emit('download');
    })
    // Read the file and send it to Peer 2
  
});
emitter.on('download',()=>{
    socket2.connect(8882, "127.0.0.1", function () {
 
        fileStream.pipe(socket2)
            .on('finish', function () {
                console.log('File sent successfully.');
                socket.end(); // Close the socket after sending the file
            })
            .on('error', function (err) {
                console.error('Error reading file:', err);
            });
    });
})


socket.on('error', function (err) {
    console.error('Socket error:', err);
});
