import { useMemo } from 'react';
import { line } from 'd3';

const xGetter = ({ x }) => x;
const yGetter = ({ y }) => y;

const linePath = line();
linePath.x(xGetter);
linePath.y(yGetter);

export const PlottedLine = ({ data, ...rest }) => {
  const d = useMemo(
    () => linePath(data),
    [data]
  );
  return (
    <path
      d={d}
      fill={'none'}
      {...rest}
    />
  );
};
