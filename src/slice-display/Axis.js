import { Line } from '@visx/shape';

export const Axis = ({ width, height }) => (
  <g>
    <Line
      className={'slice-display__axis-lines'}
      from={{ y: height/2 }}
      to={{ x: width, y: height/2 }}
      strokeWidth={1.4}
    />
    <Line
      className={'slice-display__axis-lines'}
      from={{ x: width/2 }}
      to={{ x: width/2, y: height }}
      strokeWidth={1.4}
    />
  </g>
);
