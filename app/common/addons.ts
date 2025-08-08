import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { LigaturesAddon } from '@xterm/addon-ligatures';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { ImageAddon } from '@xterm/addon-image';
import { WebglAddon } from '@xterm/addon-webgl';
import { CanvasAddon } from '@xterm/addon-canvas';
import { shell } from '@electron/remote';
import storage from 'app/utils/local-storage';
import { decorations } from 'lib/styles/theme';

const addons: Record<string, Addons> = {};

function findResult(id: string, term: string, action: string) {
  const { SearchAddon } = addons[id];

  const controls = storage.parseItem('controls');

  SearchAddon[action](term, { decorations, ...controls });
}

function clearResult(id: string) {
  const { SearchAddon } = addons[id];

  SearchAddon.clearDecorations();
}

function onChangeResults(id: string, updater: Function) {
  const { SearchAddon } = addons[id];

  return SearchAddon.onDidChangeResults(({ resultIndex, resultCount }) =>
    updater([resultIndex + 1, resultCount]),
  );
}

export default class Addons {
  FitAddon = new FitAddon();

  SearchAddon = new SearchAddon();

  ImageAddon = new ImageAddon();

  Unicode11Addon = new Unicode11Addon();

  WebLinksAddon: WebLinksAddon | undefined;

  LigaturesAddon: LigaturesAddon | undefined;

  RendererAddon: CanvasAddon | WebglAddon | undefined;

  constructor(id: string, options: Partial<ISettings>) {
    const { fontLigatures } = options;

    if (fontLigatures) {
      this.LigaturesAddon = new LigaturesAddon();
    }

    this.handleOptionalAddons(options);

    addons[id] = this;
  }

  handleOptionalAddons({ renderer, linkHandlerKey }: Partial<ISettings>): void {
    if (renderer !== 'default') {
      this.RendererAddon = new (
        renderer === 'canvas' ? CanvasAddon : WebglAddon
      )();

      if (this.RendererAddon instanceof WebglAddon) {
        this.RendererAddon.onContextLoss(this.RendererAddon.dispose);
      }
    } else if (this.RendererAddon) {
      this.RendererAddon.dispose();
    }

    if (this.WebLinksAddon) {
      this.WebLinksAddon.dispose();

      this.WebLinksAddon = undefined;
    }

    this.WebLinksAddon = new WebLinksAddon((event, uri) => {
      const shouldHandleLink = !linkHandlerKey || event[`${linkHandlerKey}Key`];

      if (shouldHandleLink) shell.openExternal(uri);
    });
  }

  load(term: any, addons?: any[]): void {
    Object.values(addons || this).forEach(addon => term.loadAddon(addon));
  }

  reload(term: any, options: Partial<ISettings>): void {
    this.handleOptionalAddons(options);

    this.load(term, [this.RendererAddon, this.WebLinksAddon]);
  }

  fit(): void {
    this.FitAddon.fit();
  }
}

export { findResult, clearResult, onChangeResults };
