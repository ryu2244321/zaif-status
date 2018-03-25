const http = require("http")
const express = require("express")
const axios = require("axios")
const {URL} = require("url")
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

const allowedDomains = ["explorer.fujicoin.org","www.coingecko.com","api.zaif.jp"]
function isValidDomain(addr){
  const url = new URL(addr)
  if(~allowedDomains.indexOf(url.hostname)){
    return true
  }
  return false
}

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
  const url = req.query.u||req.params.url
  if(!isValidDomain(url)){
    return res.status(510).send({success:false,reason:"not allowed"})
  }
  axios.post(url,payload.slice(0,-1)).then(r=>{
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
    imageUrl:"https://zaif-status.herokuapp.com/scamgirls/images/scamgirls.png",
    ownerName:"ゆき@エコビー",
    twitterId:"",
    twitterScreenName:"MissMonacoin",
    timestamp:1
  },{
    description:"票",
    asset:"A2233845812365203064",
    assetCommonName:"SCAMGIRLS.HYOU",
    assetLongName:"SCAMGIRLS.HYOU",
    cardName:"票",
    imageUrl:"https://zaif-status.herokuapp.com/scamgirls/images/hyou.png",
    ownerName:"ゆき@エコビー",
    twitterId:"",
    twitterScreenName:"MissMonacoin",
    timestamp:1
  }
]
app.get("/scamgirls/api/detail",(req,res)=>{
  const assets=req.query.assets.split(",")
  const result=[];
  assets.forEach(v=>{
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].assetCommonName===v) {
        result.push( tokens[i])
      }
    }
  })
  return res.send({success:true,result})
})
