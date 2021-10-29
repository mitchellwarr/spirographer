import { useStateReducer } from 'hooks';
import { GraphDisplay } from './GraphDisplay';
import { VariableSettings } from './variable-settings';
import { SliceDisplay } from './slice-display';
import { Row, RowItem } from './elements/Row';

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
      delta: 0.04,
      maxLoops: 2
    })
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
