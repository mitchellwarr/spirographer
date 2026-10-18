import { useRef } from 'react';

export const useStateChange = (cb, deps) => {
  const prevDeps = useRef(deps);

  if (deps.some((dep, i) => dep !== prevDeps.current[i])) {
    prevDeps.current = deps;
    cb();
  }
};
