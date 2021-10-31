import * as Comlink from 'comlink';
import { scalePlotterFactory } from './ScaleUtils';

const lineDataChunk = async (
  {
    R,
    k,
    k2,
    h,
    p,
    range: [t1, t2] = [],
    delta
  },
  abort
) => {
  let time = t1;
  let data = [];


  const pack = { R, k, k2, h, p };
  const scale = scalePlotterFactory(pack);
  let maxFromOrigin = 0;
  
  while(time < t2) {
    if ((time % (delta * 2000) == 0) && await abort()) {
      return {
        data: [],
        maxFromOrigin: 0
      };
    }
    const [x, y] = scale(time);
    if (Math.abs(x) > maxFromOrigin) maxFromOrigin = Math.abs(x);
    if (Math.abs(y) > maxFromOrigin) maxFromOrigin = Math.abs(y);
    data.push({ x, y });
    time += delta;
  }
  if (await abort()) {
    return {
      data: [],
      maxFromOrigin: 0
    };
  }
  return {
    data,
    maxFromOrigin
  };
};


// const lineDataChunk = async (
//   {
//     R,
//     i,
//     k,
//     k2,
//     h,
//     p,
//     range: [t1, t2] = [],
//     delta
//   }
// ) => {
//   let time = t1;
//   let data = [];

//   delta = 0.02;
//   console.time();
//   const pack = { R, k, k2, h, p };
//   const scale = scalePlotterFactory(pack);
//   let maxFromOrigin = 0;
  
//   while(time < t2) {
//     const [x, y] = scale(time);
//     if (Math.abs(x) > maxFromOrigin) maxFromOrigin = Math.abs(x);
//     if (Math.abs(y) > maxFromOrigin) maxFromOrigin = Math.abs(y);
//     data.push(x, y);
//     time += delta;
//   }
//   console.timeEnd();
//   let dataBuffer = new Float32Array([i, maxFromOrigin, ...data]);
//   postMessage(dataBuffer.buffer, [dataBuffer.buffer]);
// };

Comlink.expose(lineDataChunk);
