import { ITerminalOptions } from 'xterm';

import type actions from './store/actions';

declare global {
  type AlphaState = {
    context: Record<string, ITerminal>;
    current: string | undefined;
    menu: string | undefined;
    cols: number | undefined;
    rows: number | undefined;
    options: ITerminalOptions & {
      fontLigatures?: boolean;
    };
  };

  type AlphaActions = {
    set<K extends keyof AlphaState>(
      property: K,
      value: AlphaState[K],
    ): AlphaStore;
    setIn<I extends string, K extends keyof ITerminal>(
      property: [I, K?],
      value: any,
    ): AlphaStore;
    getState(): AlphaStore;
  } & ReturnType<typeof actions>;

  type AlphaSet = (
    partial:
      | AlphaStore
      | Partial<AlphaStore>
      | ((state: AlphaStore) => AlphaStore | Partial<AlphaStore>),
    replace?: boolean | undefined,
  ) => void;

  type AlphaStore = AlphaState & AlphaActions;

  type ITerminal = {
    title: string;
    shell: string;
    isDirty: boolean;
  };

  interface TabProps {
    title: string;
    isCurrent: boolean;
    onSelect: () => void;
    onClose: () => void;
  }

  interface TermProps {
    id: string;
    isDirty: boolean;
    isCurrent: boolean;
    onSelect: () => void;
    onResize: (cols: number, rows: number) => void;
    onTitleChange: (title: string) => void;
    options: ITerminalOptions;
  }

  interface MenuProps {
    menu: AlphaStore['menu'];
    setMenu: AlphaStore['setMenu'];
    isVisible: boolean;
  }

  interface ProfileProps {
    title: string;
    shell: string;
    onSelect: () => void;
  }

  interface ViewportProps {
    cols: number | undefined;
    rows: number | undefined;
  }

  interface PopoverProps {
    label: string;
    style?: React.CSSProperties;
  }

  interface SettingsProps {
    isCurrent: boolean;
  }

  interface SearchProps {
    isVisible: boolean;
    onClose: (event: React.TargetedEvent<HTMLElement>) => void;
  }

  type MenuCommands = {
    [label: string]: {
      keys: string[];
      exec: () => Promise<boolean>;
    };
  };

  type Section =
    | 'Application'
    | 'Appearance'
    | 'Keymaps'
    | 'Terminal'
    | 'Command Line';

  type ISearchControls = {
    up?: boolean;
    down?: boolean;
    regex?: boolean;
    wholeWord?: boolean;
    caseSensitive?: boolean;
  };
}
