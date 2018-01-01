const socket = require("../js/socket.js")
module.exports=require("./home.html")({
  data:()=>({
    balloons:[],
    clicks:0,
    chats:[],
    chatInput:"",
    monaJpy:{
      last_price:{}
    }
  }),
  mounted(){
    socket.on("zaif",id=>{
      this.balloons.push({
        id:id.id,
        left:this.setLeft(),
        top:this.setTop()
      })
      this.clicks=id.clicks
      if(this.balloons.length>100){
        this.balloons.shift()
      }
    })
    socket.on("zaifReset",d=>{
      this.balloons=[]
      
    })
    socket.on("chat",d=>{
      this.chats.push(d)
      if(this.chats.length>20){
        this.chats.shift()
      }
    })
    socket.on("zaifBoard",d=>{
      
      this.monaJpy=JSON.parse(d)
      
    })
  },
  methods:{
    send(id){
      socket.emit("zaif",id)
    }
    ,setTop(){
      return Math.random()*window.innerHeight
    }
    ,setLeft(){
      return Math.random()*window.innerWidth
    },
    sendChat(){
      if(!this.chatInput){
        return;
      }
      socket.emit("chat",{
        text:this.chatInput,
        name:this.nameInput
      })
      this.chatInput=""
    }
  }
})
