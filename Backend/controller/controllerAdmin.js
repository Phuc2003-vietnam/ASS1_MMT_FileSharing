const net = require('net');
const {readFile, writeFile} = require('../models/dataAdmin.js');
// const { server } = require('../index.js');
// const { writeFile} = require('../models/write.js');


const tcpp = require('tcp-ping');
const { hostname } = require('os');

const controllerCommand = async (req, res) => {
    // tách comand thành array
    command = req.body["terminalInput"];
    array = command.split(' ');

    // check command

    if(array.length > 2 || array[0] !== "ping" && array[0] !== "discover" && array[0] !== "hostname"  
                        || array.length === 1 && array[0] !== "hostname")
        return res.send({"ERROR" : "Unknown command"});

    data = await readFile();        // lấy data client
    
    if(array[0] === "hostname")
    {
        return res.send({"hostname"  : data.map((item) => item.hostName)});
    }        

    // check hostname
    
    let listHostname = data.filter((item) => item.hostName == array[1]);
    if(listHostname.length == 0) 
        return res.send({"ERROR" : "Unknown Hostname"});

    let hostname = listHostname[0]; // hostname
    // discover hostname
    if(array[0] === "discover")
    {
        return res.send({"discover"  : hostname.file});
    }
    else if(array[0] === "ping")
    {
        tcpp.probe( hostname.hostName, async (err, available) => {
            return res.send({"ping" : available})
        });  
    }
}

const controllerToClient = async (req, res) => {
}

exports.controllerToClient = controllerToClient;
exports.controllerCommand = controllerCommand;

// const controllerToClinet = async (Csprotocal) => {
//     // giải mã
//     Csprotocal = await decryption(Csprotocal)

//     type = data["type"];
//     hostname = data["host"];
//     // xử lí mật khẩu
//     if (type == 101)
//     {
//         // check tài khoảng
//         data = await readFile();
//         listHostname = data.filter((item) => item.hostName == hostname);
//         // đúng
//         if(listHostname.length == 0 && listHostname[0]["password"] == Csprotocal["data"]) 
//             return createDataPacket(102, hostname);
//         // fail
//         return createDataPacket(103, hostname);
//     }
//     else if (type == 302)
//     {
//         Csprotocal = await readFile();
//         Csprotocal.forEach((client) => {
//             if (client.file.includes(fileName)) {
//                 return createDataPacket(202, hostname);
//             }
//         });   
        
//         Csprotocal.client.forEach((client) => {
//             if (client.hostName == hostname) {
//                 client.file += [data["data"]];
//             }
//         });     
//         return createDataPacket(203, hostname);      
//     }
//     else if(type == 204)
//     {
//         Csprotocal.client.forEach((client) => {
//             if (client.hostName == hostname) {
//                 client.file += [data["data"]];
//             }
//         });    

//         return createDataPacket(203, hostname);  
//     }
//     else if (type == 301)
//     {
//         // check tài khoảng
//         Csprotocal = await readFile();
//         filename = await getHostsForFile(Csprotocal, data["data"]);
//         filename.forEach((client) =>
//         {
//             tcpp.probe( client.hostName, client.port, async (err, available) => {
//                 if (available) return createDataPacket(302, hostname, client.hostName);
//             }); 
//         });
//         return createDataPacket(303, hostname);
//     }
// }


// const getHostsForFile = async (Csprotocal, fileName) => {
//     const hostNames = [];
//     Csprotocal.forEach((client) => {
//         if (client.file.includes(fileName)) {
//             hostNames.push(client);
//         }
//     });
//     return hostNames;
// }





