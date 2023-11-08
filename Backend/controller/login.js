const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const path = require("path");
const fs = require("fs");

// khi login vào thì cần phải vào db thay cái ip address nhé
async function login(req, res) {
  console.log(req.body);
  const hostname = req.body.hostname;
  const password = req.body.password;
  const nodeId = req.body.nodeId;
  const ipv6Address = req.socket.remoteAddress; //thằng này chỉ khi mà có client ngoài request
  const ipv4Address = ipv6Address.split(":").pop();
  const data = await readFull();
  for (var i = 0; i < data.client.length; i++) {
    if (data.client[i].hostname == hostname) {
      if (data.client[i].password == password) {
        const destination = path.join(__dirname, "../models/dataAdmin.json");
        data.client[i].localIp = ipv4Address;
        data.client[i].isActive = true;
        data.client[i].nodeId = nodeId;
        fs.writeFileSync(destination, JSON.stringify(data));
        return res.status(200).send("Login Success !");
      }
    }
  }
  return res.status(401).send("Login Failed, Unauthorized !");
}
module.exports = login;
