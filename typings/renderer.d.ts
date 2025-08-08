import { JSX } from 'preact';
import type Terminal from 'app/common/terminal';
import type actions from 'lib/store/actions';

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
    viewport: Partial<IViewport>;
    profile: IProfile;
    modal: string | null;
  };

  type AlphaActions = {
    set(path: string | string[], value: any): AlphaStore;
    assign(path: string[], value: any): AlphaStore;
    update(path: string[], value: any): AlphaStore;
    toggle(path: string[]): AlphaStore;
    without(path: string[]): AlphaStore;
    insert(path: string, value: any, origin: string | null): AlphaStore;
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

  type IInstance = {
    id: string;
    title: string;
    isExpanded: boolean;
    isConnected: boolean;
    profile: IProfile;
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
    | 'Config';

  interface TabProps {
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
    handleModal(_?: any, modal?: string | undefined): Promise<boolean>;
  }

  interface SectionProps {
    section: Section;
    options: JSX.Element[];
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
    properties: [string, string][];
    setProfile(profile: IProfile): void;
  }

  interface ConnectionFormProps {
    schema: any;
    profile: IProfile<'ssh' | 'serial'>;
    section: string;
    properties: string[];
    setProfile(profile: IProfile): void;
  }

  type NestedPartial<T> = { [K in keyof T]?: NestedPartial<T[K]> };

  type NestedExclude<T> = { [K in keyof T]: Exclude<T[K], null> };
}
