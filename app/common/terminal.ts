import * as xterm from '@xterm/xterm';
import { clipboard } from '@electron/remote';
import { getSettings } from 'app/settings';
import { theme } from 'lib/styles/theme';
import { processes } from './process';
import addons from './addons';

export const terms: Record<string, xterm.Terminal> = {};

const defaultOptions: xterm.ITerminalOptions = {
  allowProposedApi: true,
  allowTransparency: true,
  theme,
};

const customKeys = {
  tab: ['Tab', '3', '4', '5', '6', '7', '8'],
  window: ['Alt', 'F4', 'F11'],
};

class Terminal {
  term: xterm.Terminal;

  constructor(private props: TermProps) {
    const options = Object.assign(props.options, defaultOptions);

    this.term = new xterm.Terminal(options);

    this.term.onData(data => {
      const process = processes[props.id];

      process.pty.write(data);
    });

    Object.entries(props).forEach(([key, value]) => {
      if (key in this.term && typeof value === 'function') {
        this.term[key](value);
      }
    });

    this.term.attachCustomKeyEventHandler(({ key, ctrlKey }) => {
      const { tab, window } = customKeys;

      return !((ctrlKey && tab.includes(key)) || window.includes(key));
    });

    this.term.onSelectionChange(() => {
      if (this.props.options['copyOnSelect']) {
        const selection = this.term.getSelection();

        if (selection) {
          clipboard.writeText(selection, 'selection');
        }
      }
    });
  }

  open(parent: HTMLElement): void {
    this.term.open(parent);

    Object.keys(addons).forEach(key => {
      const value = addons[key];

      if (key === 'options') {
        const { renderer, fontLigatures } = getSettings();

        if (renderer !== 'dom') {
          this.term.loadAddon(value[renderer]);
        }

        if (fontLigatures) {
          this.term.loadAddon(value['fontLigatures']);
        }
      } else {
        this.term.loadAddon(value);
      }
    });

    const observer = new ResizeObserver(() => {
      addons.FitAddon.fit();

      const { cols, rows } = this.term;

      this.props.onResize(cols, rows);
    });

    observer.observe(parent, { box: 'border-box' });
  }
}

export default Terminal;
