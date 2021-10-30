import { Line } from '@visx/shape';
import { Text } from '@visx/text';

export const Axis = ({ R, k, k2, h, width, height, viewZoomRatio }) => {
  const r1 = R;
  const r2 = (R / k) * 2;
  const r3 = (R / k2) * 2;
  const drawingPoint = h - (R / k2);
  return (
    <g>
      <g>
        <Text
          fontFamily={'calibri'}
          fontSize={12 * viewZoomRatio}
          verticalAnchor={'middle'}
          textAnchor={'end'}
          width={200}
          y={-r1}
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
        >
          Drawing point -
        </Text>
      </g>
      <Line
        from={{ x: -(width/2) * viewZoomRatio }}
        to={{ x: width/2 * viewZoomRatio }}
        stroke={'#3a3a3a'}
        strokeWidth={1.3 * viewZoomRatio}
      />
      <Line
        from={{ y: -(height/2) * viewZoomRatio }}
        to={{ y: height/2 * viewZoomRatio }}
        stroke={'#3a3a3a'}
        strokeWidth={1.3 * viewZoomRatio}
      />
    </g>
  );
};
