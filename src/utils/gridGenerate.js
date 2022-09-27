import { nanoid } from 'nanoid';
import { checkIsKill, isOverlap } from './filterSheep.js';
import store from '@/store/index';
console.log(store.getters.getLevel);
const gameAreaRange = {
  xBegin: 200,
  yBegin: 100,
  xEnd: 1000,
  yEnd: 700,
}; // 游戏区域起始位置  并逐渐递减

// 采用数组对象 记录三组侧边栏的起始位置
const gameAreaSiderRange = [
  {
    x: 1300,
    y: 200,
  },
  {
    x: 1300,
    y: 350,
  },
  {
    x: 1300,
    y: 500,
  },
];

let levelNum = store.getters.getLevel; // 小羊层次 相当于z轴

const SheepPieceLen = 100; // 🐏 方块 边长

const useAnimalNum = 10; // 使用 🐏 种类
// 创建棋盘三维数组
// x:y轴  y:x轴 z:是否被占用
export function generateGamePiece(gameArea) {
  let pieceList = new Array();
  for (
    let yIndex = 0;
    yIndex < parseInt((gameArea.yEnd - gameArea.yBegin) / SheepPieceLen);
    yIndex++
  ) {
    pieceList[yIndex] = new Array();
    for (
      let xIndex = 0;
      xIndex < parseInt((gameArea.xEnd - gameArea.xBegin) / SheepPieceLen);
      xIndex++
    ) {
      pieceList[yIndex][xIndex] = [
        xIndex * SheepPieceLen,
        yIndex * SheepPieceLen,
        0,
      ];
    }
  }
  const pieceListInfo = {
    pieceList,
    xNum: parseInt((gameArea.xEnd - gameArea.xBegin) / SheepPieceLen),
    yNum: parseInt((gameArea.yEnd - gameArea.yBegin) / SheepPieceLen),
  };
  return pieceListInfo;
}
// 共有网格 48
// 网格三维 [6][8][2]

// 创建每层次棋盘区域以及产生的小羊总数量
function generateGameAreaAndRandSheepNum(inlevelNum) {
  let gameAreaAndRandSheepNumList = [];
  let sheepTotal = 0; // 小羊总数（所有层次相加）
  for (let level = inlevelNum; level >= 1; level--) {
    let t = {};
    t.gameArea = {
      xBegin: gameAreaRange.xBegin + (inlevelNum - level) * inlevelNum,
      yBegin:
        gameAreaRange.yBegin +
        Math.ceil(((inlevelNum - level) * inlevelNum) / 2),
      xEnd: gameAreaRange.xEnd - (inlevelNum - level) * inlevelNum,
      yEnd:
        gameAreaRange.yEnd - Math.ceil(((inlevelNum - level) * inlevelNum) / 2),
    };
    t.gameDisc = generateGamePiece(t.gameArea);
    t.randomSheepNum = randomRangeByTimes(
      Math.ceil((t.gameDisc.xNum * t.gameDisc.yNum) / 2),
      t.gameDisc.xNum * t.gameDisc.yNum,
      3
    );
    sheepTotal += t.randomSheepNum;
    gameAreaAndRandSheepNumList[level] = t;
  }
  return { gameAreaAndRandSheepNumList, sheepTotal };
}

export function generateSheep(inlevelNum) {
  let sheepFlock = [];
  let { gameAreaAndRandSheepNumList, sheepTotal } =
    generateGameAreaAndRandSheepNum(inlevelNum); // 获取所有层次网格及每层次随机网格数量。。。
  let animalList = getAnimalList(sheepTotal, useAnimalNum); // 获取动物列表
  for (let level = inlevelNum; level >= 1; level--) {
    const gameArea = gameAreaAndRandSheepNumList[level].gameArea;
    let gameDisc = gameAreaAndRandSheepNumList[level].gameDisc;
    const randomSheepNum = gameAreaAndRandSheepNumList[level].randomSheepNum;

    for (
      let curLevelSheepIndex = 0;
      curLevelSheepIndex < randomSheepNum;
      curLevelSheepIndex++
    ) {
      const xAxis = randomRange(0, gameDisc.xNum - 1);
      const yAxis = randomRange(0, gameDisc.yNum - 1);
      const coord = gameDisc.pieceList[yAxis][xAxis];
      if (coord[2]) {
        // 坑位被占，回退-1
        curLevelSheepIndex--;
        continue;
      } else {
        // 坑位还在
        const animal = getAnimalNo(
          animalList,
          useAnimalNum, // 10
          sheepTotal,
          randomSheepNum,
          level
        ); // 取得随机动物编号 - 图片名称
        animalList = animal.obj;
        const param = {
          id: nanoid(),
          style: {
            zIndex: level,
            //起始 200 ，结尾800
            left: gameArea.xBegin + coord[0] + 'px',
            top: gameArea.yBegin + coord[1] + 'px',
            cursor: 'pointer',
          },
          animalName: animal.name,
        };
        coord[2] = 1;
        sheepFlock.push(param);
      }
    }
    sheepTotal -= randomSheepNum;
  }
  // 层次大于6，相当于困难级别以上，才开启侧边栏
  if (inlevelNum > 6) {
    /**
     * 处理侧边栏卡片
     */
    // 总的侧边栏卡片数量
    const siderNumTotal = randomRangeByTimes(30, 50, 3);
    // 这里给8种动物卡片
    let siderAnimalList = getAnimalList(siderNumTotal, 8);
    console.log(siderNumTotal);
    // 三组侧边栏卡片
    let total = siderNumTotal;
    for (let i = 0; i < 3; i++) {
      // 每组随机分层 5-10
      let curSiderLevelNum = 0;
      if (i != 2) {
        curSiderLevelNum = randomRange(8, 14);
        total -= curSiderLevelNum;
      } else {
        curSiderLevelNum = total;
      }
      console.log(curSiderLevelNum);
      for (let j = curSiderLevelNum; j >= 1; j--) {
        // 坑位还在
        const animal = getAnimalNo(
          siderAnimalList,
          8,
          siderNumTotal,
          1, // 调用的函数 后两个入参暂时不处理，先随便写下
          curSiderLevelNum
        ); // 取得随机动物编号 - 图片名称
        siderAnimalList = animal.obj;
        const param = {
          id: nanoid(),
          style: {
            zIndex: curSiderLevelNum,
            //起始 200 ，结尾800
            left: gameAreaSiderRange[i].x - j * 10 + 'px',
            top: gameAreaSiderRange[i].y + 'px',
            cursor: 'pointer',
          },
          animalName: animal.name,
        };
        sheepFlock.push(param);
      }
    }
  }
  return colourSheep(sheepFlock);
}

// 编写产生startNumber至endNumber随机数的函数
export function randomRange(startNumber, endNumber) {
  var choice = endNumber - startNumber + 1;
  return Math.floor(Math.random() * choice + startNumber);
}

// 编写以 times 为倍数的startNumber至endNumber随机数的函数
function randomRangeByTimes(startNumber, endNumber, times) {
  const num = randomRange(startNumber, endNumber);
  if (num % times === 0) {
    return num;
  } else {
    return randomRangeByTimes(startNumber, endNumber, times);
  }
}

// 层次上色
export function colourSheep(sheepFlock) {
  for (const item of sheepFlock) {
    if (checkIsKill(item, sheepFlock)) {
      item.style.back = 'rgba(255,255,255,1)';
    } else {
      item.style.back = `rgba(92,91,88, ${0.1 * item.style.zIndex})`;
    }
  }
  return sheepFlock;
}
/**
 *
 * @param {产生的动物总数量} curTotalNum
 * @returns
 */
export function getAnimalList(curTotalNum, useAnimalNums) {
  const animalList = [
    'Artboard1',
    'Artboard2',
    'Artboard3',
    'Artboard4',
    'Artboard5',
    'Artboard6',
    'Artboard7',
    'Artboard8',
    'Artboard9',
    'Artboard10',
    'Artboard11',
    'Artboard12',
    'Artboard13',
    'Artboard14',
    'Artboard15',
    'Artboard16',
    'Artboard17',
    'Artboard18',
    'Artboard19',
    'Artboard20',
    'Artboard21',
    'Artboard22',
    'Artboard23',
    'Artboard24',
    'Artboard25',
    'Artboard26',
    'Artboard27',
    'Artboard28',
    'Artboard29',
    'Artboard30',
    'Artboard31',
    'Artboard32',
    'Artboard33',
    'Artboard34',
    'Artboard35',
    'Artboard36',
    'Artboard37',
    'Artboard38',
  ];
  let curAnimalList = animalList.filter((o) => {
    return Number(o.slice(8)) <= useAnimalNums;
  });
  const animalListNum = Math.floor(curTotalNum / (3 * useAnimalNums)); // 动物列表的动物要进行'几趟'，向下取整
  const finalanimalListNum = (curTotalNum % (3 * useAnimalNums)) / 3; // 最后一趟参与的动物数量
  let finalAnimalList = curAnimalList.map((o) => {
    let t = {};
    if (Number(o.slice(8)) <= finalanimalListNum) {
      t[o] = animalListNum * 3 + 3;
    } else {
      t[o] = animalListNum * 3;
    }
    return t;
  });
  console.log(finalAnimalList, 'finalAnimalList');
  return finalAnimalList;
}
/**
 *
 * @param {动物列表占用情况} animalList
 * @param {使用的动物卡片数量} useAnimalNums
 * @param {当前还有多少动物未占用席位} curTotal
 * @param {当前层级动物数量} curLevelSheepNum
 * @param {当前层级} level
 * @returns
 */
// 暂不考虑赢的分配动物分配算法，全靠概率赢
function getAnimalNo(
  animalList,
  useAnimalNums,
  curTotal,
  curLevelSheepNum,
  level
) {
  const animalNo = randomRange(0, useAnimalNums - 1); //采用10头sheep，也就是30一轮回
  let flag = true;
  if (animalList[animalNo]['Artboard' + (animalNo + 1)] > 0) {
    animalList[animalNo]['Artboard' + (animalNo + 1)] -= 1;
  } else {
    flag = false;
  }
  if (!flag && !checkAnimalNumOut(animalList)) {
    return getAnimalNo(
      animalList,
      useAnimalNums,
      curTotal,
      curLevelSheepNum,
      level
    );
  } else
    return {
      name: 'Artboard' + (animalNo + 1),
      obj: animalList,
    };
}
// 检查动物数量是否都用完了
function checkAnimalNumOut(list) {
  let total = 0;
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element['Artboard' + (index + 1)] === 0) {
      total += 1;
    }
  }
  return total === useAnimalNum ? true : false;
}
