const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const fs = require("fs");
const path = require("path");

async function getCurrentFiles(req, res) {
  var currentFiles = [];
  var hostname=req.body.hostname
  var checkHostname=false
  const data = await readFile(); //not include client
  for (var i = 0; i < data.length; i++) {
    if (data[i]?.hostname==hostname) {
      checkHostname=true
      if (data[i]?.file?.length > 0) {
        for (var j = 0; j < data[i].file.length; j++) {
          currentFiles = currentFiles.concat(data[i].file[j]);
        }
      }
    }
  }
  if (!checkHostname)
  {
    return res.status(404).send({msg: "Hostname not found"})
  }
  return res.status(200).send({ currentFiles });
}
module.exports = getCurrentFiles;
