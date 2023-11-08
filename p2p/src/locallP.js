const os = require('os');

function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  let localIP;

  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key].forEach((networkInterface) => {
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        localIP = networkInterface.address;
      }
    });
  });

  return localIP;
}

module.exports=getLocalIP
