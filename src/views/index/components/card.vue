<template>
  <div class="card-container">
    <!-- <img :src="name" alt="" /> -->
    <!-- 动物图 不咋地好看 👆 -->
    <!-- <img src="../../../assets/images_50/Artboard1.png" alt="" /> -->
    <!-- <div></div> -->
    <!-- <span>{{ animalName }}</span> -->
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="`#icon-${animalName}`"></use>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  styles: {
    type: Object,
    defalut: {},
  },
  animalName: {
    type: String,
    defalut: 'Artboard38',
  },
});
const name = computed(() => {
  return require(`../../../assets/images_50/${props.animalName}.png`);
});
const svgName = computed(() => {
  return `#icon-${animalName}`;
});
// 需要减去border
const sheepPieceLen = '98px';
const iLen = '50px';
</script>

<style lang="scss" scoped>
.card-container {
  position: absolute;
  left: v-bind('styles.left');
  top: v-bind('styles.top');
  z-index: v-bind('styles.zIndex');
  background: v-bind('styles.back');
  cursor: v-bind('styles.cursor');
  width: v-bind('sheepPieceLen');
  height: v-bind('sheepPieceLen');
  border: 1px solid #9f9f9f;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  /* & > div {
    width: v-bind('sheepPieceLen');
    height: v-bind('sheepPieceLen');
    background: url('~@/assets/images/sheep.png') no-repeat;
    background-size: contain;
    background-position: center center;
  } */
  & > img {
    width: v-bind('sheepPieceLen');
    height: v-bind('sheepPieceLen');
  }
  & > i {
    font-size: v-bind('iLen');
  }
}
</style>
<style type="text/css">
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
