import * as Comlink from 'comlink';
import { scalePlotterFactory } from './ScaleUtils';

const LineData = async (
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
    if (abort.true) return {};
    const [x, y] = scale(time);
    if (Math.abs(x) > maxFromOrigin) maxFromOrigin = Math.abs(x);
    if (Math.abs(y) > maxFromOrigin) maxFromOrigin = Math.abs(y);
    data.push({ x, y });
    time += delta;
  }
  return {
    data,
    maxFromOrigin
  };
};

Comlink.expose(LineData);
