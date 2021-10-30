import { memo } from 'react';
import { LinePath } from '@visx/shape';

const xGetter = ({ x }) => x;
const yGetter = ({ y }) => y;

export const PlottedLine = memo(function PlottedLine({ data, ...rest }) {
  return (
    <LinePath
      data={data}
      x={xGetter}
      y={yGetter}
      {...rest}
    />
  );
});
