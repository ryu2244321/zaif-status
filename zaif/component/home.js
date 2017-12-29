const socket = require("../js/socket.js")
module.exports=require("./home.html")({
  data:()=>({
    balloons:[],
    clicks:0
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
        this.balloons.pop()
      }
    })
    socket.on("zaifReset",d=>{
      this.balloons=[]
      
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
    }
  }
})
