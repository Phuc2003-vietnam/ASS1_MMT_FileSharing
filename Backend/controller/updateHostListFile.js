const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const path = require("path");
const fs = require("fs");

async function updateHostListFile(req, res) {
  const hostname = req.body.hostname;
  console.log(hostname);
  var check = 0;
  const file = req.body.file;
  const data = await readFull();
  console.log(data);
  for (var i = 0; i < data.client.length; i++) {
    console.log(data.client[i].hostname);
    if (data.client[i].hostname == hostname) {
      data.client[i].file = file;
      check = 1;
    }
  }
  if (!check) {
    return res.status(400).send("Fail update list file of a hostname!");
  }
  const destination = path.join(__dirname, "../models/dataAdmin.json");
  fs.writeFileSync(destination, JSON.stringify(data));
  return res.status(200).send("Update list file of a hostname Success !");
}
module.exports = updateHostListFile;
