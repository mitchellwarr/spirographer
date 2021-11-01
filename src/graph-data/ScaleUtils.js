export const scalePlotterFactory = ({ R, k, k2, h, p }) => {
  const r1 = R;
  const r2 = R / k;
  const r3 = R / k2;
  const rh = h * R;

  const r1_2 = r1 + r2;
  const r2_3 = r2 + r3;

  const betaCoefficients = r1 * ((1/r1) + (1/r2) - (1/(p*r2)));
  const thetaCoefficients = r1 * ((1/r1) + (1/r2) - (1/(p*r2)) - (1/(p*r3)));

  return alpha => {
    const beta = alpha * betaCoefficients;
    const theta = alpha * thetaCoefficients;
    
    const x = (r1_2 * Math.cos(alpha)) + (r2_3 * Math.cos(beta)) + (rh * Math.cos(theta));
    const y = (r1_2 * Math.sin(alpha)) + (r2_3 * Math.sin(beta)) + (rh * Math.sin(theta));

    return [x, y];
  };
};

export const scaleFactory = ({ R, k, k2, h, p }) => {
  const r1 = R;
  const r2 = R / k;
  const r3 = R / k2;
  const rh = h * R;
  
  const betaCoefficients = r1 * ((1/r1) + (1/r2) - (1/(p*r2)));
  const thetaCoefficients = r1 * ((1/r1) + (1/r2) - (1/(p*r2)) - (1/(p*r3)));

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
      x: circle2.x + ((r2 + r3) * Math.cos(alpha * betaCoefficients)),
      y: circle2.y + ((r2 + r3) * Math.sin(alpha * betaCoefficients)),
    };
  
    const drawingPoint = {
      x: circle3.x + (rh * Math.cos(alpha * thetaCoefficients)),
      y: circle3.y + (rh * Math.sin(alpha * thetaCoefficients)),
    };

    return {
      r1,
      r2,
      r3,
      rh,
      beta,
      theta,
      circle1,
      circle2,
      circle3,
      drawingPoint,
      betaCoefficients,
      thetaCoefficients,
      ...drawingPoint
    };
  };
};
