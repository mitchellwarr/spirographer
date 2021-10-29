import { useCallback, useEffect, useRef, useState } from 'react';
import { useTextField } from '@react-aria/textfield';
import './Slider.scss';

const InputBox = ({
  className,
  value: propsValue,
  style,
  onSubmit
}) => {

  const [value, setValue] = useState(() => propsValue);
  
  useEffect(
    () => setValue(propsValue),
    [propsValue]
  );
  
  const onKeyUp = useCallback(
    ({ key }) => key == 'Enter' && onSubmit(value),
    [onSubmit, value]
  );

  const onBlur = useCallback(
    () => onSubmit(value),
    [onSubmit, value]
  );

  const ref = useRef();
  const {
    inputProps
  } = useTextField(
    {
      value,
      onBlur,
      onKeyUp,
      onChange: setValue
    },
    ref
  );

  return (
    <input
      className={className}
      type={'text'}
      style={style}
      {...inputProps}
    />
  );
};

export const Slider = ({
  style = {},
  value,
  onChange: propsOnChange,
  children,
  ...rest
}) => {
  const onChange = useCallback(
    str => propsOnChange(parseFloat(str)),
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
        onChange={({ target: { value } }) => onChange(value)}
        style={style.slider}
        {...rest}
      />
      <InputBox
        className={'slider__input'}
        value={value || 0}
        onSubmit={onChange}
        style={style.input}
      />
    </div>
  );
};

Slider.defaultProps = {
  onChange: () => {}
};
