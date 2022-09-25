<template>
  <div class="container" v-if="hasShow">
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
      <el-col :span="12" :push="1">
        <span></span>
      </el-col>
    </el-row>
    <el-button type="primary">开始游戏</el-button>
  </div>
  <index v-else />
</template>

<script setup>
import Index from '@/views/index';
import { reactive, toRefs } from 'vue';
const state = reactive({
  hasShow: true,
  difficulty: 1,
});
const filterDifficulty = (val) => {
  const difficultyName = new Map([
    [1, '简单'],
    [25, '一般 '],
    [50, '困难'],
    [75, '极难'],
    [100, '非常难'],
  ]);
  return difficultyName.get(val);
};
const { hasShow, difficulty } = toRefs(state);
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin-top: 10%;
  .el-row {
    width: 40%;
    height: 200px;
    flex-flow: row nowrap;
    .el-col {
      box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
      border-radius: 4px;
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
