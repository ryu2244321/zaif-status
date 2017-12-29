const io = require("socket.io-client")
const socket = module.exports = io({
  serveClient:false
});
socket.on('zaif', function (data) {
  
});
