const Vue = require("vue/dist/vue")
require("../scss/index.scss")
exports.vm= new Vue({
  el:"#app",
  render(h){
    return h("home")
  },
  data(){
    return {}
  },
  components:{
    home:require("../component/home.js")
  }
})
