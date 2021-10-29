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
    <Row
      spacing={32}
      wrap
    >
      <RowItem
        flexible
        style={{
          width: '100%'
        }}
      >
        <GraphDisplay
          {...variables}
        />
      </RowItem>

      <RowItem
        flexible
        style={{
          flexBasis: 0,
          minWidth: 750
        }}
      >
        <VariableSettings
          {...variables}
          onChange={setVariables}
        />
      </RowItem>

      <RowItem
        flexible
        style={{
          minWidth: 750
        }}
      >
        <SliceDisplay
          {...variables}
        />
      </RowItem>
    </Row>
  );
};
