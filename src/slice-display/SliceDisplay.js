import { useMeasure, useAPIEffect } from 'hooks';
import { Group } from '@visx/group';
import './SliceDisplay.scss';
import { Axis } from './Axis';
import { Slider } from '../variable-settings/Slider';
import { useState } from 'react';
import { generateLineChunks } from '../graph-data';
import { Line, LinePath } from '@visx/shape';

const xGetter = ({ x }) => x;
const yGetter = ({ y }) => y;

const RCircle = ({ cx, cy, alpha, r, rotation }) => {

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
    </Group>
  );
};

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
  
  const [alpha, setAlpha] = useState(0);

  const r1 = R;
  const r2 = R / k;
  const r3 = R / k2;

  const beta = (r1 / r2) * alpha;
  const theta = (r1 / r3) * alpha;


  const circle1 = {
    x: 0,
    y: 0,
  };

  const circle2 = {
    x: (r1 + r2) * Math.cos(alpha),
    y: (r1 + r2) * Math.sin(alpha),
  };

  const circle3 = {
    x: circle2.x + ((r2 + r3) * Math.cos(alpha + beta - (beta * (1/p)))),
    y: circle2.y + ((r2 + r3) * Math.sin(alpha + beta - (beta * (1/p)))),
  };

  const drawingPoint = {
    x: circle3.x + (h * Math.cos(alpha + beta - (beta * (1/p)) - (theta * (1/p)))),
    y: circle3.y + (h * Math.sin(alpha + beta - (beta * (1/p)) - (theta * (1/p)))),
  };



  const [lines, setLines] = useState(() => []);
  useAPIEffect(
    async api => {
      if (!alpha) return setLines([]);
      generateLineChunks(
        {
          alphaStart: 0,
          alphaEnd: alpha,
          chunkSize: Math.PI * 5,
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
    [R, k, k2, h, p, delta, alpha]
  );

  return (
    <div className={'slice-display'} >
      <div
        {...bind}
        style={{ height: 400 }}
      >
        <svg width={width} height={height} >
          <rect
            className={'slice-display__background'}
            width={width}
            height={height}
          />

          <Axis width={width} height={height} />

          <Group left={width/2} top={height/2} >
            <g transform={`scale(${Math.min(width, height) / ((r1 + r2 + r3) * 2)})`} >
              
              <g className={'slice-display__graphed-line'} >
                {lines.map(
                  (line, i) => (
                    <LinePath
                      key={i}
                      data={line}
                      x={xGetter}
                      y={yGetter}
                    />
                  )
                )}
              </g>
              
              <RCircle
                alpha={alpha}
                r={r1}
                cx={circle1.x}
                cy={circle1.y}
              />

              <RCircle
                rotation={alpha + beta}
                alpha={alpha + beta - (beta * (1/p))}
                r={r2}
                cx={circle2.x}
                cy={circle2.y}
              />

              <RCircle
                rotation={alpha + beta + theta}
                alpha={alpha + beta - (beta * (1/p)) - (theta * (1/p))}
                r={r3}
                cx={circle3.x}
                cy={circle3.y}
              />
              
              <g>
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
      </div>
      <div style={{ padding: '8px 16px' }} >
        <Slider
          min={0}
          max={Math.PI * 20}
          step={'any'}
          value={alpha}
          style={{
            input: {
              width: 100
            }
          }}
          onChange={setAlpha}
        >
          Alpha
        </Slider>
      </div>
    </div>
  );
};
