/** 初次想法 - 不行 - 采用层次遮罩的形式 */ /** 第二次想法 - 先实践一下 */
<template>
  <div class="main-container">
    <card
      v-for="item in sheepFlock"
      :styles="item.style"
      :animalName="item.animalName"
      @click="killSheep(item)"
    />
    <div class="killCol">
      <div class="killCard" v-for="item in killList">
        <i class="iconfont" :class="`icon-${item.animalName}`"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nanoid } from 'nanoid';
import { reactive, toRefs, onMounted } from 'vue';
import {
  separatePx,
  separatePxToFloat,
  checkIsKill,
} from '@/utils/filterSheep';
import card from './components/card.vue';
// import {colourSheep, getRandomNum } from '@/utils/randGenerate';
import {
  generateGamePiece,
  generateSheep,
  colourSheep,
} from '@/utils/gridGenerate';
const state = reactive({
  sheepFlock: [],
  killList: [],
});

const killSheep = (row) => {
  if (checkIsKill(row, state.sheepFlock)) {
    state.sheepFlock = state.sheepFlock.filter((o) => o.id != row.id);
    state.killList.push(row);
    state.sheepFlock = colourSheep(state.sheepFlock);
  } else alert('非首层');
};
onMounted(() => {
  state.sheepFlock = generateSheep();
  console.log(state.sheepFlock);
});
const { sheepFlock, killList } = toRefs(state);
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  position: relative;
  /* .card-sheep {
    position: absolute;
    top: 500px;
    left: 500px;
    z-index: 1;
    background: rgba(223, 219, 219, 0.6);
  }
  .card-sheep1 {
    position: absolute;
    top: 450px;
    left: 500px;
    z-index: 10;
    background: #fff;
  } */
  .killCol {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 380px;
    height: 70px;
    border: 1px solid forestgreen;
    padding: 10px 15px;
    display: flex;
    .killCard {
      width: 48px;
      height: 48px;
      border: 1px solid #9f9f9f;
      box-sizing: content-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
