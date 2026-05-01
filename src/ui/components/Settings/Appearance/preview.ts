import type { FlatSettings, SystemInfo, Theme } from 'shared/types';

function colorize(text: string, color: string | undefined, weight: string | number | undefined) {
  return `<span style="font-weight:${weight};color:${color};">${text}</span>`;
}

function colorblock(color: string | undefined, fontSize: number) {
  return `<div style="width:${fontSize * 1.875}px;height:${fontSize * 1.5}px;background:${color};display:inline-block;line-height:1.5;"></div>`;
}

function renderCursor(char: string, color: string | undefined, blink = true) {
  const prop = char === '&nbsp;' ? 'background' : 'color';
  const animation = blink ? 'blink 1.1s step-start infinite' : 'none';
  return `<div class="cursor" style="${prop}:${color};animation:${animation};">${char}</div>`;
}

function slicedColors(
  theme: Partial<Theme>,
  fontSize: number | undefined,
  { start, end }: { start: number; end: number },
) {
  return Object.values(theme)
    .slice(start, end)
    .map(color => colorblock(color, fontSize ?? 16))
    .join('');
}

export function getPreviewText(
  theme: Partial<Theme>,
  { fontSize, fontWeight, fontWeightBold, cursorStyle, cursorBlink }: Partial<FlatSettings>,
  systemInfo: SystemInfo,
) {
  const c = (text: string, color: keyof Theme, fw?: string | number) =>
    colorize(text, theme[color], fw ?? fontWeight);

  const cursorChar = cursorStyle === 'block' ? '&nbsp;' : cursorStyle === 'underline' ? '__' : '|';

  return {
    cursor: renderCursor(cursorChar, theme.cursorColor, cursorBlink),
    prompt: `PS W:\\Users\\${systemInfo.username}> ${c('winfetch', 'brightYellow')}\n    `,
    windows: [
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      '',
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
      c('lllllllllll  lllllllllll', 'brightBlue', fontWeightBold),
    ].join('\n'),
    infos: [
      `  ${c(systemInfo.username, 'brightYellow', fontWeightBold)}@${c(systemInfo.hostname, 'brightYellow')}`,
      `  ${c('-'.repeat(systemInfo.root.length), 'foreground', fontWeightBold)}`,
      `  ${c('Uptime', 'brightYellow', fontWeightBold)}: ${systemInfo.uptime}`,
      `  ${c('Shell', 'brightYellow', fontWeightBold)}: Powershell v10.0.26200.8328`,
      `  ${c('Resolution', 'brightYellow', fontWeightBold)}: ${systemInfo.resolution}`,
      `  ${c('Terminal', 'brightYellow', fontWeightBold)}: Alpha`,
    ].join('\n'),
    colors: [
      `  ${slicedColors(theme, fontSize, { start: 1, end: 9 })}`,
      `  ${slicedColors(theme, fontSize, { start: 9, end: 17 })}`,
    ].join('\n'),
  };
}
