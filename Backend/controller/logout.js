const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const path = require("path");
const fs = require("fs");

// khi login vào thì cần phải vào db thay cái ip address nhé
async function logout(req, res) {
  const hostname = req.body.hostname;
  const data = await readFull();
  var checkHostname = false;
  for (var i = 0; i < data.client.length; i++) {
    if (data.client[i].hostname == hostname) {
      data.client[i].isActive = false;
      checkHostname = true;
      data.client[i].nodeId = "This host log out from p2p";
      const destination = path.join(__dirname, "../models/dataAdmin.json");
      fs.writeFileSync(destination, JSON.stringify(data));
      return res.status(200).send("Logout Success !");
    }
  }
  if (!checkHostname) {
    return res
      .status(404)
      .send({ msg: "The hostname doesn't existed in server" });
  }
}
module.exports = logout;
