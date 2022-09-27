/** 初次想法 - 不行 - 采用层次遮罩的形式 */ /** 第二次想法 - 先实践一下 */
<template>
  <div class="main-container">
    <el-card>
      <span>{{ `${time.minute}:${time.second}` }}</span>
    </el-card>
    <el-button
      circle
      class="backBtn"
      type="warning"
      @click="emits('backToHome')"
      >返回</el-button
    >
    <div>
      <span class="card-num"
        >当前卡片数量：{{ sheepFlock.length }}（不含消除框）</span
      >
      <card
        v-for="item in sheepFlock"
        :styles="item.style"
        :animalName="item.animalName"
        @click="killSheep(item)"
      />
      <div class="killCol">
        <div class="killCard" v-for="item in killList">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`#icon-${item.animalName}`"></use>
          </svg>
        </div>
      </div>
    </div>
    <el-card class="card card-rank">
      <template #header> <span>排行版</span> </template>
      <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane label="简单">待开发</el-tab-pane>
        <el-tab-pane label="一般"></el-tab-pane>
        <el-tab-pane label="困难"></el-tab-pane>
        <el-tab-pane label="极难"></el-tab-pane>
        <el-tab-pane label="非常难"></el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="card card-skill">
      <template #header> <span>技能区</span> </template>
      <el-button
        type="primary"
        @click="interruptSort"
        :disabled="!Boolean(interruptTime)"
        >重新打乱全部卡片顺序，不包括消除框(当局仅一次)</el-button
      >
      <span>其他技能待开发</span>
    </el-card>
  </div>
</template>

<script setup>
import { nanoid } from 'nanoid';
import {
  reactive,
  toRefs,
  onMounted,
  watch,
  ref,
  computed,
  onUnmounted,
} from 'vue';
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
  randomRange,
} from '@/utils/gridGenerate';
import { ElMessage, ElMessageBox } from 'element-plus';
const state = reactive({
  sheepFlock: [],
  killList: [],
  curChoiceSheep: {},
  gameOverStatus: false,
  timer: null,
  second: 0,
  interruptTime: 1,
});
const props = defineProps({
  level: {
    type: Number,
    default: 10,
  },
});
const killSheep = (row) => {
  if (checkIsKill(row, state.sheepFlock)) {
    state.sheepFlock = state.sheepFlock.filter((o) => o.id != row.id);
    state.curChoiceSheep = row;
    state.killList.push(row);
    state.sheepFlock = colourSheep(state.sheepFlock);
  }
};
const time = computed(() => {
  let minute = Math.floor(state.second / 60);
  let second = state.second % 60;
  if (minute < 10) minute = '0' + minute;
  if (second < 10) second = '0' + second;
  return {
    minute,
    second,
  };
});
// 打乱排序
const interruptSort = () => {
  if (state.interruptTime > 0) {
    for (let index = 0; index < state.sheepFlock.length; index++) {
      const willReplaceIndex = randomRange(0, state.sheepFlock.length - 1);
      const temp = state.sheepFlock[index].animalName;
      state.sheepFlock[index].animalName =
        state.sheepFlock[willReplaceIndex].animalName;
      state.sheepFlock[willReplaceIndex].animalName = temp;
    }
    state.interruptTime -= 1;
  }
};
const emits = defineEmits(['backToHome']);
watch(
  () => [...state.killList],
  (newVal) => {
    const sameSheep = newVal.filter(
      (o) => o.animalName === state.curChoiceSheep.animalName
    );
    sameSheep.length === 3
      ? (state.killList = state.killList.filter(
          (o) => o.animalName != state.curChoiceSheep.animalName
        ))
      : '';
    if (state.killList.length === 7) {
      ElMessageBox.alert('游戏结束，未通关，是否重新开始？', '提醒', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        callback: (action) => {
          emits('backToHome');
        },
      });
    }
  }
);
watch(
  () => [...state.sheepFlock],
  (newVal) => {
    newVal.length === 0
      ? ElMessageBox.alert('游戏结束，已通关，是否跳转回主页', '提醒', {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: 'OK',
          callback: (action) => {
            emits('backToHome');
          },
        })
      : '';
  }
);
onMounted(() => {
  state.sheepFlock = generateSheep(props.level);
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  } else {
    setInterval(() => {
      state.second++;
    }, 1000);
  }
});
onUnmounted(() => {
  state.timer = null;
  clearInterval(state.timer);
});
const { sheepFlock, killList, gameOverStatus, second, interruptTime } =
  toRefs(state);
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(rgba(128, 237, 252, 0.856), rgb(248, 159, 233));
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
  .el-card {
    position: absolute;
    left: 20px;
    top: 20px;
    font-size: 20px;
    color: rgb(0, 114, 190);
  }
  .card {
    position: absolute;
    width: 400px;
    left: 1500px;
    &-rank {
      top: 100px;
      width: fit-content;
    }
    &-skill {
      top: calc(50% + 20px);
    }
  }
  .backBtn {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 20px;
    top: 100px;
  }
  .card-num {
    position: absolute;
    top: 50px;
    left: 480px;
  }
  .killCol {
    position: absolute;
    bottom: 50px;
    left: 235px;
    // transform: translateX(-50%);
    width: 730px;
    height: 120px;
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
    border-radius: 8px;
    padding: 10px 15px;
    display: flex;
    &::after {
      content: '消除框';
      position: absolute;
      top: -20px;
      right: 10px;
      text-align: center;
      width: fit-content;
      padding: 0 10px;
      height: fit-content;
      font-size: 24px;
      font-weight: 700;
      color: rgb(182, 105, 245);
      background: #e6adec;
    }
    .killCard {
      width: 98px;
      height: 98px;
      border: 1px solid #9f9f9f;
      box-sizing: content-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
