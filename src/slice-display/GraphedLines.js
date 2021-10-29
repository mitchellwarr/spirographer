import { LinePath } from '@visx/shape';

const xGetter = ({ x }) => x;
const yGetter = ({ y }) => y;

export const GraphedLines = ({ lines }) => (
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
);
