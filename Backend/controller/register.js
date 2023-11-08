const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const fs=require("fs")
const path=require("path")

async function register(req, res) {
    //hostname not hostName
  const hostname = req.body.hostname;
  const password = req.body.password;
  const ipv6Address = req.socket.remoteAddress;          //thằng này chỉ khi mà có client ngoài request 
  const ipv4Address = ipv6Address.split(":").pop();      //thì ip mới khác 1 còn nếu mà
                                                        //máy mình tự request localhost thì auto là 1
//   console.log(`Client IP Address: ${ipv4Address}`);

  const data = await readFile();    //not include client
  for (var i = 0; i < data.length; i++) {
    if (data[i].hostname == hostname) {
      return res.status(409).send("Hostname already existed");
    }
  }
  const clientData = await readFull();
  const newClient = {
    hostname,
    password,
    localIp: ipv4Address,
  };
  clientData.client.push(newClient);
  const updatedJsonData = JSON.stringify(clientData)

  // Write the updated JSON data back to the file
  const destination = path.join(__dirname,"../models/dataAdmin.json")
  fs.writeFileSync(destination, updatedJsonData);
  return res.status(200).send("Register Success !");
}
module.exports = register;
