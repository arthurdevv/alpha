import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { LigaturesAddon } from 'xterm-addon-ligatures';
import { WebglAddon } from 'xterm-addon-webgl';
import { CanvasAddon } from 'xterm-addon-canvas';
import { shell } from '@electron/remote';
import { decorations } from 'lib/styles/theme';

const addons = {
  FitAddon: new FitAddon(),
  SearchAddon: new SearchAddon(),
  Unicode11Addon: new Unicode11Addon(),
  WebLinksAddon: new WebLinksAddon((_, uri) => shell.openExternal(uri)),
  options: {
    fontLigatures: new LigaturesAddon(),
    webgl: new WebglAddon(),
    canvas: new CanvasAddon(),
  },
} as const;

export function findResult(
  action: 'next' | 'previous',
  term: string,
  controls: ISearchControls,
) {
  const { SearchAddon } = addons;

  if (action === 'next') {
    SearchAddon.findNext(term, { decorations, ...controls });
  } else {
    SearchAddon.findPrevious(term, { decorations, ...controls });
  }
}

export function clearResult() {
  const { SearchAddon } = addons;

  SearchAddon.clearDecorations();
}

export default addons;
