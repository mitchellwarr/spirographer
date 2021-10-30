export const scalePlotterFactory =({ R, k, k2, h, p }) => {
  const r1 = R;
  const r2 = R / k;
  const r3 = R / k2;

  const r1_2 = r1 + r2;
  const r2_3 = r2 + r3;

  const betaR = r1 / r2;
  const thetaR = r1 / r3;

  return alpha => {
    const beta = betaR * alpha;
    const theta = thetaR * alpha;
  
  
    const secondAngle = alpha + beta - (beta/p);
    const thirdAngle = alpha + beta - (beta/p) - (theta/p);
    
    const x = (r1_2 * Math.cos(alpha)) + (r2_3 * Math.cos(secondAngle)) + (h * Math.cos(thirdAngle));
    const y = (r1_2 * Math.sin(alpha)) + (r2_3 * Math.sin(secondAngle)) + (h * Math.sin(thirdAngle));

    return [x, y];
  };
};

export const scaleFactory = ({ R, k, k2, h, p }) => {
  const r1 = R;
  const r2 = R / k;
  const r3 = R / k2;

  return alpha => {

    const beta = (r1 / r2) * alpha;
    const theta = (r1 / r3) * alpha;
  
    const circle1 = {
      x: 0,
      y: 0,
    };
  
    const circle2 = {
      x: circle1.x + ((r1 + r2) * Math.cos(alpha)),
      y: circle1.y + ((r1 + r2) * Math.sin(alpha)),
    };
  
    const circle3 = {
      x: circle2.x + ((r2 + r3) * Math.cos(alpha + beta - (beta/p))),
      y: circle2.y + ((r2 + r3) * Math.sin(alpha + beta - (beta/p))),
    };
  
    const drawingPoint = {
      x: circle3.x + (h * Math.cos(alpha + beta - (beta/p) - (theta/p))),
      y: circle3.y + (h * Math.sin(alpha + beta - (beta/p) - (theta/p))),
    };

    return {
      r1,
      r2,
      r3,
      beta,
      theta,
      circle1,
      circle2,
      circle3,
      drawingPoint,
      ...drawingPoint
    };
  };
};
