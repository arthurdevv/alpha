import { JSX } from 'preact';
import type { TFunction } from 'i18next';
import type Terminal from 'app/common/terminal';
import type actions from 'lib/store/actions';
import type workspaceActions from 'lib/store/workspaces/actions';
import type workspaceHelpers from 'lib/store/workspaces/helpers';

declare global {
  type AlphaState = {
    context: Record<string, IGroup>;
    instances: Record<string, IInstance>;
    current: {
      focused: string;
      origin: string | null;
      terms: Record<string, string[]>;
    };
    options: Partial<ISettings>;
    profile: IProfile;
    session: {
      group: IGroup;
      instances: IInstance[];
    };
    viewport: Partial<IViewport>;
    workspace: {
      metadata: IWorkspace;
      index: number;
    };
    modal: string | null;
  };

  type AlphaHelpers = {
    set(path: string | string[], value: any): AlphaStore;
    assign(path: string[], value: any): AlphaStore;
    update(path: string[], value: any): AlphaStore;
    toggle(path: string[]): AlphaStore;
    without(path: string[]): AlphaStore;
    insert(path: string, value: any, origin: string | null): AlphaStore;
    merge<T extends object>(target: T, partial: NestedPartial<T>): T;
    concat(path: string[], value: any): AlphaStore;
    exec(command: string, ...args: any[]);
  };

  type AlphaActions = AlphaHelpers & {
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
    title: string | null;
  };

  type IInstance = {
    id: string;
    title: string;
    isExpanded: boolean;
    isConnected: boolean;
    hasCustomTitle: boolean;
    profile: IProfile;
  };

  type IViewport = {
    cols: number;
    rows: number;
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
    icon: () => JSX.Element;
    type?: string;
    submenu?: any;
  };

  type IProfileFormProp = {
    key: string;
    name: string;
    description: string;
    values: (string | number)[];
    options: (string | number)[];
    type: 'text' | 'number' | 'checkbox' | 'selector';
  } & {
    key: 'env' | 'scripts' | 'ports';
    inputs: string[];
    warning: string;
  };

  type ICommand = {
    buffer: string;
    where: string;
    executedAt: string;
    executionTime: number;
  };

  type ISession = Pick<AlphaState, 'context' | 'instances' | 'current'> & {
    instances?: IInstance[];
    snapshot: ISnapshot[];
  };

  type Section =
    | 'Application'
    | 'Appearance'
    | 'Terminal'
    | 'Profiles'
    | 'Keymaps'
    | 'Window'
    | 'Workspaces'
    | 'Config file';

  interface TabProps {
    id: string;
    title: string;
    tabWidth: 'auto' | 'fixed' | undefined;
    isCurrent: boolean;
    onSelect(): void;
    onClose(): void;
  }

  interface TermDefaultProps extends AlphaStore {
    current: string[];
  }

  interface TermGroupProps extends TermDefaultProps {
    group: IGroup;
  }

  interface TermProps extends IInstance {
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
    isPreview?: boolean;
  }

  interface TabProps {
    title: string;
    isCurrent: boolean;
    onSelect(): void;
    onClose(): void;
  }

  interface ModalProps {
    store: AlphaStore;
    modal: string | null;
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleModal(_?: any, modal?: string | null): void;
  }

  interface ViewportProps {
    viewport: Partial<IViewport>;
    instances: Record<string, IInstance>;
  }

  interface PopoverProps {
    label: string;
    badge?: string;
    badged?: boolean;
    style?: React.CSSProperties;
  }

  interface SearchProps {
    isVisible: boolean;
    handleModal(_?: any, modal?: string | undefined): void;
  }

  interface SectionProps {
    section: Section;
    options: JSX.Element[];
    store: AlphaStore;
    t: TFunction;
  }

  interface SettingsProps {
    origin: string | null;
  }

  interface ContextMenuSchemaProps {
    term: Terminal | null;
    group: IGroup | null;
    instance: IInstance | null;
  }

  interface ProfileFormProps {
    schema: any;
    properties: any[] | Record<string, string>;
    profile: IProfile;
    section: string;
    setProfile(profile: IProfile): void;
    handleSave: (modal?: boolean) => void;
  }

  type ProfileFormSchemaOption = {
    key: string;
    label?: string;
    description?: string;
    type?: 'text' | 'number' | 'checkbox' | 'selector' | 'dialog' | 'password';
    options?: (string | number)[];
    values?: (string | number)[];
  };

  type ProfileFormSchemaProperty = {
    key: string;
    selectors: string[];
    placeholder: string;
    inputs: ProfileFormSchemaOption[];
    value: Record<string, Exclude<'type', IForwardPort>>;
  };

  interface ProfileFormOptionProps {
    option: ProfileFormSchemaOption;
    profile: IProfile;
    value: any;
    setProfile(profile: IProfile): void;
    setAuthType?: (authType: string) => void;
  }

  interface EnvironmentFormProps {
    schema: any;
    profile: IProfile<'shell'>;
    properties: [string, { value: string; hidden: boolean }][];
    setProfile(profile: IProfile): void;
    handleSave: (modal?: boolean) => void;
  }

  interface ConnectionFormProps {
    schema: any;
    profile: IProfile<'ssh' | 'serial'>;
    section: string;
    properties: string[];
    setProfile(profile: IProfile): void;
  }

  interface WelcomeProps {
    setIsFirstRun: React.Dispatch<SetStateAction<boolean>>;
    setModal(modal: string | null): void;
  }

  type WorkspaceContext = {
    tabs: Record<string, number>;
    commands: Record<string, string>;
    prompt: string | undefined;
  };

  interface ColorPickerProps {
    isPickingColor: boolean;
    currentColor: string;
    handleSelect: (color: string) => void;
  }

  type ISnippet = {
    id: string;
    name: string;
    commands: string[];
    lastRun: string | null;
    lastProfile: string | null;
  };

  type IColor = {
    hex: string;
    hue: number;
    alpha: number;
    saturation: number;
    value: number;
  };

  type WorkspacesState = {
    context: Record<string, IWorkspace>;
    prompts: Record<string, string | null>;
    current: { tabs: Record<string, number>; focused: string | null };
  };

  type WorkspacesHelpers = {
    set(path: string | string[], value: any): WorkspacesStore;
    update(path: string[], value: any): WorkspacesStore;
    without(path: string[]): WorkspacesStore;
  };

  type WorkspacesStore = WorkspacesState &
    WorkspacesHelpers &
    ReturnType<typeof workspaceActions>;

  type WorkspacesSet = (
    partial:
      | WorkspacesStore
      | Partial<WorkspacesStore>
      | ((
          state: WorkspacesStore,
        ) => WorkspacesStore | Partial<WorkspacesStore>),
    replace?: false,
  ) => void;

  interface WorkspacesProps {
    store: WorkspacesStore;
    settings: ISettings;
    theme: ITheme;
  }

  interface WorkspaceGroupProps extends Pick<
    ISettings,
    'fontFamily' | 'fontWeight' | 'theme'
  > {
    group: IWorkspaceGroup;
    profile: string;
    focused: string | null;
    prompts: Record<string, string | null>;
    splitPane(
      group: IWorkspaceGroup,
      orientation: 'vertical' | 'horizontal',
    ): void;
    setGroupRatios(id: string, ratios: number[]): void;
    setFocusedGroup(id: string): void;
    clearFocusedGroup(id: string, commands: string[]): void;
    setPrompt(id: string, data: string): void;
    closePane(id: string): void;
  }

  interface WorkspacePaneProps extends Pick<
    ISettings,
    'fontFamily' | 'fontWeight' | 'theme'
  > {
    prompt: string | null;
    profile: string;
    isCurrent: boolean;
    onFocus(): void;
    onBlur(commands: string[]): void;
    onPrompt(data: string): void;
    onSplit(orientation: 'horizontal' | 'vertical'): void;
    onClose(): void;
    splitSets: {
      horizontal: Set<string>;
      vertical: Set<string>;
      close: Set<string>;
    };
  }

  type NestedPartial<T> = { [K in keyof T]?: NestedPartial<T[K]> };

  type NestedExclude<T> = { [K in keyof T]: Exclude<T[K], null> };
}
