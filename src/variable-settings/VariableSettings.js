import { useMemo } from 'react';
import { Slider } from 'elements/slider';
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
      onPChange: l => onChange({ p: 1 / l }),
      onKChange: r => onChange({ k: R / r }),
      onK2Change: r => onChange({ k2: R / r }),
      onDeltaChange: delta => onChange({ delta }),
      onMaxLoopsChange: maxLoops => onChange({ maxLoops }),
    }),
    [onChange, R]
  );

  return (
    <div className={'variable-settings'} >
      <Slider
        min={0}
        max={R * 5}
        step={1}
        value={h}
        onChange={onHChange}
        label={'Distance to drawing point'}
        labelWidth={150}
      />
      <Slider
        min={-5}
        max={10}
        step={0.001}
        value={1/p}
        onChange={onPChange}
        label={'Speed of second circle'}
        labelWidth={150}
      />
      <Slider
        min={0.01}
        max={R * 5}
        step={0.01}
        value={R / k}
        onChange={onKChange}
        label={'Radius of first circle'}
        labelWidth={150}
      />
      <Slider
        min={0.01}
        max={R * 5}
        step={0.01}
        value={R / k2}
        onChange={onK2Change}
        label={'Radius of second circle'}
        labelWidth={150}
      />
      <Slider
        min={0.001}
        max={0.2}
        step={0.001}
        value={delta}
        onChange={onDeltaChange}
        label={'Rendering ticks'}
        labelWidth={150}
      />
      <Slider
        min={1}
        max={20}
        step={1}
        value={maxLoops}
        onChange={onMaxLoopsChange}
        label={'Render loops'}
        labelWidth={150}
      />
    </div>
  );
};
