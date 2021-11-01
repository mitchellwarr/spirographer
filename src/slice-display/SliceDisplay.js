import { useMeasure, useAPIEffect } from 'hooks';
import { Group } from '@visx/group';
import './SliceDisplay.scss';
import { Axis } from './Axis';
import { Slider } from 'elements/slider';
import { useMemo, useState } from 'react';
import { generateLineChunks, scaleFactory } from '../graph-data';
import { Line } from '@visx/shape';
import { GraphedLines } from './GraphedLines';

const RCircle = ({ cx, cy, alpha, beta, r, rotation, viewZoomRatio }) => {
  return (
    <Group
      left={cx}
      top={cy}
    >
      <Line
        className={'slice-display__r-diameter'}
        from={{
          x: r * Math.cos(rotation),
          y: r * Math.sin(rotation),
        }}
        to={{
          x: r * Math.cos(rotation + Math.PI),
          y: r * Math.sin(rotation + Math.PI),
        }}
        strokeWidth={viewZoomRatio}
      />
      <circle
        className={'slice-display__r-center'}
        r={3 * viewZoomRatio}
      />
      <circle
        className={'slice-display__r-circumference'}
        r={r}
        strokeWidth={viewZoomRatio}
      />
      <Line
        className={'slice-display__r-line'}
        from={{}}
        to={{
          x: r * Math.cos(alpha),
          y: r * Math.sin(alpha),
        }}
        strokeWidth={1.5 * viewZoomRatio}
      />
      <Line
        className={'slice-display__r-line'}
        from={{}}
        to={{
          x: r * Math.cos(beta + Math.PI),
          y: r * Math.sin(beta + Math.PI),
        }}
        strokeWidth={1.5 * viewZoomRatio}
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
    delta,
    glow
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
    rh,
    beta,
    circle1,
    circle2,
    circle3,
    drawingPoint,
    betaCoefficients,
    thetaCoefficients,
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
              return [...lines];
            }
          );
        }
      );
    },
    [R, k, k2, h, p, delta, alpha]
  );
  
  const maxRadius = (((r1 + r2 + r3) * 3) + rh);
  const viewZoomRatio = ((maxRadius*2) / Math.min(width, height)) || 1;
  return (
    <div className={'slice-display'} >
      <div
        {...bind}
        style={{ height: 600 }}
      />
      <svg
        className={'slice-display__svg'}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <filter id={'glow'}>
          <feGaussianBlur result={'coloredBlur'} stdDeviation={glow} />
          <feMerge>
            <feMergeNode in={'coloredBlur'} />
            <feMergeNode in={'SourceGraphic'} />
          </feMerge>
        </filter>
        <defs>
          <linearGradient
            id={'lineGradient'}
            x1={0}
            x2={0}
            y1={-maxRadius}
            y2={maxRadius}
            gradientTransform={'rotate(24)'}
            gradientUnits={'userSpaceOnUse'}
          >
            <stop offset={0} stopColor={'#ffbc3b'} />
            <stop offset={0.15} stopColor={'#ffe26c'} />
            <stop offset={0.5} stopColor={'#fff3c0'} />
            <stop offset={0.85} stopColor={'#f589aa'} />
            <stop offset={1} stopColor={'#ff70ba'} />
          </linearGradient>
        </defs>

        <rect
          className={'slice-display__background'}
          width={width}
          height={height}
        />

        <Axis width={width} height={height} />

        <Group left={width/2} top={height/2} >
          <g transform={`scale(${Math.min(width, height) / maxRadius})`} >

            <GraphedLines
              lines={lines}
              viewZoomRatio={viewZoomRatio * 0.5}
              filter={'url(#glow)'}
              stroke={'url(#lineGradient)'}
            />

            <RCircle
              alpha={alpha}
              r={r1}
              cx={circle1.x}
              cy={circle1.y}
              viewZoomRatio={viewZoomRatio}
            />

            <RCircle
              rotation={alpha + beta}
              alpha={alpha * betaCoefficients}
              beta={alpha}
              r={r2}
              cx={circle2.x}
              cy={circle2.y}
              viewZoomRatio={viewZoomRatio}
            />

            <RCircle
              rotation={alpha * thetaCoefficients}
              alpha={alpha * thetaCoefficients}
              beta={alpha * betaCoefficients}
              r={r3}
              cx={circle3.x}
              cy={circle3.y}
              viewZoomRatio={viewZoomRatio}
            />
              
            <g>
              <Line
                className={'slice-display__r-line'}
                from={circle3}
                to={drawingPoint}
                strokeWidth={viewZoomRatio}
              />
              <circle
                filter={'url(#glow)'}
                fill={'url(#lineGradient)'}
                r={2 * viewZoomRatio}
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
          label={'Radians'}
        />
      </div>
    </div>
  );
};
