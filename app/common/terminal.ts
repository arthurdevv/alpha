import * as xterm from '@xterm/xterm';
import { clipboard } from '@electron/remote';
import { getSettings } from 'app/settings';
import { handleCustomKeys } from 'app/keymaps';
import { execCommand } from 'app/keymaps/commands';
import { watchKeymaps } from 'app/keymaps/schema';
import { loadTheme } from 'app/common/themes';
import Addons from 'app/common/addons';

export const terms: Record<string, Terminal | null> = {};

const defaultOptions: xterm.ITerminalOptions = {
  allowProposedApi: true,
  allowTransparency: true,
};

class Terminal {
  term: xterm.Terminal;

  options: Partial<ISettings>;

  addons: Addons;

  constructor(private props: TermProps) {
    this.options = Object.assign(props.options, defaultOptions);

    this.term = new xterm.Terminal(this.options);

    this.addons = new Addons(props.id, this.options);

    Object.entries(props).forEach(([key, value]) => {
      if (key in this.term && typeof value === 'function') {
        this.term[key](value);
      }
    });

    this.term.onSelectionChange(() => {
      const { copyOnSelect } = getSettings();

      if (copyOnSelect) this.copy();
    });

    let buffer: string = '';

    watchKeymaps(keymaps => {
      this.term.attachCustomKeyEventHandler((event: KeyboardEvent) => {
        const isKeyDown = event.type === 'keydown';

        const key = event.key.toLowerCase();

        if (props.profile.type === 'shell' && event.ctrlKey && key === 'c') {
          return true;
        }

        if (isKeyDown) {
          if (key.length === 1) buffer += event.key;

          if (key === 'backspace') buffer = buffer.slice(0, -1);

          if (key === 'enter' && buffer !== '') {
            execCommand('terminal:prepare-history', { id: props.id, buffer });

            buffer = '';
          }

          if (key === 'escape') global.handleModal();
        }

        return !keymaps.has(handleCustomKeys(event));
      });
    });

    terms[props.id] = this;
  }

  open(parent: HTMLElement) {
    this.term.open(parent);

    this.addons.load(this.term);

    this.term.unicode.activeVersion = '11';
  }

  write(data: string): void {
    this.term.write(data);
  }

  focus(): void {
    this.term.focus();
  }

  clear(): void {
    this.term.clear();
  }

  fit(): void {
    this.addons.fit();
  }

  copy(): void {
    const selection = this.term.getSelection();

    const { trimSelection } = getSettings();

    clipboard.writeText(trimSelection ? selection.trim() : selection);
  }

  paste(): void {
    const text = clipboard.readText();

    if (/\n/.test(text)) {
      execCommand('app:modal', 'Warning');
    } else {
      this.term.paste(text);

      this.term.scrollToBottom();
    }
  }

  'select-all'(): void {
    this.term.selectAll();
  }

  get hasSelection(): boolean {
    return this.term.hasSelection();
  }

  get hasClipboard(): boolean {
    return Boolean(clipboard.readText());
  }

  handleClipboard(): void {
    this.hasSelection ? this.copy() : this.paste();
  }

  setOptions(options: Partial<ISettings>): void {
    this.term.options = {
      ...options,
      theme: loadTheme(options.theme ?? 'Default'),
    };

    const shouldReloadAddons = ['linkHandlerKey', 'renderer'].some(
      key => this.options[key] !== options[key],
    );

    if (shouldReloadAddons) {
      this.addons.reload(this.term, options);

      this.options = options;
    }
  }

  dispose(): void {
    this.term.dispose();

    delete terms[this.props.id];
  }
}

export default Terminal;
