import { Slider } from 'variable-settings/Slider';

export const TimeSlider = ({ onChange, value, style }) => {
  return (
    <Slider
      min={0}
      max={1}
      step={'any'}
      value={value}
      style={style}
      onChange={onChange}
    >
      Time
    </Slider>
  );
};

TimeSlider.defaultProps = {
  style: {
    input: {
      width: 80
    }
  }
};
