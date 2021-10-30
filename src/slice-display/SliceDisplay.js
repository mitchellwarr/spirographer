import { useMeasure, useAPIEffect } from 'hooks';
import { Group } from '@visx/group';
import './SliceDisplay.scss';
import { Axis } from './Axis';
import { Slider } from '../variable-settings/Slider';
import { useMemo, useState } from 'react';
import { generateLineChunks, scaleFactory } from '../graph-data';
import { Line } from '@visx/shape';
import { GraphedLines } from './GraphedLines';

const RCircle = ({ cx, cy, alpha, beta, r, rotation }) => {

  return (
    <Group
      left={cx}
      top={cy}
    >
      <Line
        className={'slice-display__r-diameter'}
        from={{
          x: r * Math.cos(rotation - Math.PI),
          y: r * Math.sin(rotation - Math.PI),
        }}
        to={{
          x: r * Math.cos(rotation),
          y: r * Math.sin(rotation),
        }}
      />
      <circle
        className={'slice-display__r-center'}
        r={2}
      />
      <circle
        className={'slice-display__r-circumference'}
        r={r}
      />
      <Line
        className={'slice-display__r-line'}
        from={{}}
        to={{
          x: r * Math.cos(alpha),
          y: r * Math.sin(alpha),
        }}
      />
      <Line
        className={'slice-display__r-line'}
        from={{}}
        to={{
          x: r * Math.cos(beta + Math.PI),
          y: r * Math.sin(beta + Math.PI),
        }}
      />
    </Group>
  );
};

const MAX_ALPHA = Math.PI * 10;

export const SliceDisplay = (props) => {
  const {
    R,
    k,
    k2,
    h,
    p,
    delta
  } = props;

  const [bind, { width, height }] = useMeasure();
  
  const scale = useMemo(
    () => scaleFactory({
      R,
      k,
      k2,
      h,
      p
    }),
    [
      R,
      k,
      k2,
      h,
      p
    ]
  );

  const [alpha, setAlpha] = useState(() => Math.PI / 3);

  const {
    r1,
    r2,
    r3,
    beta,
    theta,
    circle1,
    circle2,
    circle3,
    drawingPoint,
  } = scale(alpha);

  const [lines, setLines] = useState(() => []);
  useAPIEffect(
    api => {
      if (!alpha) return setLines([]);
      return generateLineChunks(
        {
          alphaStart: 0,
          alphaEnd: alpha,
          chunkSize: alpha,
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
              return [...lines].slice(0, chunks.length);
            }
          );
        }
      );
    },
    [R, k, k2, h, p, delta, alpha]
  );
  
  return (
    <div className={'slice-display'} >
      <div
        {...bind}
        style={{ height: 500 }}
      />
      <svg className={'slice-display__svg'} width={width} height={height} >
        <rect
          className={'slice-display__background'}
          width={width}
          height={height}
        />

        <Axis width={width} height={height} />

        <Group left={width/2} top={height/2} >
          <g transform={`scale(${(Math.min(width, height) / (((r1 + r2 + r3) * 3) + h))})`} >

            <GraphedLines lines={lines} />

            <RCircle
              alpha={alpha}
              r={r1}
              cx={circle1.x}
              cy={circle1.y}
            />

            <RCircle
              rotation={beta}
              alpha={alpha + beta - (beta * (1/p))}
              beta={alpha}
              r={r2}
              cx={circle2.x}
              cy={circle2.y}
            />

            <RCircle
              rotation={alpha + beta - (beta * (1/p)) - (theta * (1/p))}
              alpha={alpha + beta - (beta * (1/p)) - (theta * (1/p))}
              beta={alpha + beta - (beta * (1/p))}
              r={r3}
              cx={circle3.x}
              cy={circle3.y}
            />
              
            <g>
              <Line
                className={'slice-display__r-line'}
                from={{
                  x: circle3.x + (r3 * Math.cos(alpha + beta - (beta * (1/p)) - (theta * (1/p)))),
                  y: circle3.y + (r3 * Math.sin(alpha + beta - (beta * (1/p)) - (theta * (1/p)))),
                }}
                to={drawingPoint}
              />
              <circle
                className={'slice-display__drawing-point'}
                r={3}
                cx={drawingPoint.x}
                cy={drawingPoint.y}
              />
            </g>

          </g>
        </Group>
      </svg>
      <div style={{ padding: '8px 16px' }} >
        <Slider
          min={0}
          max={MAX_ALPHA}
          step={delta}
          value={alpha}
          style={{
            input: {
              width: 100
            }
          }}
          onChange={setAlpha}
        >
          Time
        </Slider>
      </div>
    </div>
  );
};
