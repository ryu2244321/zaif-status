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
app.get("/proxy/:url?",(req,res)=>{
  axios.get(req.query.u||req.params.url).then(r=>{
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

app.post("/proxy/:url?",(req,res)=>{
  let payload="";
  for(let v in req.body){
    if(req.body[v]){
      payload+=encodeURIComponent(v)+"="+encodeURIComponent(req.body[v])+"&"
    }
  }
  axios.post(req.query.u||req.params.url,payload.slice(0,-1)).then(r=>{
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
const tokens=[
  {
    description:"スキャムガールズ",
    asset:"SCAMGIRLS",
    assetCommonName:"SCAMGIRLS",
    assetLongName:null,
    cardName:"Scam Girls",
    imageUrl:"",
    ownerName:"ゆき@エコビー",
    twitterId:"",
    twitterScreenName:"MissMonacoin",
    timestamp:1
  }
]
app.get("/scamgirls/api/detail",(req,res)=>{
  const assets=req.query.assets.split(",")
  const result=assets.map(v=>{
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].assetCommonName===v) {
        return tokens[i]
      }
    }
  })
  return res.send({success:true,result})
})

let clicks=0
let chat=0
let connectCount=0
app.get("/zaif/status",(req,res)=>{
  res.send({
    clicks,chat,connectivity:1,connectCount
  })
})

io.on('connection', function (socket) {
  socket.on('zaif', function (data) {
    io.emit('zaif',{id:data,clicks,chat,connectCount})
    clicks++
  });
  socket.on('chat', function (data) {
    io.emit('chat',data)
    chat++
  });
});

setInterval(()=>{
  clicks=0
  chat=0
  io.emit("zaifReset")
},1000*60)
setInterval(()=>{
  connectCount=0
},1000*60*60)

function connect(pair){
  connectCount++
  const WebSocket = require('uws');

  const ws = new WebSocket('ws://ws.zaif.jp/stream?currency_pair='+pair);
  io.emit("reconnection",pair)
  ws.on('open', function open() {
    console.log("Connection established");
  });
  ws.on('error', function open() {
    console.log("Connection error");
    connect(pair)
  });


  ws.on('message', function incoming(data) {
    io.emit("zaifBoard",data)
  });

  ws.on('close', function close() {
    console.log('disconnected');
    connect(pair)
  });
}
connect("mona_jpy")
connect("btc_jpy")
connect("bch_jpy")
connect("xem_jpy")
