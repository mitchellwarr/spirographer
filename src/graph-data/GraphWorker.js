import * as Comlink from 'comlink';
import { scaleFactory } from './ScaleUtils';

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
  const scale = scaleFactory(pack);
  while (time < t2) {
    if (abort.true) return [];
    const { x, y } = scale(time);
    data.push({ x, y });
    time += delta;
  }
  return data;
};

Comlink.expose(LineData);
