import { Line } from '@visx/shape';
import { Text } from '@visx/text';

export const Axis = ({ color, R, k, k2, h, width, height, viewZoomRatio }) => {
  const r1 = R;
  const r2 = (R / k) * 2;
  const r3 = (R / k2) * 2;
  const rh = R * h;
  const drawingPoint = rh - (R / k2);
  return (
    <g data-component={'axis'} >
      <g>
        <Text
          fontFamily={'calibri'}
          fontSize={12 * viewZoomRatio}
          verticalAnchor={'middle'}
          textAnchor={'end'}
          width={200}
          y={-r1}
          fill={color}
        >
          R1 -
        </Text>
        <Text
          fontFamily={'calibri'}
          fontSize={12 * viewZoomRatio}
          verticalAnchor={'middle'}
          textAnchor={'end'}
          width={200}
          y={-r1 -r2}
          fill={color}
        >
          R2 -
        </Text>
        <Text
          fontFamily={'calibri'}
          fontSize={12 * viewZoomRatio}
          verticalAnchor={'middle'}
          textAnchor={'end'}
          width={200}
          y={-r1 -r2 -r3}
          fill={color}
        >
          R3 -
        </Text>
        <Text
          fontFamily={'calibri'}
          fontSize={12 * viewZoomRatio}
          verticalAnchor={'start'}
          textAnchor={'end'}
          width={200}
          y={-r1 -r2 -r3 -drawingPoint}
          fill={color}
        >
          Drawing point -
        </Text>
      </g>
      <Line
        from={{ x: -(width/2) * viewZoomRatio }}
        to={{ x: width/2 * viewZoomRatio }}
        stroke={color}
        strokeWidth={1.3 * viewZoomRatio}
      />
      <Line
        from={{ y: -(height/2) * viewZoomRatio }}
        to={{ y: height/2 * viewZoomRatio }}
        stroke={color}
        strokeWidth={1.3 * viewZoomRatio}
      />
    </g>
  );
};
