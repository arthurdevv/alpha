import { Fragment, memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import storage from 'app/utils/local-storage';
import { abbreviateColorName } from 'app/utils/color-utils';

import { EyeDropperIcon, NoneIcon } from 'components/Icons';
import {
  Arrow,
  Color,
  Container,
  Content,
  CurrentColor,
  Grid,
  Key,
  Keys,
  Label,
} from './styles';
import ColorPicker from './Picker';

const schema = [
  { name: 'None', value: NoneIcon, signal: 'none' },
  { name: 'Red', value: '#ff3c3c' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Cyan', value: '#1abc9c' },
  { name: 'Blue', value: '#3498db' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Pink', value: '#e91e63' },
  { name: 'Eye Dropper', value: EyeDropperIcon, signal: 'eyedropper' },
];

const Colors: React.FC<ModalProps> = ({ store, isVisible, handleModal }) => {
  const tabId = global.id || store.current.origin || '';

  const position = global.menu || { top: 0, left: 0 };

  const [currentColor, setCurrentColor] = useState<string>(() => {
    const stored = storage.parseItem('tab-colors')[tabId];

    return stored || '#00000000';
  });

  const [isPickingColor, setIsPickingColor] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (color: string) => {
    setCurrentColor(color);

    const tabColors = storage.parseItem('tab-colors');

    if (color) {
      tabColors[tabId] = color;
    } else {
      delete tabColors[tabId];
    }

    storage.updateItem('tab-colors', tabColors);

    window.dispatchEvent(new CustomEvent('tab:color'));
  };

  const handleSignal = ({ currentTarget }, signal?: string) => {
    if (signal === 'eyedropper') {
      currentTarget.classList.toggle('active');

      return setIsPickingColor(p => !p);
    }

    handleSelect('#00000000');
  };

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (ref.current && !ref.current.contains(target as Node)) handleModal();
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  return (
    <Container
      ref={ref}
      $isVisible={isVisible}
      style={{ maxWidth: '9.875rem', width: '100%', ...position }}
    >
      <Content>
        <Grid>
          {schema.map(({ name, value, signal }, index) => (
            <Fragment key={name}>
              {typeof value === 'function' ? (
                <Color
                  style={{
                    border: 'none',
                    top: signal === 'eyedropper' ? '0.125rem' : 0,
                  }}
                  onClick={e => handleSignal(e, signal)}
                >
                  {value()}
                  <ColorLabel name={name} />
                </Color>
              ) : (
                <Color
                  $text
                  style={{ backgroundColor: value }}
                  onClick={() => handleSelect(value)}
                >
                  {abbreviateColorName(name)}
                  <ColorLabel name={name} value={value} />
                </Color>
              )}
            </Fragment>
          ))}
        </Grid>
        <CurrentColor
          $isPickingColor={isPickingColor}
          $none={currentColor === '#00000000'}
          style={{ backgroundColor: currentColor }}
        >
          {currentColor}
        </CurrentColor>
        <ColorPicker
          isPickingColor={isPickingColor}
          currentColor={currentColor}
          handleSelect={handleSelect}
        />
      </Content>
    </Container>
  );
};

const ColorLabel: React.FC<{ name: string; value?: string }> = ({
  name,
  value,
}) => {
  const { t } = useTranslation();

  return (
    <Label
      $keys={value ? [value] : []}
      style={{
        position: 'absolute',
        zIndex: 1,
        fontWeight: 400,
        top: '2rem',
        left: '50%',
        transform: 'translateX(-52%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Arrow style={{ top: '-0.75rem' }} />
      <span>{t(name)}</span>
      {value && (
        <Keys>
          <Key>{value}</Key>
        </Keys>
      )}
    </Label>
  );
};

export default memo(Colors);
