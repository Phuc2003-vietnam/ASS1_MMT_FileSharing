const exec = require("child_process").exec;
const fs = require("fs");

const hosts = ["10.230.7.183", "www.google.de", "127.0.0.1", "172.16.1.154"];
const replyFromLocale = "Reply from";

const promises = [];

// hosts.forEach((host) => {
//   promises.push(
//     new Promise((resolve, reject) => {
//       exec(`ping -n 1 -w 1000 ${host}`, (err, stdout, stderr) => {
//         // successfull response: Reply from 142.250.186.78: bytes=32 time=10ms TTL=128
//         // unsuccessfull:        Reply from 192.168.1.3: Destination host unreachable
//         // host unreachable:     Ping request could not find host
//         let status = "offline";
//         console.log(stdout);
//         let output = stdout.toString();
//         let replyFromIndex = output.indexOf(replyFromLocale);
//         if (
//           replyFromIndex > 0 &&
//           output.substring(replyFromIndex).toUpperCase().indexOf("BYTES") > 0
//         ) {
//           status = "online";
//         }
//         resolve(new Date().toISOString() + " " + host + " " + status);
//       });
//     })
//   );
// });

// Promise.all(promises).then((results) => {
//   fs.writeFile("ping-results.txt", results.join("\n"), (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });
// });
// const host1 = "10.230.7.183";

// async function foo() {
//   var a = await exec(`ping -n 1 -w 1000 ${host1}`);
//   console.log(a.toString());
// }
// foo();

