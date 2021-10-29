import * as Comlink from 'comlink';
import { xScaleFactory, yScaleFactory } from './ScaleUtils';

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
  const xScale = xScaleFactory(pack);
  const yScale = yScaleFactory(pack);
  while (time < t2) {
    if (abort.true) return [];
    data.push({
      x: xScale(time),
      y: yScale(time)
    });
    time += delta;
  }
  return data;
};

Comlink.expose(LineData);
