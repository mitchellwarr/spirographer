export const K_MIN = 0.01;
export const K_MAX = R => R * 5;
export const K2_MIN = 0.01;
export const K2_MAX = R => R * 5;
export const P_MIN = -5;
export const P_MAX = 10;
export const P_RANGE = Math.abs(P_MIN) + P_MAX;
export const H_MIN = 0;
export const H_MAX = R => R * 5;

export const randomH = R => Math.random() * (H_MAX(R) - H_MIN);
export const randomP = () => (Math.random() * P_RANGE) - Math.abs(P_MIN);
export const randomK = R => Math.random() * (K_MAX(R) - K_MIN);
export const randomK2 = R => Math.random() * (K2_MAX(R) - K2_MIN);
