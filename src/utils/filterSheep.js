export function checkIsKill(obj, optList) {
  let flag = true;
  const xyRange = {
    xBegin: separatePxToFloat(obj.style.left),
    xEnd: separatePxToFloat(obj.style.left) + sheepLen,
    yBegin: separatePxToFloat(obj.style.top),
    yEnd: separatePxToFloat(obj.style.top) + sheepLen,
    zIndex: obj.style.zIndex,
  };
  for (let index = 0; index < optList.length; index++) {
    if (
      isOverlap(xyRange, {
        x: separatePxToFloat(optList[index].style.left),
        y: separatePxToFloat(optList[index].style.top),
      })
    )
      if (optList[index].style.zIndex > xyRange.zIndex) {
        flag = false;
      }
    if (!flag) {
      break;
    }
  }
  return flag;
}
// xxxpx 取 xxx
export function separatePx(field) {
  const pxIndex = field.indexOf('px');
  return field.slice(0, pxIndex);
}
// xxxpx 取 xxx 并转Number类型
export function separatePxToFloat(field) {
  const pxIndex = field.indexOf('px');
  return parseFloat(field.slice(0, pxIndex));
}

const sheepLen = 100; // 小🐏 方块长高长度

// 判断两个长方形是否重叠
export function isOverlap(sourceRect, targetRect) {
  // 先获取目标 长方形的四个顶点
  const targetList = [
    { x: targetRect.x, y: targetRect.y }, // 左上角
    { x: targetRect.x, y: targetRect.y + sheepLen }, // 左下角
    { x: targetRect.x + sheepLen, y: targetRect.y }, // 右上角
    { x: targetRect.x + sheepLen, y: targetRect.y + sheepLen }, // 右下角
  ];
  let flag = false;
  for (let index = 0; index < targetList.length; index++) {
    const element = targetList[index];
    // 判断点是否在 source 长方形内
    if (element.x >= sourceRect.xBegin && element.y >= sourceRect.yBegin) {
      if (element.x <= sourceRect.xEnd && element.y <= sourceRect.yEnd) {
        flag = true;
      }
    }
    if (flag) {
      break;
    }
  }
  return flag;
}
