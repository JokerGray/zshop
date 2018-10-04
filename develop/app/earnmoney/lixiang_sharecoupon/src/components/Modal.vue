<!--弹出层-->
<template>
    <transition name="modal">
        <div class="modal-mask" @click.self="close">
          <div class="modal-wrapper"  @click.self="close">
            <div class="modal-container"  @click.self="close">
              <slot name="content">用来显示某些玩意</slot>
            </div>
          </div>
        </div>
    </transition>
</template>
<script>
export default{
  methods: {
    close (e) {
      this.$parent.showLayer = false
    }
  }
}
</script>
<style scoped>
.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
  z-index: 999;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container{
  transition: all .3s ease;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
