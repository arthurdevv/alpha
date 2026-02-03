function changeOpacity(color: string | undefined, opacity: number): string {
  if (!color) return 'transparent';

  let value = color.replace('#', '');

  if (value.length === 3) {
    value = value
      .split('')
      .map(c => c + c)
      .join('');
  }

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${value.slice(0, 6)}${alpha}`;
}

function darkenHex(color: string | undefined, amount = 10): string {
  if (!color) return 'transparent';

  let value = color.replace('#', '');

  if (value.length === 3) {
    value = value
      .split('')
      .map(c => c + c)
      .join('');
  }

  const hasAlpha = value.length === 8;

  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const a = hasAlpha ? value.slice(6, 8) : null;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  l = Math.max(0, l - amount / 100);

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r2 = 0;
  let g2 = 0;
  let b2 = 0;

  if (h < 60) [r2, g2, b2] = [c, x, 0];
  else if (h < 120) [r2, g2, b2] = [x, c, 0];
  else if (h < 180) [r2, g2, b2] = [0, c, x];
  else if (h < 240) [r2, g2, b2] = [0, x, c];
  else if (h < 300) [r2, g2, b2] = [x, 0, c];
  else [r2, g2, b2] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}${a ?? ''}`;
}

export { changeOpacity, darkenHex };
