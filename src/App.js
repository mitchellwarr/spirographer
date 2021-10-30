import { useLocale } from '@react-aria/i18n';

import { useStateReducer } from 'hooks';
import { Row, RowItem } from 'elements/Row';

import { GraphDisplay } from './graph-display/GraphDisplay';
import { VariableSettings } from './variable-settings';
import { SliceDisplay } from './slice-display';
import { PRESETS } from './Presets';

export const App = () => {

  const [
    variables,
    setVariables
  ] = useStateReducer(
    () => ({
      R: 10,
      ...PRESETS[Math.floor(Math.random() * PRESETS.length)]
    })
  );

  const { locale, direction } = useLocale();
  return (
    <Row wrap spacing={32} lang={locale} dir={direction} >
      <RowItem style={{ width: 600, minWidth: 600 }} flexible column >
        <VariableSettings
          {...variables}
          onChange={setVariables}
        />
      </RowItem>

      <RowItem style={{ width: '50%' }} flexible >
        <GraphDisplay
          {...variables}
        />
      </RowItem>

      <RowItem style={{ width: '100%' }} inflexible >
        <SliceDisplay
          {...variables}
        />
      </RowItem>
    </Row>
  );
};
