import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { LigaturesAddon } from '@xterm/addon-ligatures';
import { WebglAddon } from '@xterm/addon-webgl';
import { CanvasAddon } from '@xterm/addon-canvas';
import { shell } from '@electron/remote';
import { decorations } from 'lib/styles/theme';
import storage from 'app/utils/local-storage';

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

export function findResult(method: string, result: string) {
  const { SearchAddon } = addons;

  const controls = storage.parseItem('controls');

  SearchAddon[method](result, { decorations, ...controls });
}

export function clearResult() {
  const { SearchAddon } = addons;

  SearchAddon.clearDecorations();
}

export const onChangeResult = (
  stateUpdater: React.SetStateAction<number[]>,
) => {
  const { SearchAddon } = addons;

  return SearchAddon.onDidChangeResults(({ resultIndex, resultCount }) =>
    stateUpdater([resultIndex + 1, resultCount]),
  );
};

export default addons;
