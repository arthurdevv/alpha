import { FitAddon } from '@xterm/addon-fit';
import type { SearchAddon as SearchAddonType } from '@xterm/addon-search';
import type { LigaturesAddon as LigaturesAddonType } from '@xterm/addon-ligatures';
import type { WebLinksAddon as WebLinksAddonType } from '@xterm/addon-web-links';
import type { Unicode11Addon as Unicode11AddonType } from '@xterm/addon-unicode11';
import type { ImageAddon as ImageAddonType } from '@xterm/addon-image';
import type { WebglAddon as WebglAddonType } from '@xterm/addon-webgl';
import type { CanvasAddon as CanvasAddonType } from '@xterm/addon-canvas';
import { shell } from '@electron/remote';
import storage from 'app/utils/local-storage';
import { decorations } from 'lib/styles/theme';

const addons: Record<string, Addons> = {};

// Lazy-load non-critical addons
const lazyAddons = {
  search: () => import('@xterm/addon-search').then(m => m.SearchAddon),
  ligatures: () => import('@xterm/addon-ligatures').then(m => m.LigaturesAddon),
  webLinks: () => import('@xterm/addon-web-links').then(m => m.WebLinksAddon),
  unicode11: () => import('@xterm/addon-unicode11').then(m => m.Unicode11Addon),
  image: () => import('@xterm/addon-image').then(m => m.ImageAddon),
  webgl: () => import('@xterm/addon-webgl').then(m => m.WebglAddon),
  canvas: () => import('@xterm/addon-canvas').then(m => m.CanvasAddon),
};

async function findResult(id: string, term: string, action: string) {
  const addon = addons[id];
  const SearchAddon = await addon.getSearchAddon();

  if (!SearchAddon) return;

  const controls = storage.parseItem('controls');

  SearchAddon[action](term, { decorations, ...controls });
}

async function clearResult(id: string) {
  const addon = addons[id];
  const SearchAddon = await addon.getSearchAddon();

  if (SearchAddon) {
    SearchAddon.clearDecorations();
  }
}

async function onChangeResults(id: string, updater: Function) {
  const addon = addons[id];
  const SearchAddon = await addon.getSearchAddon();

  if (!SearchAddon) {
    return { dispose: () => {} };
  }

  return SearchAddon.onDidChangeResults(({ resultIndex, resultCount }) =>
    updater([resultIndex + 1, resultCount]),
  );
}

export default class Addons {
  private term: any;

  FitAddon = new FitAddon();

  SearchAddon: SearchAddonType | undefined;

  ImageAddon: ImageAddonType | undefined;

  Unicode11Addon: Unicode11AddonType | undefined;

  WebLinksAddon: WebLinksAddonType | undefined;

  LigaturesAddon: LigaturesAddonType | undefined;

  RendererAddon: CanvasAddonType | WebglAddonType | undefined;

  private options: Partial<ISettings>;

  private lazyAddonsLoaded = false;

  constructor(id: string, options: Partial<ISettings>) {
    this.options = options;
    addons[id] = this;
  }

  // Load critical addons synchronously (FitAddon is already instantiated)
  // Renderer addon is loaded based on settings
  async handleRendererAddon(): Promise<void> {
    const { renderer } = this.options;

    if (renderer !== 'default') {
      if (renderer === 'canvas') {
        const CanvasAddon = await lazyAddons.canvas();
        this.RendererAddon = new CanvasAddon();
      } else {
        const WebglAddon = await lazyAddons.webgl();
        const webglAddon = new WebglAddon();
        webglAddon.onContextLoss(webglAddon.dispose);
        this.RendererAddon = webglAddon;
      }

      if (this.term) {
        this.term.loadAddon(this.RendererAddon);
      }
    } else if (this.RendererAddon) {
      this.RendererAddon.dispose();
      this.RendererAddon = undefined;
    }
  }

  async handleWebLinksAddon(): Promise<void> {
    const { linkHandlerKey } = this.options;

    if (this.WebLinksAddon) {
      this.WebLinksAddon.dispose();
      this.WebLinksAddon = undefined;
    }

    const WebLinksAddon = await lazyAddons.webLinks();
    this.WebLinksAddon = new WebLinksAddon((event, uri) => {
      const shouldHandleLink = !linkHandlerKey || event[`${linkHandlerKey}Key`];

      if (shouldHandleLink) shell.openExternal(uri);
    });

    if (this.term) {
      this.term.loadAddon(this.WebLinksAddon);
    }
  }

  // Load non-critical addons asynchronously after terminal is ready
  async loadLazyAddons(): Promise<void> {
    if (this.lazyAddonsLoaded) return;

    const { fontLigatures } = this.options;

    // Load Unicode11 addon
    const Unicode11Addon = await lazyAddons.unicode11();
    this.Unicode11Addon = new Unicode11Addon();
    if (this.term) {
      this.term.loadAddon(this.Unicode11Addon);
      this.term.unicode.activeVersion = '11';
    }

    // Load Image addon
    const ImageAddon = await lazyAddons.image();
    this.ImageAddon = new ImageAddon();
    if (this.term) {
      this.term.loadAddon(this.ImageAddon);
    }

    // Load Ligatures addon if enabled
    if (fontLigatures) {
      const LigaturesAddon = await lazyAddons.ligatures();
      this.LigaturesAddon = new LigaturesAddon();
      if (this.term) {
        this.term.loadAddon(this.LigaturesAddon);
      }
    }

    // Load WebLinks addon
    await this.handleWebLinksAddon();

    // Load renderer addon
    await this.handleRendererAddon();

    this.lazyAddonsLoaded = true;
  }

  // Get SearchAddon lazily - only load when search is actually used
  async getSearchAddon(): Promise<SearchAddonType | undefined> {
    if (!this.SearchAddon) {
      const SearchAddon = await lazyAddons.search();
      this.SearchAddon = new SearchAddon();
      if (this.term) {
        this.term.loadAddon(this.SearchAddon);
      }
    }
    return this.SearchAddon;
  }

  // Load only critical addons synchronously
  load(term: any): void {
    this.term = term;

    // FitAddon is critical - load immediately
    term.loadAddon(this.FitAddon);

    // Schedule lazy loading of non-critical addons
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleLoad = (window as any).requestIdleCallback || setTimeout;
    scheduleLoad(
      () => {
        this.loadLazyAddons();
      },
      { timeout: 1000 },
    );
  }

  async reload(term: any, options: Partial<ISettings>): Promise<void> {
    this.options = options;

    await this.handleRendererAddon();
    await this.handleWebLinksAddon();
  }

  fit(): void {
    this.FitAddon.fit();
  }
}

export { findResult, clearResult, onChangeResults };
