import { useState } from 'react';
import { useMeasure } from 'hooks';

import { NumberInput } from 'elements/NumberInput';
import { Row, RowItem } from 'elements/Row';
import { TimeSlider } from './TimeSlider';
import { Spirograph } from './Spirograph';
import { useLines } from './useLines';

export const GraphDisplay = (props) => {
  const {
    R,
    k,
    k2,
    h,
    p,
    delta,
    maxLoops,
    
    glow,
    lineThickness,
    onGlowChange,
    onThicknessChange,
  } = props;

  const [bind, { width, height }] = useMeasure();

  const [alphaPercent, setAlphaPercent] = useState(() => 1);
  
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
    alphaPercent
  });

  return (
    <div
      style={{
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        {...bind}
        style={{ width: '100%', height: width, maxHeight: 600 }}
      />
      <Spirograph
        style={{ position: 'absolute', top: 0, left: 0 }}
        axis
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

      <Row spacing={16} style={{ padding: '8px 16px' }} >
        <RowItem style={{ width: 140 }} >
          <NumberInput
            value={glow}
            minValue={0}
            step={0.1}
            maxValue={10}
            onSubmit={onGlowChange}
            label={'Glow'}
          />
        </RowItem>
        <RowItem style={{ width: 140 }} >
          <NumberInput
            value={lineThickness}
            minValue={0}
            step={0.1}
            maxValue={2}
            onSubmit={onThicknessChange}
            label={'Thickness'}
          />
        </RowItem>
      </Row>
      <div style={{ padding: '8px 16px' }} >
        <TimeSlider
          value={alphaPercent}
          onChange={setAlphaPercent}
        />
      </div>
    </div>
  );
};
