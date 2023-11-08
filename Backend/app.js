const express = require("express");
const cors = require("cors");
const net = require("net");
const bodyParser = require("body-parser");
const {
  controllerCommand,
  controllerClient,
} = require("./controller/controllerAdmin.js");
const login = require("./controller/login");
const register = require("./controller/register");
const getAllCurrentFiles = require("./controller/getAllCurrentFiles");
const getCurrentFiles = require("./controller/getCurrentFiles");
const getHostName = require("./controller/getHostName");
const ping = require("./controller/ping");
const logout = require("./controller/logout");

const updateHostListFile = require("./controller/updateHostListFile");

const multer = require("multer");
require("dotenv").config();

const app = express();

// xác thực khi dùng APIs
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
var upload = multer();
app.use(upload.array());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

// frontend và backend của server
app.post("/api/admin", async (req, res) => {
  const receivedData = req.body; // Dữ liệu JSON được gửi từ phía Frontend
  // Xử lý dữ liệu ở đây
  console.log("Received data:", receivedData);
  await controllerCommand(req, res);
});

// server và client
app.post("/api/server", async (req, res) => {
  const receivedData = req.body; // Dữ liệu JSON được gửi từ phía Frontend
  // Xử lý dữ liệu ở đây
  console.log("Received data:", receivedData);
  await controllerCommand(req, res);
});

// frontend và backend của Client
app.post("/api/user", async (req, res) => {
  const receivedData = req.body; // Dữ liệu JSON được gửi từ phía Frontend
  // Xử lý dữ liệu ở đây
  console.log("Received data:", receivedData);
  await controllerCommand(req, res);
});

// Đăng nhập , Đăng kí, Đăng xuất
app.post("/api/login", login);
app.post("/api/register", register);
app.post("/api/logout", logout);
// Tìm kiếm file trong Backend
app.get("/api/all-current-files", getAllCurrentFiles);
//Tìm kiếm file của 1 host cụ thể trong Backend
app.post("/api/current-files", getCurrentFiles);
// update list file for hostname
app.put("/api/list-file-of-a-host", updateHostListFile);
// get hostname
app.get("/api/hostname", getHostName);
app.post("/api/ping", ping);

const PORT = 5000;

const listener = app.listen(PORT, () => {
  console.log(
    "Server listening for connection requests on port " +
      listener.address().port
  );
});

// const server = new net.Server();
// exports.server = server;
// server.listen({port: 4002, host: 'localhost' }, function() {
//     console.log("Server listening for connection requests on socket");
// });

// // nhận kết nối tcp
// server.on('connection', function(socket) {
//   console.log('A new connection has been established.');
//   // Now that a TCP connection has been established, the server can send data to
//   // the client by writing to its socket.
//   socket.write('Hello, client.');

//   // The server can also receive data from the client by reading from its socket.
//   socket.on('data', function(chunk) {
//       console.log(`Data received from the client: ${chunk.toString()}.`);
//   });

//   // end kết nối
//   socket.on('end', function() {
//       console.log('Closing connection with the client');
//   });

//   // lỗi
//   socket.on('error', function(err) {
//       console.log(`Error: ${err}`);
//   });
// });
