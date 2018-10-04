<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import './assets/styles/reset.css'
export default {
  name: 'app',
  mounted(){
    (function(win) {
      var doc = win.document;
      var docEl = doc.documentElement;
      var tid;

      function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
/*        if (width > 540) { // 最大宽度
          width = 540;
        }*/
        var rem = width / 15; // 将屏幕宽度分成10份， 1份为1rem
        docEl.style.fontSize = rem + 'px';
      }

      win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }, false);
      win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }
      }, false);

      refreshRem();

    })(window);
  }
}
</script>

<style>
#app {
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
