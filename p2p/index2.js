const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors("*"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
const createNode = require("./src/index");
const node = createNode();
node.listen(4000, 4001, () => {
  console.log("node server is running on port 4000 and file server is 4001");
});

app.post("/fetch", (req, res) => {
  const clientIP = req.body.clientIp;
  console.log(clientIP);
  const clientPort = req.body.clientPort;
  const fileName = req.body.fileName;
  node.connect(clientIP, Number(clientPort), () => {
    console.log(`Connection to ${clientIP} established.`);
  });
  setTimeout(() => {                        // chưa giải quyết vấn đề async được nên ta dùng tạm thằng setTimeout
    node.fetchFile({ fileName });
  }, 1000);

});                                   // FE có 2 server, 1 cái là client , 1 cái server này để truyền file và FE k dùng đc thư viện fs
app.listen("8090", () => {
  console.log("im running on 8090");
});
