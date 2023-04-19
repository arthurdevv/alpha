import * as xterm from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { LigaturesAddon } from 'xterm-addon-ligatures';
import { shell, clipboard } from '@electron/remote';

export const getOptions = (props: TermProps): ITerminalOptions => ({
  fontSize: props.fontSize,
  fontFamily: props.fontFamily,
  fontWeight: props.fontWeight,
  fontLigatures: props.fontLigatures,
  lineHeight: props.lineHeight,
  letterSpacing: props.letterSpacing,
  cursorStyle: props.cursorStyle,
  cursorBlink: props.cursorBlink,
  theme: {
    foreground: props.theme.foreground,
    background: props.theme.background,
    cursor: props.theme.cursor,
    cursorAccent: props.theme.cursorAccent,
    selectionForeground: props.theme.selectionForeground,
    selectionBackground: props.theme.selectionBackground,
    black: props.theme.black,
    red: props.theme.red,
    green: props.theme.green,
    yellow: props.theme.yellow,
    blue: props.theme.blue,
    magenta: props.theme.magenta,
    cyan: props.theme.cyan,
    white: props.theme.white,
    brightBlack: props.theme.brightBlack,
    brightRed: props.theme.brightRed,
    brightGreen: props.theme.brightGreen,
    brightYellow: props.theme.brightYellow,
    brightBlue: props.theme.brightBlue,
    brightMagenta: props.theme.brightMagenta,
    brightCyan: props.theme.brightCyan,
    brightWhite: props.theme.brightWhite,
  },
  scrollback: 25000,
  allowProposedApi: true,
  allowTransparency: true,
});

export default class Instance {
  public instance!: xterm.Terminal;

  public options: ITerminalOptions;

  private addons!: ITerminalAddons;

  public observer!: ResizeObserver;

  constructor(options: ITerminalOptions) {
    this.options = options;
  }

  public open(parent: HTMLElement | null, props: TermProps): void {
    if (!parent) {
      if (this.observer) {
        this.observer.disconnect();
      }

      return;
    }

    this.instance = new xterm.Terminal(this.options);

    this.instance.open(parent);

    this.addons = {
      fitAddon: new FitAddon(),
      unicode11Addon: new Unicode11Addon(),
      webLinksAddon: new WebLinksAddon(
        (event, uri) => void shell.openExternal(uri),
      ),
      ligaturesAddon: this.options.fontLigatures
        ? new LigaturesAddon()
        : undefined,
    };

    Object.values(this.addons).forEach(addon => {
      if (addon) {
        this.instance.loadAddon(addon);
      }
    });

    props.isCurrent && this.instance.focus();

    this.instance.onData(props.onData);

    this.instance.onTitleChange(props.onTitle);

    this.instance.textarea?.addEventListener('focus', props.onCurrent);

    this.addons.fitAddon.fit();

    this.instance.unicode.activeVersion = '11';

    this.instance.attachCustomKeyEventHandler(event => {
      const tabKeys = ['Tab', '3', '4', '5', '6', '7', '8'];

      if (event.ctrlKey && tabKeys.includes(event.key)) return false;

      const windowKeys = ['Alt', 'F4', 'F11'];

      if (windowKeys.includes(event.key)) return false;

      return true;
    });

    this.observer = new ResizeObserver(() => {
      this.addons.fitAddon.fit();

      props.onResize(this.instance.cols, this.instance.rows);
    });

    this.observer.observe(parent);
  }

  public hasSelection(): boolean {
    return this.instance.hasSelection();
  }

  public getSelection(): string {
    return this.instance.getSelection();
  }

  public get clipboard(): typeof clipboard {
    return clipboard;
  }
}
