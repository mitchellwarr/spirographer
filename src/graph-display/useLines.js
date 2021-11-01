import { useEffect, useState } from 'react';
import { useAPIEffect } from 'hooks';

import { generateLineChunks } from 'graph-data';

const CHUNKS_PER_PIE = 1;

export const useLines = (props) => {
  const {
    R,
    k,
    k2,
    h,
    p,
    delta,
    maxLoops,
    alphaPercent = 1
  } = props;

  const [
    {
      lines,
      maxRadius
    },
    setLines
  ] = useState(
    () => ({
      lines: new Array(maxLoops).fill([]),
      maxRadius: 0
    })
  );

  useEffect(
    () => void setLines(({
      lines: new Array(maxLoops).fill([]),
      maxRadius: 0
    })),
    [maxLoops]
  );

  const chunkLength = (Math.PI * 100) / CHUNKS_PER_PIE;
  const piesNeeded = maxLoops;
  const maxAlpha = (Math.PI * 100) * piesNeeded;

  useAPIEffect(
    api => {
      const alphaEnd = maxAlpha * alphaPercent;
      const chunksOverwritten = Math.ceil(alphaEnd / chunkLength);
      setLines(
        ({ lines, maxRadius }) => ({
          maxRadius,
          lines: [
            ...lines.slice(0, chunksOverwritten),
            ...lines.slice(chunksOverwritten).map(() => [])
          ]
        })
      );
      const maxRadius = R + ((R/k) * 2) + ((R/k2) * 2) + ((h * R) - (R/k2));
      const cleanup = generateLineChunks(
        {
          alphaStart: 0,
          alphaEnd,
          chunkSize: chunkLength,
          R,
          k,
          k2,
          h,
          p,
          delta,
        },
        ({ line, chunk, chunks, maxFromOrigin }) => {
          if (!api.current) return;
          setLines(
            ({ lines }) => {
              lines[chunk] = line;
              return {
                lines: [...lines],
                maxRadius: Math.max(maxRadius, maxFromOrigin)
              };
            }
          );
        }
      );
      return () => {
        cleanup();
      };
    },
    [R, k, k2, h, p, delta, maxAlpha, alphaPercent, maxLoops]
  );

  return {
    lines,
    maxRadius
  };
};
