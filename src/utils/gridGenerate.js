import { nanoid } from 'nanoid';
import { checkIsKill, isOverlap } from './filterSheep.js';

const gameAreaRange = {
  xBegin: 200,
  yBegin: 100,
  xEnd: 1000,
  yEnd: 700,
}; // 游戏区域起始位置  并逐渐递减

let levelNum = 10; // 小羊层次 相当于z轴

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
function generateGameAreaAndRandSheepNum() {
  let gameAreaAndRandSheepNumList = [];
  let sheepTotal = 0; // 小羊总数（所有层次相加）
  for (let level = levelNum; level >= 1; level--) {
    let t = {};
    t.gameArea = {
      xBegin: gameAreaRange.xBegin + (levelNum - level) * levelNum,
      yBegin:
        gameAreaRange.yBegin + Math.ceil(((levelNum - level) * levelNum) / 2),
      xEnd: gameAreaRange.xEnd - (levelNum - level) * levelNum,
      yEnd: gameAreaRange.yEnd - Math.ceil(((levelNum - level) * levelNum) / 2),
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

export function generateSheep() {
  let sheepFlock = [];
  let { gameAreaAndRandSheepNumList, sheepTotal } =
    generateGameAreaAndRandSheepNum(); // 获取所有层次网格及每层次随机网格数量。。。
  let animalList = getAnimalList(sheepTotal); // 获取动物列表
  console.log(animalList, 'animalList');
  for (let level = levelNum; level >= 1; level--) {
    /* const gameArea = {
      xBegin: gameAreaRange.xBegin + (levelNum - level) * levelNum,
      yBegin:
        gameAreaRange.yBegin + Math.ceil(((levelNum - level) * levelNum) / 2),
      xEnd: gameAreaRange.xEnd - (levelNum - level) * levelNum,
      yEnd: gameAreaRange.yEnd - Math.ceil(((levelNum - level) * levelNum) / 2),
    };
    let gameDisc = generateGamePiece(gameArea);
    const randomSheepNum = randomRangeByTimes(
      Math.ceil((gameDisc.xNum * gameDisc.yNum) / 2),
      gameDisc.xNum * gameDisc.yNum,
      3
    ); */
    const gameArea = gameAreaAndRandSheepNumList[level].gameArea;
    let gameDisc = gameAreaAndRandSheepNumList[level].gameDisc;
    const randomSheepNum = gameAreaAndRandSheepNumList[level].randomSheepNum;
    /* console.log(gameDisc, 'gameDisc');
    console.log(randomSheepNum, 'randomSheepNum'); */
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
    console.log(sheepTotal);
  }
  /* console.log(animalList, 'animalList');
  console.log(
    generateGameAreaAndRandSheepNum(),
    'generateGameAreaAndRandSheepNum'
  ); */
  return colourSheep(sheepFlock);
}

// 编写产生startNumber至endNumber随机数的函数
function randomRange(startNumber, endNumber) {
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
export function getAnimalList(curTotalNum) {
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
    return Number(o.slice(8)) <= useAnimalNum;
  });
  const animalListNum = Math.floor(curTotalNum / (3 * useAnimalNum)); // 动物列表的动物要进行'几趟'，向下取整
  const finalanimalListNum = (curTotalNum % (3 * useAnimalNum)) / 3; // 最后一趟参与的动物数量
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
 * @param {当前还有多少动物未占用席位} curTotal
 * @param {当前层级动物数量} curLevelSheepNum
 * @param {当前层级} level
 * @returns
 */
// 暂不考虑赢的分配动物分配算法，全靠概率赢
function getAnimalNo(animalList, curTotal, curLevelSheepNum, level) {
  const animalNo = randomRange(0, useAnimalNum - 1); //采用10头sheep，也就是30一轮回
  let flag = true;
  if (animalList[animalNo]['Artboard' + (animalNo + 1)] > 0) {
    animalList[animalNo]['Artboard' + (animalNo + 1)] -= 1;
  } else {
    flag = false;
  }
  if (!flag && !checkAnimalNumOut(animalList)) {
    return getAnimalNo(animalList, curTotal, curLevelSheepNum, level);
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
