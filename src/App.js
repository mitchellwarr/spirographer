import { useStateReducer } from 'hooks';
import { GraphDisplay } from './graph-display/GraphDisplay';
import { VariableSettings } from './variable-settings';
import { SliceDisplay } from './slice-display';
import { useLocale } from '@react-aria/i18n';

const PRESETS = [
  {
    h: 40,
    p: 0.5,
    k: 2.5,
    k2: 2.01,
    delta: 0.04,
    maxLoops: 2
  },
  {
    h: 40,
    p: 0.5,
    k: 0.996,
    k2: 2.01,
    delta: 0.04,
    maxLoops: 5
  },
  {
    h: 0,
    p: 1.934,
    k: 2.394,
    k2: 1.584,
    delta: 0.04,
    maxLoops: 1
  },
  {
    h: 100,
    p: 0.5,
    k: 0.804,
    k2: 4.608,
    delta: 0.04,
    maxLoops: 3
  },
  {
    h: 52,
    p: 0.31702,
    k: 0.476,
    k2: 1.894,
    delta: 0.023,
    maxLoops: 3
  },
  {
    h: 13,
    p: 0.31702,
    k: 0.476,
    k2: 1.894,
    delta: 0.023,
    maxLoops: 6
  },
  {
    h: 60,
    p: 0.31565656565656564,
    k: 0.4594004823705065,
    k2: 1.8939393939393938,
    delta: 0.023,
    maxLoops: 5
  },
];

export const App = () => {

  const [
    variables,
    setVariables
  ] = useStateReducer(
    () => ({
      R: 40,
      ...PRESETS[Math.floor(Math.random() * PRESETS.length)]
    })
  );

  const { locale, direction } = useLocale();
  return (
    <div lang={locale} dir={direction} >
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
