import { memo } from 'react';
import { LinePath } from '@visx/shape';

const xGetter = ({ x }) => x;
const yGetter = ({ y }) => y;

export const PlottedLine = memo(function PlottedLine({ data }) {
  return (
    <LinePath
      data={data}
      x={xGetter}
      y={yGetter}
      stroke={'red'}
      opacity={0.4}
      strokeWidth={0.5}
    />
  );
});
