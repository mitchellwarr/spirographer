import * as Comlink from 'comlink';
// eslint-disable-next-line import/no-unresolved
import GraphWorker from 'web-worker:./GraphWorker';

const graphWorker = new GraphWorker();
const lineDataChunk = Comlink.wrap(graphWorker);

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

  const ranges = Array.from(
    { length: chunkNumber },
    (_, i) => [i*chunkSize, Math.min((i+1)*chunkSize, alphaEnd)]
  );

  const abort = { true: false };
  const abortProxy = Comlink.proxy(() => abort.true);
  for (let i in ranges) {
    lineDataChunk(
      {
        R,
        k,
        k2,
        h,
        p,
        delta,
        range: ranges[i],
      },
      abortProxy
    )
      .then(
        ({ data: line, maxFromOrigin }) => {
          cb({
            line,
            chunk: i,
            chunks: ranges,
            maxFromOrigin
          });
        }
      );
  }
  return () => {
    abort.true = true;
  };
};
