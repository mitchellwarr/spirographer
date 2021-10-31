import { useEffect, useState } from 'react';
import { useAPIEffect, useMeasure } from 'hooks';

import { generateLineChunks, scaleFactory } from 'graph-data';
import { NumberInput } from 'elements/NumberInput';
import { Row, RowItem } from 'elements/Row';
import { TimeSlider } from './TimeSlider';
import { Spirograph } from './Spirograph';

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
      const alphaEnd = maxAlpha * alphaPercent;
      const chunksOverwritten = alphaEnd * CHUNKS_PER_PIE;
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
      return generateLineChunks(
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
    },
    [R, k, k2, h, p, delta, maxAlpha, alphaPercent, maxLoops]
  );

  const [glow, setGlow] = useState(() => 1.5);
  const [lineThickness, setLineThickness] = useState(() => 0.2);
  return (
    <div
      style={{
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        {...bind}
        style={{ width: '100%', height: width, maxHeight: 600 }}
      />
      <Spirograph
        style={{ position: 'absolute', top: 0, left: 0 }}
        R={R}
        k={k}
        k2={k2}
        h={h}
        glow={glow}
        strokeWidth={lineThickness}
        lines={lines}
        width={width}
        height={height}
        maxRadius={maxRadius}
        background={'#1b1b1b'}
        foreground={'#fafafa'}
      />

      <Row spacing={16} style={{ padding: '8px 16px' }} >
        <RowItem style={{ width: 140 }} >
          <NumberInput
            value={glow}
            minValue={0}
            step={0.1}
            maxValue={10}
            onSubmit={setGlow}
            label={'Glow'}
          />
        </RowItem>
        <RowItem style={{ width: 140 }} >
          <NumberInput
            value={lineThickness}
            minValue={0}
            step={0.1}
            maxValue={2}
            onSubmit={setLineThickness}
            label={'Thickness'}
          />
        </RowItem>
      </Row>
      <div style={{ padding: '8px 16px' }} >
        <TimeSlider
          value={alphaPercent}
          onChange={setAlphaPercent}
        />
      </div>
    </div>
  );
};
