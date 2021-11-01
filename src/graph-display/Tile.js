import { useCallback, useEffect, useRef, useState } from 'react';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useInView } from 'react-intersection-observer';

import { useLines } from './useLines';
import { Spirograph } from './Spirograph';
import './Tile.scss';

const Inner = ({
  R,
  k,
  k2,
  h,
  p,
  delta,
  maxLoops,
  glow,
  lineThickness,
  width,
  height,
  setSrc
}) => {

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

  const ref = useRef();
  useEffect(
    () => {
      if (lines.some(x => x.length == 0)) return;

      let svg = ref.current.querySelector('svg');
      let svgData = new XMLSerializer().serializeToString(svg);

      setSrc(`data:image/svg+xml;base64,${btoa(svgData)}`);
    },
    [lines]
  );

  return (
    <div
      ref={ref}
      style={{ display: 'flex', opacity: 0 }}
    >
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
    lineThickness,
    onClick
  } = props;
  
  const onPress = useCallback(
    () => onClick({
      k,
      k2,
      h,
      p,
      delta,
      maxLoops,
    }),
    [
      k,
      k2,
      h,
      p,
      delta,
      maxLoops,
      onClick
    ]
  );

  
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const { buttonProps, isPressed } = useButton(
    {
      elementType: 'div',
      onPress,
      'aria-label': 'preset for spirograph'
    },
    ref
  );

  const {
    isFocused,
    focusProps
  } = useFocusRing({ isTextInput: false });

  const { isHovered, hoverProps } = useHover({});

  const [src, setSrc] = useState();

  return (
    <div
      className={'spirograph-tile'}
      ref={ref}
      {...mergeProps(
        buttonProps,
        focusProps,
        hoverProps
      )}
      style={{
        width,
        height,
        opacity: 1,
        ...isFocused && ({ opacity: 0.6 }),
        ...isHovered && ({ opacity: 0.6 }),
        ...isPressed && ({ opacity: 0.3 })
      }}
    >
      {src ? (
        <img src={src} />
      ) : (
        inView && (
          <Inner
            R={R}
            k={k}
            k2={k2}
            h={h}
            p={p}
            delta={delta}
            maxLoops={maxLoops}
            glow={glow}
            lineThickness={lineThickness}
            width={width}
            height={height}
            setSrc={setSrc}
          />
        )
      )}
    </div>
  );
};
