const socket = require("../js/socket.js")
module.exports=require("./board.html")({
  data:()=>({
    b:{}
  }),
  mounted(){
    socket.on("zaifBoard",d=>{
      const c=JSON.parse(d)
      this.$set(this.b,c.currency_pair,c)
    })
  }
})
