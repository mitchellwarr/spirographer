
export const xScaleFactory = ({ R, k, k2, h, p }) => {
  const r = R / k;
  const r2 = R / k2;
  return t => {

    let part1 = ((R + r) * Math.cos(t));
    let part2 = ((r + r2) * Math.cos(t + ((R*t)/r) - (R*t/(p*r))));
    let part3 = (h * Math.cos(t + (R*t/r) - (R*t/(p*r)) - (R*t/(p*r2))));

    return part1 + part2 + part3;
  };
};

export const yScaleFactory = ({ R, k, k2, h, p }) => {
  const r = R / k;
  const r2 = R / k2;
  return t => {

    let part1 = ((R + r) * Math.sin(t));
    let part2 = ((r + r2) * Math.sin(t + ((R*t)/r) - (R*t/(p*r))));
    let part3 = (h * Math.sin(t + (R*t/r) - (R*t/(p*r)) - (R*t/(p*r2))));

    return part1 + part2 + part3;
  };
};
