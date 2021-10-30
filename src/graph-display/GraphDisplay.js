import { useEffect, useState } from 'react';
import { useAPIEffect, useMeasure } from 'hooks';

import { generateLineChunks, scaleFactory } from 'graph-data';

import { PlottedLine } from './PlottedLine';
import { TimeSlider } from './TimeSlider';
import { Axis } from './Axis';

const PIES_NEEDED = (scaleData, max) => {
  const scale = scaleFactory(scaleData);
  const start = scale(0);
  for (let i = 1; i < max; i++) {
    const { x, y } = scale(Math.PI * 100 * i);
    if (
      Math.abs(x - start.x) < 0.5 &&
      Math.abs(y - start.y) < 0.5
    ) return i;
  }
  return max;
};

const CHUNKS_PER_PIE = 1;

export const GraphDisplay = (props) => {
  const {
    R,
    k,
    k2,
    h,
    p,
    delta,
    maxLoops
  } = props;

  const [bind, { width, height }] = useMeasure();

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
  const piesNeeded = PIES_NEEDED({ R, k, k2, h, p }, maxLoops);
  const maxAlpha = (Math.PI * 100) * piesNeeded;
  const [alphaPercent, setAlphaPercent] = useState(() => 1);

  useAPIEffect(
    api => {
      const chunksOverwritten = maxAlpha * CHUNKS_PER_PIE;
      setLines(
        ({ lines, maxRadius }) => ({
          maxRadius,
          lines: [
            ...lines.slice(0, chunksOverwritten),
            ...lines.slice(chunksOverwritten).map(() => [])
          ]
        })
      );
      const maxRadius = R + ((R/k) * 2) + ((R/k2) * 2) + (h - (R/k2));
      return generateLineChunks(
        {
          alphaStart: 0,
          alphaEnd: maxAlpha * alphaPercent,
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
    },
    [R, k, k2, h, p, delta, maxAlpha, alphaPercent, maxLoops]
  );

  const viewZoomRatio = ((maxRadius*2) / Math.min(width, height)) || 1;

  return (
    <div
      style={{
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        width: '100%'
      }}
    >
      <div
        {...bind}
        style={{ width: '100%', height: width, maxHeight: 600 }}
      />
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
        viewBox={`${-maxRadius} ${-maxRadius} ${maxRadius*2} ${maxRadius*2}`}
      >
        {lines.map(
          (line, i) => (
            <PlottedLine
              key={i}
              data={line}
            />
          )
        )}
        <Axis
          width={width}
          height={height}
          viewZoomRatio={viewZoomRatio}
          R={R}
          k={k}
          k2={k2}
          h={h}
        />
      </svg>
      <div style={{ padding: '8px 16px' }} >
        <TimeSlider
          value={alphaPercent}
          onChange={setAlphaPercent}
        />
      </div>
    </div>
  );
};
