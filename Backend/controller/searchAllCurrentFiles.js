const { readFile, writeFile, readFull } = require("../models/dataAdmin.js");
const fs = require("fs");
const path = require("path");

async function searchAllCurrentFiles(req, res) {
    var currentFiles = [];
    // Không xét trường hợp cùng tên, mặc định là các client không có file cùng tên cho đơn giản
    const data = await readFile(); // Not include client
    const searchString = req.body.searchString; // Replace 'specific string' with the string you want to search for
    
    for (var i = 0; i < data.length; i++) {
      const ipv6Address = req.socket.remoteAddress; // Thằng này chỉ khi có client ngoài request
      const ipv4Address = ipv6Address.split(':').pop();
      if (data[i]?.isActive && data[i]?.localIp != ipv4Address) {
        if (data[i]?.file?.length > 0) {
          for (var j = 0; j < data[i].file.length; j++) {
            const fileName = data[i].file[j].name.toLowerCase(); // Convert filename to lowercase for case-insensitive search
            if (fileName.includes(searchString.toLowerCase())) {
              const item = {
                file: data[i].file[j],
                localIp: data[i].localIp,
                nodeId: data[i].nodeId,
              };
              currentFiles.push(item); // Add the item to the filtered list
            }
          }
        }
      }
    }
  
    res.status(200).send({ currentFiles });
  }
  
  module.exports = searchAllCurrentFiles;
  