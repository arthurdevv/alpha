import * as xterm from '@xterm/xterm';
import { clipboard } from '@electron/remote';
import { getSettings } from 'app/settings';
import { handleCustomKeys } from 'app/keymaps';
import { execCommand } from 'app/keymaps/commands';
import Addons from 'app/common/addons';
import { theme } from 'lib/styles/theme';
import { watchKeymaps } from 'app/keymaps/schema';

export const terms: Record<string, Terminal | null> = {};

const defaultOptions: xterm.ITerminalOptions = {
  overviewRulerWidth: 20,
  allowProposedApi: true,
  allowTransparency: true,
  theme,
};

class Terminal {
  term: xterm.Terminal;

  options: Partial<ISettings>;

  addons: Addons;

  constructor(props: TermProps) {
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

    watchKeymaps(keymaps => {
      this.term.attachCustomKeyEventHandler(
        (event: KeyboardEvent) => !keymaps.has(handleCustomKeys(event)),
      );
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
    }
  }

  selectAll(): void {
    this.term.selectAll();
  }

  get hasSelection(): boolean {
    return this.term.hasSelection();
  }

  handleClipboard(): void {
    this.hasSelection ? this.copy() : this.paste();
  }

  setOptions(options: Partial<ISettings>): void {
    this.term.options = options;

    const shouldReloadAddons = ['linkHandlerKey', 'renderer'].some(
      key => this.options[key] !== options[key],
    );

    if (shouldReloadAddons) {
      this.addons.reload(this.term, options);

      this.options = options;
    }
  }
}

export default Terminal;
