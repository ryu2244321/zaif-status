const socket = require("../js/socket.js")
module.exports=require("./board.html")({
  data:()=>({
    b:{},
    sound:{},
    ignore:{},
    lastAmt:{}
  }),
  mounted(){
    socket.on("zaifBoard",d=>{
      const c=JSON.parse(d)
      this.$set(this.b,c.currency_pair,c)
      
      if(this.sound[c.currency_pair]){
        if(this.lastAmt[c.currency_pair]===c.trades[0].amount){
          (new Audio(require("../res/board.mp3"))).play()
        } else if(this.ignore[c.currency_pair]>c.trades[0].amount){
          console.log("ignore");
          (new Audio(require("../res/ignore.mp3"))).play()
        }else{
          console.log("yabami");
          (new Audio(require("../res/yabami.mp3"))).play()
        }
      }
      this.lastAmt[c.currency_pair]=c.trades[0].amount
    })
    socket.on("reconnection",d=>{
      console.log("Reconnected")
    })
  }
})









