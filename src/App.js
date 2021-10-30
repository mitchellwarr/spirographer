import { useStateReducer } from 'hooks';
import { GraphDisplay } from './graph-display/GraphDisplay';
import { VariableSettings } from './variable-settings';
import { SliceDisplay } from './slice-display';

const PRESETS = [
  {
    R: 40,
    h: 40,
    p: 0.5,
    k: 2.5,
    k2: 2.01,
    delta: 0.04,
    maxLoops: 2
  },
  {
    R: 40,
    h: 40,
    p: 0.5,
    k: 0.996,
    k2: 2.01,
    delta: 0.04,
    maxLoops: 5
  },
];

export const App = () => {

  const [
    variables,
    setVariables
  ] = useStateReducer(
    () => PRESETS[Math.floor(Math.random() * 2)]
  );

  return (
    <div>
      <div style={{ marginBottom: 32 }} >
        <GraphDisplay
          {...variables}
        />
      </div>

      <div style={{ marginBottom: 32 }} >
        <VariableSettings
          {...variables}
          onChange={setVariables}
        />
      </div>

      <div>
        <SliceDisplay
          {...variables}
        />
      </div>
    </div>
  );
};
