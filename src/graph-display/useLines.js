import { startTransition, useEffect, useState } from 'react';

import { generateLineChunks } from 'graph-data';
import { useStateChange } from '../hooks';

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

  useStateChange(
    () => {
      setLines(({
        lines: new Array(maxLoops).fill([]),
        maxRadius: 0
      }));
    },
    [maxLoops]
  );

  const chunkLength = (Math.PI * 100) / CHUNKS_PER_PIE;
  const piesNeeded = maxLoops;
  const maxAlpha = (Math.PI * 100) * piesNeeded;

  useEffect(
    () => {
      let active = true;
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
          if (!active) return;
          startTransition(() => {
            setLines(({ lines }) => {
              lines[chunk] = line;
              return {
                lines: [...lines],
                maxRadius: Math.max(maxRadius, maxFromOrigin)
              };
            });
          });
        }
      );
      return () => {
        active = false;
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
