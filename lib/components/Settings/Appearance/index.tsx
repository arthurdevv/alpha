import { Fragment } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { loadTheme } from 'app/common/themes';
import { useSettings } from 'app/settings/listeners';
import { theme as globalTheme } from 'lib/styles/theme';
import systemInfo, { renderSystemInfo } from 'app/utils/system-info';
import { changeOpacity } from 'app/utils/color-utils';

import { Arrow, Label } from 'components/Modal/Search/styles';
import { Key, Keys } from 'components/Modal/ContextMenu/Terminal/styles';
import {
  AnsiColor,
  Colors,
  Cursor,
  Flex,
  Preview,
  Theme,
  Toggle,
} from './styles';
import { Separator } from '../styles';

const exceptionKeys = {
  foreground: 'FG',
  background: 'BG',
  cursor: 'CU',
  selectionBackground: 'SB',
};

const fixedKeys = ['foreground', 'background', 'cursor', 'selectionBackground'];

const Appearance: React.FC<SectionProps> = ({ options, t }) => {
  const [settings] = useSettings();

  const [theme, setTheme] = useState<ITheme>({});

  const [colorsKey, setColorsKey] = useState<string[]>([]);

  const [visibleColors, setVisibleColors] = useState<boolean>(false);

  const abbreviateColorKey = (key: string): string => {
    if (exceptionKeys[key]) return exceptionKeys[key];

    const parts: string[] = key.match(/[A-Z]?[a-z]+/g) || [];

    return parts.map(word => word[0].toUpperCase()).join('');
  };

  const normalizeColorKey = (key: string): string => {
    const capitalize = (word: string) =>
      word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();

    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(/\s+/)
      .map((word, i) => (i === 0 ? capitalize(word) : word.toLocaleLowerCase()))
      .join(' ');
  };

  useEffect(() => {
    const theme = loadTheme(settings.theme);

    setTheme(theme);

    const ansiKeys = Object.keys(theme).filter(
      key => !fixedKeys.includes(key) && key !== 'background',
    );

    setColorsKey([...fixedKeys, ...ansiKeys]);
  }, [settings.theme]);

  const {
    preserveBackground,
    acrylic,
    fontSize,
    fontWeight,
    fontFamily,
    fontWeightBold,
    lineHeight,
  } = settings;

  const previewText = renderSystemInfo(theme.brightYellow, fontWeightBold);

  const backgroundColor = (() => {
    if (preserveBackground) {
      return acrylic ? globalTheme.transparent : globalTheme.codeTranslucent;
    }

    return acrylic ? changeOpacity(theme.background, 0.7) : theme.background;
  })();

  return (
    <Fragment>
      {options}
      <Theme>
        <Separator />
        <Colors $visible={visibleColors}>
          {colorsKey.map((key, index) => (
            <AnsiColor style={{ background: theme[key] }} key={index}>
              {abbreviateColorKey(key)}
              <Label
                style={{
                  position: 'absolute',
                  padding: '0.25rem 0.25rem 0.25rem 0.5rem',
                  top: '1.8125rem',
                  fontWeight: 400,
                }}
              >
                <Arrow style={{ top: '-12px' }} />
                <span>{t(normalizeColorKey(key))}</span>
                <Keys>
                  <Key>{theme[key]}</Key>
                </Keys>
              </Label>
            </AnsiColor>
          ))}
        </Colors>
        <Preview
          style={{
            fontSize,
            fontWeight,
            fontFamily,
            lineHeight: lineHeight + 0.3,
            backgroundColor,
          }}
        >
          <Toggle onClick={() => setVisibleColors(!visibleColors)}>
            {t(visibleColors ? 'Hide colors' : 'Show colors')}
          </Toggle>
          <Flex $column>
            <Flex>
              <span style={{ color: theme.foreground }}>
                PS C:\Users\{systemInfo.username}
                {'>'}&nbsp;
              </span>
              <span style={{ color: theme.brightYellow }}>winfetch</span>
              <Cursor
                style={{ background: theme.cursor, height: fontSize + 2 }}
              >
                &nbsp;
              </Cursor>
            </Flex>
            <Flex style={{ alignItems: 'unset' }}>
              <pre
                style={{
                  fontFamily,
                  fontWeight: fontWeightBold,
                  color: theme.brightBlue,
                }}
                dangerouslySetInnerHTML={{ __html: previewText.windows }}
              />
              <Flex $column style={{ paddingLeft: '1.5rem' }}>
                <pre
                  style={{ fontFamily, color: theme.foreground }}
                  dangerouslySetInnerHTML={{ __html: previewText.info }}
                />
                <Flex
                  $column
                  style={{ marginTop: 'auto', marginBottom: '.375rem' }}
                >
                  <Flex>
                    {Object.values(theme)
                      .slice(0, 8)
                      .map((background, index) => (
                        <span
                          key={index}
                          style={{
                            background,
                            width: fontSize * 1.875,
                            height: fontSize * 1.5,
                          }}
                        />
                      ))}
                  </Flex>
                  <Flex>
                    {Object.values(theme)
                      .slice(8, 16)
                      .map((background, index) => (
                        <span
                          key={index}
                          style={{
                            background,
                            width: fontSize * 1.875,
                            height: fontSize * 1.5,
                          }}
                        />
                      ))}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <style>
            {`
              ::selection {
                background: ${theme.selectionBackground};
                color: unset;
              }
            `}
          </style>
        </Preview>
      </Theme>
    </Fragment>
  );
};

export default memo(Appearance);
