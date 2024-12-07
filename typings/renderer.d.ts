import type Terminal from 'app/common/terminal';
import type actions from 'lib/store/actions';

declare global {
  type AlphaState = {
    context: Record<string, IGroup>;
    processes: Record<string, IProcess>;
    current: {
      origin: string | null;
      focused: string;
      instances: Record<string, string[]>;
    };
    options: Partial<ISettings>;
    viewport: Partial<IViewport>;
    modal: string | null;
    profile: IProfile | null;
  };

  type AlphaActions = {
    set(path: string | string[], value: any): AlphaStore;
    assign(path: string[], value: any): AlphaStore;
    update(path: string[], value: any): AlphaStore;
    toggle(path: string[]): AlphaStore;
    without(path: string[]): AlphaStore;
    merge<T extends object>(target: T, partial: NestedPartial<T>): T;
    getStore(): AlphaStore;
  } & ReturnType<typeof actions>;

  type AlphaSet = (
    partial: AlphaStore | ((state: AlphaStore) => AlphaStore),
    replace?: false | undefined,
  ) => void;

  type AlphaStore = AlphaState & AlphaActions;

  type IGroup = {
    id: string;
    pid: string | null;
    ratios: number[];
    children: IGroup[];
    orientation: 'vertical' | 'horizontal' | null;
  };

  type IProcess = {
    id: string;
    title: string;
    profile: IProfile | undefined;
    isExpanded: boolean;
  };

  type IViewport = {
    cols: number;
    rows: number;
  };

  type IPaletteCommand = {
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

  type IContextMenuSchema = {
    label: string;
    command: string;
    icon: JSX.Element;
  };

  type ISession = Pick<AlphaState, 'context' | 'processes' | 'current'> & {
    instances?: IInstance[];
  };

  type Section =
    | 'Application'
    | 'Appearance'
    | 'Terminal'
    | 'Profiles'
    | 'Keymaps'
    | 'Window';

  interface TabProps {
    title: string;
    isCurrent: boolean;
    onSelect: () => void;
    onClose: () => void;
  }

  interface TermDefaultProps extends AlphaStore {
    current: string[];
  }

  interface TermGroupProps extends TermDefaultProps {
    group: IGroup;
  }

  interface TermProps extends Partial<IProcess> {
    id: string;
    current: string[];
    isCurrent: boolean;
    onData(data: string): void;
    onFocus(broadcast?: boolean): void;
    onResize({ cols, rows }: IViewport): void;
    onTitleChange(title: string): void;
    options: Partial<ISettings>;
  }

  interface SplitTermProps {
    orientation: 'vertical' | 'horizontal' | null;
    ratios: number[];
    children: JSX.Element[];
    onResizeGroup(ratios: number[]): void;
  }

  interface TabProps {
    title: string;
    isCurrent: boolean;
    onSelect(): void;
    onClose(): void;
  }

  interface ModalProps {
    modal: string | null;
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleModal(_?: any, modal?: string | null): Promise<boolean>;
  }

  interface ViewportProps {
    viewport: Partial<IViewport>;
    processes: Record<string, IProcess>;
  }

  interface PopoverProps {
    label: string;
    style?: React.CSSProperties;
  }

  interface SearchProps {
    isVisible: boolean;
    handleModal(_?: any, modal?: string | undefined): Promise<boolean>;
  }

  interface EnviromentProps {
    profile: IProfile;
    setProfile(profile: IProfile): void;
  }

  interface SectionProps {
    section: Section;
    options: JSX.Element[];
  }

  interface SettingsProps {
    origin: string | null;
  }

  interface ContextMenuSchemaState {
    term: Terminal | null;
    group: IGroup | null;
    process: IProcess | null;
  }

  type NestedPartial<T> = { [K in keyof T]?: NestedPartial<T[K]> };

  type NestedExclude<T> = { [K in keyof T]: Exclude<T[K], null> };
}
