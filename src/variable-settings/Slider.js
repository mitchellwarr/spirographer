import { useCallback } from 'react';
import './Slider.scss';

export const Slider = ({
  style = {},
  value,
  onChange: propsOnChange,
  children,
  ...rest
}) => {

  const onChange = useCallback(
    ({ target: { value } }) => propsOnChange(parseFloat(value)),
    [propsOnChange]
  );
  
  return (
    <div
      className={'slider'}
      style={style}
    >
      <div className={'slider__label'} >
        {children}
      </div>
      <input
        className={'slider__slider'}
        type={'range'}
        value={value}
        onChange={onChange}
        style={style.slider}
        {...rest}
      />
      <input
        className={'slider__input'}
        type={'text'}
        value={value}
        onChange={onChange}
        style={style.input}
      />
    </div>
  );
};

Slider.defaultProps = {
  onChange: () => {}
};
