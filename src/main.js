// require("./main.scss");

// import "./index.html"

import "./assets/css/main.css"

import Vue from "vue"
import App from "./APP.vue"

import stylus from "./assets/css/main.styl"


new Vue({
  el: "#app",
  render: h => h(App)
});