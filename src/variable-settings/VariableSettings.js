import { useMemo } from 'react';
import { Slider } from './Slider';
import './VariableSettings.scss';

export const VariableSettings = (props) => {
  const {
    R,
    h,
    p,
    k,
    k2,
    delta,
    maxLoops,
    onChange
  } = props;
  
  const {
    onHChange,
    onPChange,
    onKChange,
    onK2Change,
    onDeltaChange,
    onMaxLoopsChange
  } = useMemo(
    () => ({
      onHChange: h => onChange({ h }),
      onPChange: p => onChange({ p }),
      onKChange: k => onChange({ k }),
      onK2Change: k2 => onChange({ k2 }),
      onDeltaChange: delta => onChange({ delta }),
      onMaxLoopsChange: maxLoops => onChange({ maxLoops }),
    }),
    [onChange]
  );

  return (
    <div className={'variable-settings'} >
      <Slider
        min={0}
        max={R * 5}
        step={1}
        value={h}
        onChange={onHChange}
      >
        <div style={{ width: 150 }} >Distance to drawing point</div>
      </Slider>
      <Slider
        min={-5}
        max={10}
        step={0.002}
        value={p}
        onChange={onPChange}
      >
        <div style={{ width: 150 }} >Speed of circle rotation</div>
      </Slider>
      <Slider
        min={0.01}
        max={10}
        step={0.002}
        value={k}
        onChange={onKChange}
      >
        <div style={{ width: 150 }} >Radius of first circle</div>
      </Slider>
      <Slider
        min={0.01}
        max={10}
        step={0.002}
        value={k2}
        onChange={onK2Change}
      >
        <div style={{ width: 150 }} >Radius of second circle</div>
      </Slider>
      <Slider
        min={0.001}
        max={0.2}
        step={0.001}
        value={delta}
        onChange={onDeltaChange}
      >
        <div style={{ width: 150 }} >Rendering ticks</div>
      </Slider>
      <Slider
        min={1}
        max={20}
        step={1}
        value={maxLoops}
        onChange={onMaxLoopsChange}
      >
        <div style={{ width: 150 }} >Render loops</div>
      </Slider>
    </div>
  );
};
