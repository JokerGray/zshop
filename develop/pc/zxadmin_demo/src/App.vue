<template>
  <section class="app">
    <router-view></router-view>
    <router-view name="guide"></router-view>
    <transition :name="tName"><router-view name="entry"></router-view></transition>
  </section>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      tName: 'fold'
    }
  },
  watch: {
      $route (val, old) {
        if(val.name == 'home') {
          this.tName = 'fold';
          return
        }
      }
    }
}
</script>
<style>
*{
  box-sizing: border-box;
}
html, body{
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}
::-webkit-scrollbar{
  background-color: #f6f4f7;
  width: 10px;
}
::-webkit-scrollbar-button{
  display: none;
}
::-webkit-scrollbar-thumb{
  background-color: #ccc;
}

.fold-leave {
  transform: translate3d(0, 0, 0);
}
.fold-leave-active {
  transition: all 0.5s ease-out;
}
.fold-leave-to {
  transform: scale(0.1);
  transform-origin: 1350px -20px;
  opacity: 0;
}

.open-enter {
  transform: scale(0.1);
  transform-origin: 1350px -20px;
  opacity: 0;
}
.open-enter-active{
  transition: all 0.5s ease-out;
}
.open-enter-to {
  transform: translate3d(0, 0, 0);
}
</style>
