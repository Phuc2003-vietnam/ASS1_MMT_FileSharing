const net = require("net");
const EventEmitter = require("events");
// const splitStream = require('./split-stream');
const fs = require("fs");
const path = require("path");
const random4digithex = () =>
  Math.random().toString(16).split(".")[1].substr(0, 4);
const randomuuid = () =>
  new Array(8)
    .fill(0)
    .map(() => random4digithex())
    .join("-");
const localIP = require("./locallP");
module.exports = (options) => {
  const connections = new Map();
  const emitter = new EventEmitter();
  const NODE_ID = randomuuid();
  console.log("My Node_ID: " + NODE_ID);
  const neighbors = new Map();
  var out;
  var MY_IP = localIP(); // remember your IP local will change
  //gắn socket với id cụ thể đồng thời tạo event cho proces.s và event cho socket
  const handleNewSocket = (socket) => {
    const socketId = randomuuid();
    connections.set(socketId, socket); //id cua socket
    emitter.emit("exchanged_nodeId", socketId);

    socket.on("close", () => {
      connections.delete(socketId);
      emitter.emit("_disconnect", socketId);
    });
    var reqBuffer = Buffer.from("");

    socket.on("data", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message.type);
      try {
        if (message.type == "handshake") {
          emitter.emit("receive_handshake_nodeId", {
            socketId,
            message: JSON.parse(data.toString()),
          });
        } else if (message.type == "message") {
          //client xử lí: receiver
          if (message.data.type == "send") {
            console.log("From the server to client");
            console.log(message);
            const fileName = message.data.message.fileName;
            console.log("current : " + process.cwd());
            const des = path.join(__dirname, "../", "repo", fileName); //download
            out = fs.createWriteStream(des);
            const response = {
              type: "confirmation",
              ip: MY_IP,
              fileName,
            };
            socket.write(JSON.stringify(response));
          } else if (message.data.type == "fetch") {
            const fileName = message.data.message.fileName;
            const nodeId = message.data.message.nodeId;
            console.log("i am receving message fetch and sending nodide= "+nodeId);
            sendFile({ fileName,nodeId });
          }
        } else if (message.type == "confirmation") {
          //server xử lí : sender
          console.log("From the client to server");
          console.log(message);
          console.log("The ip of the receiver is: " + message.ip);
          const socket2 = new net.Socket();
          const address = path.join(__dirname, "../", "repo", message.fileName);
          const fileStream = fs.createReadStream(address);
          socket2.connect(3001, message.ip, function () {
            // IF test local chang 3001 to 4001
            // cần xet ip là 1 biến
            fileStream
              .pipe(socket2) // server quăng data cho client
              .on("finish", function () {
                console.log("File sent successfully.");
                console.log(neighbors.keys());
                socket2.end(); // Close the socket after sending the file
                console.log(neighbors.keys());
              })
              .on("error", function (err) {
                console.error("Error reading file:", err);
              });
          });
        }
        console.log("end on data -------------------------------");
        console.log("\n");
        console.log("\n");
      } catch (e) {
        // console.error(`Cannot parse message from peer`, data.toString())
        console.log(e);
      }
    });
  };

  const server = net.createServer((socket) => {
    handleNewSocket(socket);
  });
  var fileServer = net.createServer((socket) => {
    // client lưu data vào folder
    socket
      .pipe(out)
      .on("finish", function () {
        console.log("File received and saved");
        socket.end(); // Close the connection after receiving the file
      })
      .on("error", function (err) {
        console.error("Error writing file:", err);
      });
    console.log("hello");
  });

  const listen = (port1, port2, cb) => {
    server.listen(port1, "0.0.0.0", cb);
    fileServer.listen(port2, "0.0.0.0");
    return (cb) => server.close(cb);
  };

  const send = (socketId, message) => {
    const socket = connections.get(socketId);

    if (!socket) {
      throw new Error(
        `Attempt to send data to connection that does not exist ${socketId}`
      );
    }
    console.log("in send");
    socket.write(JSON.stringify(message));

    //ở đây phải stringtify vì socket.write chỉ cho phép tuyền đi string hoặc là instance của Buffer
    //khi mà stringtify thì thằng  <Buffer 41 42 43> sẽ đưọc tự động structure thành object : { type: 'Buffer', data: [65,66,67] } (ma~ hex)
  };

  const connect = (ip, port, cb) => {
    const socket = new net.Socket();
    console.log(ip, "======================");
    socket.connect(port, ip, () => {
      handleNewSocket(socket);
      cb && cb();
    });
    // Return a disconnect function so you can
    // exclude the node from the list
    return (cb) => socket.destroy(cb); // cais nayf lam cc j v
  };

  const close = (cb) => {
    for (let [socketId, socket] of connections) {
      socket.destroy();
    }

    server.close(cb);
  };

  const findNodeId = (socketId) => {
    for (let [nodeId, $socketId] of neighbors) {
      if (socketId === $socketId) {
        return nodeId;
      }
    }
  };

  const findSocketIdFromNodeIdAndSendToAllConnect = (packet) => {
    console.log("sendFileToAllConnectedNode----");
    console.log(neighbors.keys());
    for (const nodeId of neighbors.keys()) {
      const socketId = neighbors.get(nodeId); // lấy connection id của mình dùng để kết nối với node của người ta
      // TODO handle no connection id error
      const data = packet;
      send(socketId, { type: "message", data });
    }
  };
  const findSocketIdFromNodeIdAndSendToOne = (packet) => {
    console.log("sendFileToOnly1ConnectedNode----");
    for (const nodeId of neighbors.keys()) {
      console.log("The neighbor NodeID is: "+nodeId);
      console.log("the packet.message.nodeId : " + packet.message?.nodeId);
      console.log("---- "+packet);
      if (packet?.message?.nodeId == nodeId) {
        const socketId = neighbors.get(nodeId); // lấy connection id của mình dùng để kết nối với node của người ta
        // TODO handle no connection id error
        const data = packet;
        send(socketId, { type: "message", data }); // chinh lai thanh nodeId cua Hung
      }
      console.log("fail to send ");
    }
  };
  const findSocketIdFromNodeIdAndSendToOne2 = (packet) => {
    console.log("sendFileToOnly1ConnectedNode----");
    for (const nodeId of neighbors.keys()) {
      console.log("The neighbor NodeID is: "+nodeId);
      if (packet?.message?.nodeId == nodeId) {
        const socketId = neighbors.get(nodeId); // lấy connection id của mình dùng để kết nối với node của người ta
        // TODO handle no connection id error
        packet.message.nodeId=NODE_ID
        const data = packet;
        send(socketId, { type: "message", data });
      }
    }
  };
  const sendFile = (
    message,
    id = randomuuid(),
    origin = NODE_ID,
    ttl = 255
  ) => {
    console.log("in sendFile" + NODE_ID);
    console.log(neighbors.keys());
    findSocketIdFromNodeIdAndSendToOne({
      id,
      ttl,
      type: "send",
      message,
      origin,
    });
  };
  const fetchFile = (
    message,            //trong nay cos nodeID Phuc
    id = randomuuid(),
    origin = NODE_ID,
    ttl = 255
  ) => {
    console.log("in fetchFile and my NODE_ID is: " + NODE_ID);    
    // findSocketIdFromNodeIdAndSendToAllConnect({ id, ttl, type: "fetch", message, origin });    thang này là send to all
    findSocketIdFromNodeIdAndSendToOne2({
      id,
      ttl,
      type: "fetch",
      message,
      origin,
    });
  };

  emitter.on("exchanged_nodeId", (socketId) => {
    //exchange Node_id ,
    send(socketId, { type: "handshake", data: { nodeId: NODE_ID } });
  });

  emitter.on("receive_handshake_nodeId", ({ socketId, message }) => {
    // set nodeID -> socketID ->socket
    const { type, data } = message;
    if (type === "handshake") {
      const { nodeId } = data;
      console.log("In the handshake ==============");
      console.log("The Neighbor nodeId is: " + nodeId);
      neighbors.set(nodeId, socketId);
    }
  });

  emitter.on("_disconnect", (socketId) => {
    const nodeId = findNodeId(socketId);

    // TODO handle no nodeId

    neighbors.delete(nodeId);
    emitter.emit("disconnect", { nodeId });
  });

  return {
    listen,
    connect,
    close,
    fetchFile,
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    id: NODE_ID,
    neighbors: () => neighbors.keys(),
    sendFile,
  };
};
