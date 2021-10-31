import { PlottedLine } from './PlottedLine';
import { Axis } from './Axis';

export const Spirograph = (props) => {
  const {
    style,
    R,
    k,
    k2,
    h,
    glow,
    strokeWidth,
    lines,
    width,
    height,
    maxRadius,
    background,
    foreground
  } = props;

  const viewZoomRatio = ((maxRadius*2) / Math.min(width, height)) || 1;

  return (
    <svg
      width={width}
      height={height}
      style={style}
      viewBox={`${-maxRadius} ${-maxRadius} ${maxRadius*2} ${maxRadius*2}`}
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
        x={-width}
        y={-height}
        width={width*2}
        height={height*2}
        fill={background}
      />

      {lines.map(
        (line, i) => (
          <PlottedLine
            key={i}
            data={line}
            strokeWidth={strokeWidth * viewZoomRatio}
            filter={'url(#glow)'}
            stroke={'url(#lineGradient)'}
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
        color={foreground}
      />
    </svg>
  );
};
