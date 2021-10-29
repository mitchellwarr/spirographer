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
    onChange
  } = props;
  
  const {
    onHChange,
    onPChange,
    onKChange,
    onK2Change,
    onDeltaChange,
  } = useMemo(
    () => ({
      onHChange: h => onChange({ h }),
      onPChange: p => onChange({ p }),
      onKChange: k => onChange({ k }),
      onK2Change: k2 => onChange({ k2 }),
      onDeltaChange: delta => onChange({ delta }),
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
        <div style={{ width: 50 }} >h</div>
      </Slider>
      <Slider
        min={-5}
        max={10}
        step={0.01}
        value={p}
        onChange={onPChange}
      >
        <div style={{ width: 50 }} >p</div>
      </Slider>
      <Slider
        min={0.01}
        max={10}
        step={0.01}
        value={k}
        onChange={onKChange}
      >
        <div style={{ width: 50 }} >k</div>
      </Slider>
      <Slider
        min={0.01}
        max={10}
        step={0.01}
        value={k2}
        onChange={onK2Change}
      >
        <div style={{ width: 50 }} >k2</div>
      </Slider>
      <Slider
        min={0.001}
        max={0.2}
        step={0.001}
        value={delta}
        onChange={onDeltaChange}
      >
        <div style={{ width: 50 }} >delta</div>
      </Slider>
    </div>
  );
};
