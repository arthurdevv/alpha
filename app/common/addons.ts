import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { LigaturesAddon } from 'xterm-addon-ligatures';
import { WebglAddon } from 'xterm-addon-webgl';
import { CanvasAddon } from 'xterm-addon-canvas';
import { shell } from '@electron/remote';

export default {
  FitAddon: new FitAddon(),
  Unicode11Addon: new Unicode11Addon(),
  WebLinksAddon: new WebLinksAddon((_, uri) => shell.openExternal(uri)),
  options: {
    fontLigatures: new LigaturesAddon(),
    webgl: new WebglAddon(),
    canvas: new CanvasAddon(),
  },
} as const;
