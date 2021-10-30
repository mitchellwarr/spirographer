import { useEffect, useState } from 'react';
import { useAPIEffect, useMeasure } from 'hooks';

import { generateLineChunks, scaleFactory } from 'graph-data';

import { Line } from '@visx/shape';
import { PlottedLine } from './PlottedLine';
import { TimeSlider } from './TimeSlider';

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

  const [lines, setLines] = useState(() => new Array(maxLoops).fill([]));
  useEffect(
    () => setLines(new Array(maxLoops).fill([])),
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
        lines => [
          ...lines.slice(0, chunksOverwritten),
          ...lines.slice(chunksOverwritten).map(() => [])
        ]
      );
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
        ({ line, chunk, chunks }) => {
          if (!api.current) return;
          setLines(
            lines => {
              lines[chunk] = line;
              return [...lines];
            }
          );
        }
      );
    },
    [R, k, k2, h, p, delta, maxAlpha, alphaPercent, maxLoops]
  );

  const viewRadius = Math.max(...lines.flat().flatMap(d => [Math.abs(d.x), Math.abs(d.y)])) || 0;
  const viewZoomRatio = ((viewRadius*2) / Math.min(width, height)) || 1;

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
        viewBox={`${-viewRadius} ${-viewRadius} ${viewRadius*2} ${viewRadius*2}`}
      >
        <Line
          from={{ x: -(width/2) * viewZoomRatio }}
          to={{ x: width/2 * viewZoomRatio }}
          stroke={'black'}
          strokeWidth={1.3 * viewZoomRatio}
        />
        <Line
          from={{ y: -(height/2) * viewZoomRatio }}
          to={{ y: height/2 * viewZoomRatio }}
          stroke={'black'}
          strokeWidth={1.3 * viewZoomRatio}
        />
        {lines.map(
          (line, i) => (
            <PlottedLine
              key={i}
              data={line}
            />
          )
        )}
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
