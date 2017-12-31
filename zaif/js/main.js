const Vue = require("vue/dist/vue")
require("../scss/index.scss")
exports.vm= new Vue({
  el:"#app",
  
  data(){
    return {
      tab:"home"
    }
  },
  components:{
    home:require("../component/home.js"),
    tweet:require("../component/tweet.js"),
    board:require("../component/board.js")
  }
})
