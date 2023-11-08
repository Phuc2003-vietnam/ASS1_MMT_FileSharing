const icmp = require("icmp");
const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");

async function ping(req, res) {
  const hostname = req.body.hostname;
  var checkHostname = false;
  var localIp = 0;
  const data = await readFull();
  for (var i = 0; i < data.client.length; i++) {
    if (
      data.client[i].hostname == hostname &&
      data.client[i].isActive == true
    ) {
      localIp = data.client[i].localIp;
      checkHostname = true;
      var obj = await icmp.send(localIp, "Hey, I'm sending a message!");
      if (obj.open) {
        return res.status(200).send({ isActive: true });
      } else {
        return res.status(503).send({ isActive: false });
      }
    }
  }
  if (!checkHostname) {
    return res
      .status(404)
      .send({ msg: "The hostname doesn't existed in server" });
  }
}
module.exports = ping;
