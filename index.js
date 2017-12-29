const http = require("http")
const express = require("express")
const axios = require("axios")
const app = express()

const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data


const server = http.createServer(app)

const io = require('socket.io')(server);

server.listen(process.env.PORT||4545, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
});

app.use(express.static('./'))
app.get("/proxy/:url",(req,res)=>{
  axios.get(req.params.url).then(r=>{
    //console.log(r)
    res.status(r.status).set(r.headers).send(r.data)
  }).catch(e=>{
    if (e.response) {
      res.status(e.response.status).set(e.response.headers).send(e.response.data)
    }else if(e.request){
      res.status(510).send({success:false,reason:"Destination Error"})
    }else{
      res.status(510).send({success:false,reason:"API Proxy Error"})
    }
  })
})

app.post("/proxy/:url",(req,res)=>{
  let payload="";
  for(let v in req.body){
    if(req.body[v]){
      payload+=encodeURIComponent(v)+"="+encodeURIComponent(req.body[v])+"&"
    }
  }
  axios.post(req.params.url,payload.slice(0,-1)).then(r=>{
    console.log(req.params,payload)
    res.status(r.status).set(r.headers).send(r.data)
  }).catch(e=>{
    if (e.response) {
      res.status(e.response.status).set(e.response.headers).send(e.response.data)
    }else if(e.request){
      res.status(510).send({success:false,reason:"Destination Error"})
    }else{
      res.status(510).send({success:false,reason:"API Proxy Error"})
    }
  })
})

let clicks=0
app.get("/zaif/status",(req,res)=>{
  res.send({
    clicks
  })
})

io.on('connection', function (socket) {
  socket.on('zaif', function (data) {
    io.emit('zaif',{id:data,clicks})
    clicks++
  });
});

setInterval(()=>{
  clicks=0
  io.emit("zaifReset")
},10000)
