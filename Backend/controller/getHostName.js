const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const fs = require("fs");
const path = require("path");

async function getHostName(req, res) {
  var hostname = [];
  const data = await readFile(); //not include client
  for (var i = 0; i < data.length; i++) {
    if(data[i].hostname!="admin123")
    hostname = hostname.concat(data[i].hostname);
  }
  res.status(200).send({ hostname });
}
module.exports = getHostName;
