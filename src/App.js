import { useState } from 'react';
import { useLocale } from '@react-aria/i18n';

import { useStateReducer } from 'hooks';
import { Row, RowItem } from 'elements/Row';

import { GraphDisplay, Tile } from './graph-display';
import { VariableSettings } from './variable-settings';
import { SliceDisplay } from './slice-display';
import { PRESETS } from './Presets';

export const App = () => {

  const [
    variables,
    setVariables
  ] = useStateReducer(
    () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      return {
        R: 10,
        ...PRESETS[Math.floor(Math.random() * PRESETS.length)],
        ...params.h && ({ h: parseFloat(params.h) }),
        ...params.k && ({ k: parseFloat(params.k) }),
        ...params.k2 && ({ k2: parseFloat(params.k2) }),
        ...params.p && ({ p: parseFloat(params.p) }),
        ...params.delta && ({ delta: parseFloat(params.delta) }),
        ...params.loops && ({ maxLoops: parseFloat(params.loops) }),
      };
    }
  );

  const {
    R
  } = variables;

  const [glow, setGlow] = useState(() => 1.5);
  const [lineThickness, setLineThickness] = useState(() => 0.2);

  const { locale, direction } = useLocale();
  return (
    <Row wrap spacing={32} lang={locale} dir={direction} >
      <RowItem style={{ width: '50%' }} flexible >
        <GraphDisplay
          {...variables}
          glow={glow}
          lineThickness={lineThickness}
          onGlowChange={setGlow}
          onThicknessChange={setLineThickness}
        />
      </RowItem>

      <RowItem style={{ width: 600, minWidth: 'min(calc(100% - 32px), 600px)' }} flexible column >
        <VariableSettings
          {...variables}
          onChange={setVariables}
        />
      </RowItem>

      <RowItem style={{ width: '100%' }} flexible >
        <SliceDisplay
          {...variables}
          glow={glow}
          lineThickness={lineThickness}
        />
      </RowItem>

      <RowItem
        style={{
          width: '100%',
          paddingTop: 48,
          justifyContent: 'center'
        }}
        flexible
      >
        <Row
          style={{ maxWidth: 1600 }}
          spacing={64}
          wrap
          justifyContent={'center'}
        >
          {PRESETS.map(
            (data, i) => (
              <RowItem key={i} inflexible >
                <Tile
                  R={R}
                  {...data}
                  width={300}
                  height={300}
                  glow={glow}
                  lineThickness={lineThickness}
                  onClick={setVariables}
                />
              </RowItem>
            )
          )}
        </Row>
      </RowItem>
    </Row>
  );
};
