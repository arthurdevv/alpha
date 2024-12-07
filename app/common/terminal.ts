import * as xterm from '@xterm/xterm';
import { clipboard } from '@electron/remote';
import { getSettings } from 'app/settings';
import { execCommand } from 'app/keymaps/commands';
import Addons from 'app/common/addons';
import { theme } from 'lib/styles/theme';

export const terms: Record<string, Terminal | null> = {};

const defaultOptions: xterm.ITerminalOptions = {
  overviewRulerWidth: 20,
  allowProposedApi: true,
  allowTransparency: true,
  theme,
};

class Terminal {
  term: xterm.Terminal;

  addons: Addons;

  constructor(props: TermProps) {
    const options = Object.assign(props.options, defaultOptions);

    this.term = new xterm.Terminal(options);

    this.addons = new Addons(props.id, options);

    Object.entries(props).forEach(([key, value]) => {
      if (key in this.term && typeof value === 'function') {
        this.term[key](value);
      }
    });

    this.term.attachCustomKeyEventHandler(({ key, ctrlKey, altKey }) => {
      const [tab, pane, window] = [
        ['Tab', '3', '4', '5', '6', '7', '8', 'w', 'W'],
        ['Shift', 'ArrowLeft', 'ArrowRight', 'Enter', 'b', 'B'],
        ['Alt', 'F4', 'F11'],
      ];

      return !(
        (ctrlKey && tab.includes(key)) ||
        (ctrlKey && altKey && pane.includes(key)) ||
        window.includes(key)
      );
    });

    this.term.onSelectionChange(() => {
      const { copyOnSelect } = getSettings();

      if (copyOnSelect) this.copy();
    });

    terms[props.id] = this;
  }

  open(parent: HTMLElement): void {
    this.term.open(parent);

    Object.keys(this.addons).forEach(key => {
      this.term.loadAddon(this.addons[key]);
    });

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

  hasSelection(): boolean {
    return this.term.hasSelection();
  }

  handleClipboard(): void {
    const hasSelection = this.hasSelection();

    hasSelection ? this.copy() : this.paste();
  }

  setOptions(options: Partial<ISettings>): void {
    this.term.options = options;
  }
}

export default Terminal;
