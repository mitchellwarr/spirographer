import { useLines } from './useLines';
import { Spirograph } from './Spirograph';
import './Tile.scss';

export const Tile = (props) => {
  const {
    R,
    k,
    k2,
    h,
    p,
    delta,
    maxLoops,
    width,
    height,
    glow,
    lineThickness
  } = props;
  
  const {
    lines,
    maxRadius
  } = useLines({
    R,
    k,
    k2,
    h,
    p,
    delta,
    maxLoops,
    alphaPercent: 1
  });

  return (
    <div className={'spirograph-tile'} >
      <Spirograph
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
    </div>
  );
};
