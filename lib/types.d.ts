import { ITerminalOptions } from '@xterm/xterm';

import type actions from './store/actions';

declare global {
  type AlphaState = {
    context: Record<string, ITerminal>;
    current: string | undefined;
    modal: string | undefined;
    cols: number | undefined;
    rows: number | undefined;
    profile: IProfile | undefined;
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
    getStore(): AlphaStore;
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
    name?: string;
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

  interface ModalProps {
    modal: string | undefined;
    handleModal: (_?: any, modal?: string | undefined) => Promise<boolean>;
    isVisible: boolean;
  }

  interface ViewportProps {
    cols: number | undefined;
    rows: number | undefined;
  }

  interface PopoverProps {
    label: string;
    style?: React.CSSProperties;
  }

  interface SearchProps {
    isVisible: boolean;
    onClose: (event: React.TargetedEvent<HTMLElement>) => void;
  }

  interface EnviromentProps {
    profile: IProfile;
    setProfile: (profile: IProfile) => void;
  }

  interface SectionProps {
    section: Section;
    options: JSX.Element[];
  }

  type IMenuCommand = {
    name: string;
    keys: string[];
    action: () => Promise<boolean>;
  };

  type ISearchControls = {
    up?: boolean;
    down?: boolean;
    regex?: boolean;
    wholeWord?: boolean;
    caseSensitive?: boolean;
  };

  type Section =
    | 'Application'
    | 'Appearance'
    | 'Terminal'
    | 'Profiles'
    | 'Keymaps'
    | 'Window';
}
