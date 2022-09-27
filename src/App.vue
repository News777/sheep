<template>
  <div
    class="container"
    v-if="hasShow"
    v-loading="loading"
    element-loading-text="游戏载入中..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-row :gutter="50">
      <el-col :span="12" :pull="1"
        ><div class="slider-demo-block">
          <span class="demonstration"
            >难度选择：<span style="color: #409eff">{{
              filterDifficulty(difficulty)
            }}</span></span
          >
          <el-slider
            v-model="difficulty"
            :step="25"
            :show-tooltip="false"
            show-stops
          />
        </div>
      </el-col>
      <el-col
        :span="12"
        :push="1"
        style="
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-evenly;
        "
      >
        <span class="difficult-title">难度介绍</span>
        <div class="difficult-rules">
          <span
            >卡片层次：<span style="color: #409eff">{{
              difficultyName.get(difficulty).level + '层'
            }}</span></span
          >
          <span
            >卡片数量：<span style="color: #409eff">{{
              difficultyName.get(difficulty).sheepNum + '个'
            }}</span></span
          >
          <span>{{
            difficultyName.get(difficulty).level > 6
              ? '开启侧边块'
              : '不开启侧边块'
          }}</span>
          <span>具体数量以游戏内为准</span>
        </div>
      </el-col>
    </el-row>
    <el-button type="primary" @click="begin">开始游戏</el-button>
  </div>
  <index v-else @backToHome="backToHome" :level="level" />
</template>

<script setup>
import Index from '@/views/index';
import { reactive, toRefs, ref } from 'vue';
import { useStore } from 'vuex';
const state = reactive({
  hasShow: true,
  difficulty: 0,
  level: 10,
});
const store = useStore();
const loading = ref(false);
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
const difficultyName = new Map([
  [0, { name: '简单', level: 2, sheepNum: '90-100' }],
  [25, { name: '一般 ', level: 4, sheepNum: '100-150' }],
  [50, { name: '困难', level: 6, sheepNum: '100-200' }],
  [75, { name: '极难', level: 8, sheepNum: '150-250' }],
  [100, { name: '非常难', level: 10, sheepNum: '200-300' }],
]);
const filterDifficulty = (val) => {
  return difficultyName.get(val).name;
};
const begin = () => {
  loading.value = true;
  state.level = difficultyName.get(state.difficulty).level;
  setTimeout(() => {
    state.hasShow = false;
    loading.value = false;
  }, 3000);
};
const backToHome = () => {
  state.hasShow = !state.hasShow;
};
const { hasShow, difficulty, level } = toRefs(state);
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-top: 10%;
  background: linear-gradient(rgba(55, 199, 243, 0.719), rgb(0, 124, 207));
  box-sizing: border-box;
  .el-row {
    width: 40%;
    height: 200px;
    flex-flow: row nowrap;
    .el-col {
      box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
      border-radius: 4px;
      text-align: center;
      .slider-demo-block {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: space-evenly;
        .el-slider {
          margin-top: 0;
        }
        .demonstration {
          font-size: 24px;
          color: var(--el-text-color-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 0;
        }
      }
      span {
        white-space: nowrap;
      }
      .difficult {
        &-title {
          font-size: 24px;
          color: var(--el-text-color-secondary);
        }
        &-rules {
          display: flex;
          flex-flow: column nowrap;
          font-size: 18px;
          line-height: 25px;
          color: #414141;
          font-weight: 700;
          & > span:last-child {
            font-size: 14px;
            color: #e2e2e2;
            font-weight: 400;
            margin-top: 20px;
          }
        }
      }
    }
  }
  .el-button {
    margin-top: 25px;
    width: 300px;
    height: fit-content;
    font-size: 45px;
  }
}
</style>

<style lang="scss">
body,
html,
#app {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
