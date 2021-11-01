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
      onHChange: h => onChange({ h: h / R }),
      onPChange: l => onChange({ p: 1 / l }),
      onKChange: r => onChange({ k: R / r }),
      onK2Change: r => onChange({ k2: R / r }),
      onDeltaChange: delta => onChange({ delta }),
      onMaxLoopsChange: maxLoops => onChange({ maxLoops }),
    }),
    [onChange, R]
  );

  return (
    <>
      <div className={'variable-settings'} >
        <div className={'variable-settings__title'} >
          Circle 1
        </div>
        <div className={'variable-settings__list'} >
          <div className={'variable-settings__label'} >
            Radius: <span className={'variable-settings__label-number'}>{R}</span>
          </div>
        </div>

        <div className={'variable-settings__divider'} />
        
        <div className={'variable-settings__title'} >
          Circle 2
        </div>
        <div className={'variable-settings__list'} >
          <Slider
            min={0.01}
            max={R * 5}
            step={0.01}
            value={R / k}
            onChange={onKChange}
            label={'Radius'}
          />
          <div className={'variable-settings__label'} >
            Speed of rotation: <span className={'variable-settings__label-number'}>1</span>
          </div>
        </div>

        <div className={'variable-settings__divider'} />

        <div className={'variable-settings__title'} >
          Circle 3
        </div>
        <div className={'variable-settings__list'} >
          <Slider
            min={0.01}
            max={R * 5}
            step={0.01}
            value={R / k2}
            onChange={onK2Change}
            label={'Radius'}
          />
          <Slider
            min={-5}
            max={10}
            step={0.001}
            value={1/p}
            onChange={onPChange}
            label={'Speed of rotation'}
          />
          <Slider
            min={0}
            max={R * 5}
            step={1}
            value={h * R}
            onChange={onHChange}
            label={'Distance to drawing point'}
          />
        </div>

        <div className={'variable-settings__divider'} />

        <div className={'variable-settings__title'} >
          Rendering settings
        </div>
        <div className={'variable-settings__list'} >
          <Slider
            min={0.001}
            max={0.2}
            step={0.001}
            value={delta}
            onChange={onDeltaChange}
            label={'Radian tick rate'}
          />
          <Slider
            min={1}
            max={20}
            step={1}
            value={maxLoops}
            onChange={onMaxLoopsChange}
            label={'Max loops'}
          />
        </div>
      </div>
    </>
  );
};
