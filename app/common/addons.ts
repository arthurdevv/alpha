import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { LigaturesAddon } from '@xterm/addon-ligatures';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebglAddon } from '@xterm/addon-webgl';
import { CanvasAddon } from '@xterm/addon-canvas';
import { shell } from '@electron/remote';
import storage from 'app/utils/local-storage';
import { decorations } from 'lib/styles/theme';

const addons: Record<string, Addons> = {};

export function findResult(id: string, term: string, action: string) {
  const { SearchAddon } = addons[id];

  const controls = storage.parseItem('controls');

  SearchAddon[action](term, { decorations, ...controls });
}

export function clearResult(id: string) {
  const { SearchAddon } = addons[id];

  SearchAddon.clearDecorations();
}

export function onChangeResults(id: string, updater: Function) {
  const { SearchAddon } = addons[id];

  return SearchAddon.onDidChangeResults(({ resultIndex, resultCount }) =>
    updater([resultIndex + 1, resultCount]),
  );
}

export default class Addons {
  FitAddon = new FitAddon();

  SearchAddon = new SearchAddon();

  Unicode11Addon = new Unicode11Addon();

  WebLinksAddon: WebLinksAddon | undefined;

  LigaturesAddon: LigaturesAddon | undefined;

  RendererAddon: CanvasAddon | WebglAddon | undefined;

  constructor(id: string, options: Partial<ISettings>) {
    const { renderer, fontLigatures, linkHandlerKey } = options;

    this.WebLinksAddon = new WebLinksAddon((event, uri) => {
      const shouldHandleLink = !linkHandlerKey || event[`${linkHandlerKey}Key`];

      if (shouldHandleLink) shell.openExternal(uri);
    });

    if (renderer !== 'default') {
      this.RendererAddon = new (
        renderer === 'canvas' ? CanvasAddon : WebglAddon
      )();

      if (this.RendererAddon instanceof WebglAddon) {
        this.RendererAddon.onContextLoss(this.RendererAddon.dispose);
      }
    }

    if (fontLigatures) {
      this.LigaturesAddon = new LigaturesAddon();
    }

    addons[id] = this;
  }

  fit(): void {
    this.FitAddon.fit();
  }
}
