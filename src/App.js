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
      delta: 0.05,
    })
  );

  return (
    <Row
      spacing={24}
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
          minWidth: 350
        }}
      >
        <VariableSettings
          {...variables}
          onChange={setVariables}
        />
      </RowItem>

      <RowItem flexible >
        <SliceDisplay
          {...variables}
        />
      </RowItem>
    </Row>
  );
};
