import { cx } from '@linaria/core';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import type { SystemInfo } from 'shared/types';
import Tooltip from 'ui/components/Tooltip';
import { useTheme } from 'ui/hooks/useTheme';
import { useAppStore } from 'ui/store/app/store';
import type { SectionProps } from 'ui/types';
import { abbreviateColorKey, changeOpacity, formatColorKey } from 'ui/utils/colors';

import { getPreviewText } from './preview';
import { Button, Color, Colors, Preview, Wrapper } from './styles';

export default function Appearance({ content }: SectionProps) {
  const settings = useAppStore(s => s.settings);

  const [theme, colors] = useTheme();
  const { t } = useTranslation();

  const [systemInfo, setShowSystemInfo] = useState<SystemInfo | null>(null);
  const [showColors, setShowColors] = useState<boolean>(false);

  const previewText = useMemo(
    () => systemInfo && getPreviewText(theme, settings, systemInfo),
    [theme, settings, systemInfo],
  );

  const backgroundColor = useMemo(() => {
    if (settings.preserveBackground) return '#00000000';

    return settings.acrylic ? changeOpacity(theme.background, 0.7) : theme.background;
  }, [settings.preserveBackground, settings.acrylic, theme.background]);

  useEffect(() => {
    ipc.system.info().then(setShowSystemInfo);
  }, []);

  return (
    <>
      {content}
      <Colors className={cx(showColors && 'visible')}>
        {colors.map(key => (
          <Tooltip key={key} label={formatColorKey(key)} keys={[theme[key]]} position="top">
            <Color style={{ background: theme[key] }}>{abbreviateColorKey(key)}</Color>
          </Tooltip>
        ))}
      </Colors>
      <Preview
        style={{
          backgroundColor,
          color: theme.foreground,
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          lineHeight: (settings.lineHeight ?? 1.0) + 0.3,
          '--selection-background': theme.selectionBackground,
        }}
      >
        <Button onClick={() => setShowColors(p => !p)}>
          {t(showColors ? 'Hide colors' : 'Show colors')}
        </Button>
        {previewText && (
          <Wrapper className="col">
            <Wrapper>
              <pre dangerouslySetInnerHTML={{ __html: previewText.prompt }} />
              <pre dangerouslySetInnerHTML={{ __html: previewText.cursor }} />
            </Wrapper>
            <Wrapper>
              <pre dangerouslySetInnerHTML={{ __html: previewText.windows }} />
              <Wrapper className="col">
                <pre dangerouslySetInnerHTML={{ __html: previewText.infos }} />
                <pre
                  dangerouslySetInnerHTML={{ __html: previewText.colors }}
                  style={{ marginTop: '0.5rem', lineHeight: 0 }}
                />
              </Wrapper>
            </Wrapper>
          </Wrapper>
        )}
      </Preview>
    </>
  );
}
