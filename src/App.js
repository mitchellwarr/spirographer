import { useStateReducer } from 'hooks';
import { GraphDisplay } from './GraphDisplay';
import { VariableSettings } from './variable-settings';
import { SliceDisplay } from './slice-display';

export const App = () => {
  
  const [
    variables,
    setVariables
  ] = useStateReducer(
    () => ({
      R: 40,
      k: 2.5,
      k2: 2.01,
      h: 40,
      p: 0.5,
      delta: 0.05,
    })
  );

  return (
    <div style={{ padding: 24 }} >
      <div style={{ marginBottom: 24 }} >
        <GraphDisplay
          {...variables}
        />
      </div>

      <div style={{ marginBottom: 24 }} >
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
