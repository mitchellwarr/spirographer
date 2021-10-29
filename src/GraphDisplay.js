import { useMemo, useState } from 'react';
import { useAPIEffect, useMeasure } from 'hooks';

import { generateLineChunks, xScaleFactory, yScaleFactory } from './graph-data';

import { Line, LinePath } from '@visx/shape';
import { extent } from 'd3-array';

const xGetter = ({ x }) => x;
const yGetter = ({ y }) => y;

const PIES_NEEDED = (scaleData, max) => {
  const xScale = xScaleFactory(scaleData);
  const yScale = yScaleFactory(scaleData);
  const start = {
    x: xScale(0),
    y: yScale(0)
  };
  for (let i = 1; i < max; i++) {
    const x = xScale(Math.PI * 100 * i);
    const y = yScale(Math.PI * 100 * i);
    if (
      Math.abs(x - start.x) < 0.1 &&
      Math.abs(y - start.y) < 0.1
    ) return i;
  }
  return max;
};

export const GraphDisplay = (props) => {
  const {
    R,
    k,
    k2,
    h,
    p,
    delta
  } = props;

  const [bind, { width, height }] = useMeasure();

  const [lines, setLines] = useState(() => []);

  useAPIEffect(
    async api => {

      const chunkPerPie = 4;
      const chunkLength = (Math.PI * 100) / chunkPerPie;

      const piesNeeded = PIES_NEEDED({ R, k, k2, h, p }, 10);

      generateLineChunks(
        {
          alphaStart: 0,
          alphaEnd: (Math.PI * 100) * piesNeeded,
          chunkSize: chunkLength,
          R,
          k,
          k2,
          h,
          p,
          delta,
        },
        ({ line, chunk, chunkLength }) => {
          if (!api.current) return;
          setLines(
            lines => {
              lines[chunk] = line;
              return [...lines].slice(0, chunkLength);
            }
          );
        }
      );
    },
    [R, k, k2, h, p, delta]
  );

  const viewRadius = useMemo(
    () => {
      const xDomain = extent(lines.flat(), xGetter);
      const yDomain = extent(lines.flat(), yGetter);
      return Math.max(...[...xDomain, ...yDomain].map(x => Math.abs(x))) || 0;
    },
    [lines]
  );

  const viewZoomRatio = ((viewRadius*2) / Math.min(width, height)) || 1;
  return (
    <div
      style={{
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: 16
      }}
      {...bind}
    >
      <svg
        width={'100%'}
        height={'300px'}
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
            <LinePath
              key={i}
              data={line}
              x={xGetter}
              y={yGetter}
              stroke={'red'}
              opacity={0.2}
              strokeWidth={0.5}
            />
          )
        )}
      </svg>
    </div>
  );
};
