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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function rgbaToHex(r: number, g: number, b: number, a: number) {
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  const aa = to2(Math.round(clamp(a, 0, 1) * 255));

  return `#${to2(r)}${to2(g)}${to2(b)}${aa === 'ff' ? '' : aa}`;
}

function hexToHsv(hex: string) {
  const normalized = hex.replace('#', '').trim();

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const a =
    normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : 1;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: Math.round(a * 100),
  };
}

function hsvToRgba(h: number, s: number, v: number, a: number) {
  const hh = ((h % 360) + 360) % 360;
  const ss = clamp(s, 0, 100) / 100;
  const vv = clamp(v, 0, 100) / 100;
  const aa = clamp(a, 0, 100) / 100;

  const c = vv * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = vv - c;

  let rp = 0,
    gp = 0,
    bp = 0;
  if (hh < 60) [rp, gp, bp] = [c, x, 0];
  else if (hh < 120) [rp, gp, bp] = [x, c, 0];
  else if (hh < 180) [rp, gp, bp] = [0, c, x];
  else if (hh < 240) [rp, gp, bp] = [0, x, c];
  else if (hh < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
    a: aa,
  };
}

function hsvToHex(c: Pick<IColor, 'hue' | 'saturation' | 'value' | 'alpha'>) {
  const rgba = hsvToRgba(c.hue, c.saturation, c.value, c.alpha);

  return rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);
}

function abbreviateColorName(name: string): string {
  const parts: string[] = name.match(/[A-Z]?[a-z]+/g) || [];

  return parts.map(word => word[0].toUpperCase()).join('');
}

const hsv = { toHex: hsvToHex, toRgba: hsvToRgba, fromHex: hexToHsv };

export { changeOpacity, darkenHex, clamp, hsv, abbreviateColorName };
