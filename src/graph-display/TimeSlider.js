import { Slider } from 'elements/slider';

export const TimeSlider = ({ onChange, value, style }) => {
  return (
    <Slider
      min={0}
      max={1}
      step={'any'}
      value={value}
      style={style}
      onChange={onChange}
      label={'Time'}
    />
  );
};

TimeSlider.defaultProps = {
  style: {
    input: {
      width: 80
    }
  }
};
