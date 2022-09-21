<template>
  <div class="card-container">
    <img src="../../../assets/images/sheep.png" alt="" />
  </div>
</template>

<script setup>
const props = defineProps({
  styles: {
    type: Object,
    defalut: {},
  },
});
</script>

<style lang="scss" scoped>
.card-container {
  position: absolute;
  left: v-bind('styles.left');
  top: v-bind('styles.top');
  z-index: v-bind('styles.zIndex');
  background: v-bind('styles.back');
  cursor: v-bind('styles.cursor');
  width: 50px;
  height: 50px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 6px;
  /* background: url('~@/assets/images/sheep.png') no-repeat;
  background-size: contain;
  background-position: center center; */
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    width: 100px;
    height: 100px;
  }
}
</style>
