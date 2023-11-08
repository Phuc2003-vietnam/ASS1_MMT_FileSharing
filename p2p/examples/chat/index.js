const createNode = require("../../src");
const EventEmitter = require("events");

const randomItem = (c) => c[Math.floor(Math.random() * c.length)];

// First, we see what port we should run the node at
const port1 = Number(process.argv[2]);
const port2 = Number(process.argv[3]);

if (isNaN(port1) || isNaN(port2)) {
  console.log('Port not defined. Call like "node examples/chat.js PORT"');
  return;
}

// After that we create the node, run it and let user
// know how to connect to other nodes and send messages
const node = createNode();
let name =
  randomItem(["Gorgeous", "Elegant", "Phantastic", "Smart"]) +
  " " +
  randomItem(["pine", "oak", "spruce"]) +
  " from " +
  randomItem(["Paris", "Berlin", "Belgrade", "Ljubljana"]);

// Start local node and print help
node.listen(port1, port2, () => {
  console.log(`Chat node is up at port ${port1}.`);
  console.log(``);
  console.log(`Write "connect IP:PORT" to connect to other nodes.`);
  console.log(`Write "name NAME" to change your name.`);
  console.log(`Type anything else to send it to everyone on the network`);
  console.log(``);
  console.log(`Your name is "${name}"`);

  // node.on('connect', ({ nodeId }) => {
  //   console.log(`New node connected: ${nodeId}`);
  // });
  //
  // node.on('disconnect', ({nodeId}) => {
  //   console.log(`Node disconnected: ${nodeId}`);
  // });

  // node.on('broadcast', ({ message: { name, text } }) => {
  //   console.log(`${name}: ${text}`);
  // });

  process.stdin.on("data", (data) => {
    const text = data.toString().trim();
    if (text.startsWith("connect")) {
      const [, ipport] = text.split(" ");
      const [ip, port] = ipport.split(":");

      console.log(`Connecting to ${ip} at ${Number(port)}...`);
      node.connect(ip, Number(port), () => {
        console.log(`Connection to ${ip} established.`);
      });
    } else if (text.startsWith("name")) {
      [, name] = text.split(" ");
      console.log(`Name changed to "${name}"`);
    } else if (text.startsWith("send")) {
      var fileName;
      [, fileName] = text.split(" ");
      node.sendFile({ fileName });
    } else if (text.startsWith("fetch")) {
      var fileName;
      [, fileName] = text.split(" ");
      node.fetchFile({ fileName });
    } else {
      node.chat({ name, text });
      console.log(`You: ${text}`);
    }
  });
});

// Handle CTRL C to gracefully shut everything down
process.on("SIGINT", async () => {
  console.log("\nGracefully shutting chat node down...");

  node.close(() => {
    process.exit();
  });
});
