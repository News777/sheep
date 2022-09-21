/** 初次想法 - 不行 - 采用层次遮罩的形式 */ /** 第二次想法 - 先实践一下 */
<template>
  <div class="main-container">
    <card
      v-for="item in sheepFlock"
      :styles="item.style"
      @click="killSheep(item)"
    />
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
import { generateSheep, colourSheep, getRandomNum } from '@/utils/randGenerate';
const state = reactive({
  sheepFlock: [
    /*   {
      id: nanoid(),
      style: {
        zIndex: 1,
        left: '450px',
        top: '500px',
        back: 'rgba(223, 219, 219, 0.6)',
        cursor: 'auto',
      },
    },
    {
      id: nanoid(),
      style: {
        zIndex: 10,
        left: '500px',
        top: '500px',
        back: 'rgba(255,255,255,1)',
        cursor: 'pointer',
      },
    },
    {
      id: nanoid(),
      style: {
        zIndex: 9,
        left: '460px',
        top: '500px',
        back: 'rgba(255,255,255,1)',
        cursor: 'pointer',
      },
    },
    {
      id: nanoid(),
      style: {
        zIndex: 8,
        left: '460px',
        top: '590px',
        back: 'rgba(255,255,255,1)',
        cursor: 'pointer',
      },
    },
    {
      id: nanoid(),
      style: {
        zIndex: 7,
        left: '470px',
        top: '580px',
        back: 'rgba(255,255,255,1)',
        cursor: 'pointer',
      },
    }, */
  ],
});

const killSheep = (row) => {
  if (checkIsKill(row, state.sheepFlock)) {
    state.sheepFlock = state.sheepFlock.filter((o) => o.id != row.id);
    // state.sheepFlock = colourSheep(state.sheepFlock);
  } else alert('非首层');
};
onMounted(() => {
  state.sheepFlock = generateSheep();
  console.log(
    getRandomNum({ min: 200, max: 1600 }, { min: 100, max: 800 }, 25)
  );
});
const { sheepFlock } = toRefs(state);
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  position: relative;
  .card-sheep {
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
  }
}
</style>
