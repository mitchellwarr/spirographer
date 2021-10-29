import * as Comlink from 'comlink';
// eslint-disable-next-line import/no-unresolved
import GraphWorker from 'web-worker:./GraphWorker';

export const generateLineChunks = (props, cb) => {
  const {
    alphaStart,
    alphaEnd,
    chunkSize,
    R,
    k,
    k2,
    h,
    p,
    delta,
  } = props;
  
  const alphaLength = alphaEnd - alphaStart;
  const chunkNumber = Math.ceil(alphaLength / chunkSize);

  const lineDataChunk = Comlink.wrap(new GraphWorker());

  const ranges = Array.from(
    { length: chunkNumber },
    (_, i) => [i*chunkSize, Math.min((i+1)*chunkSize, alphaEnd)]
  );

  for (let i in ranges) {
    (async () => {
      const line = await lineDataChunk({
        R,
        k,
        k2,
        h,
        p,
        delta,
        range: ranges[i],
      });
      cb({ line, chunk: i, chunkLength: ranges.length });
    })();
  }
};
