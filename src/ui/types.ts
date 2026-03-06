import type { TFunction } from 'i18next';
import { JSX } from 'preact';
import type { StateCreator } from 'zustand';

import type Terminal from 'main/core/terminal';
import type { IForwardPort } from 'main/types';
import type {
  IInstance,
  IProfile,
  ISettings,
  IViewport,
  IWorkspace,
} from 'shared/types';
import type actions from 'ui/store/actions';

///

export type StoreActions<S, A> = StateCreator<
  S,
  [['zustand/immer', never]],
  [],
  A
>;

///

declare global {
  var tabIndex: number;
  var id: string | null;
  var menu: { top: number; left: number } | null;
}

export type AlphaState = {
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
  workspace: IWorkspace;
  modal: string | null;
};

export type AlphaActions = {
  set(path: string | string[], value: any): AlphaStore;
  assign(path: string[], value: any): AlphaStore;
  update(path: string[], value: any): AlphaStore;
  toggle(path: string[]): AlphaStore;
  without(path: string[]): AlphaStore;
  insert(path: string, value: any, origin: string | null): AlphaStore;
  merge<T extends object>(target: T, partial: NestedPartial<T>): T;
  concat(path: string[], value: any): AlphaStore;
  exec(command: string, ...args: any[]);
  getStore(): AlphaStore;
} & ReturnType<typeof actions>;

export type AlphaSet = (
  partial: AlphaStore | ((state: AlphaStore) => AlphaStore),
  replace?: false | undefined,
) => void;

export type AlphaStore = AlphaState & AlphaActions;

export type IGroup = {
  id: string;
  pid: string | null;
  ratios: number[];
  children: IGroup[];
  orientation: 'vertical' | 'horizontal' | null;
  title: string | null;
};

export type ISettingsOption = {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean';
  input: 'text' | 'checkbox' | 'select';
  options?: (string | number)[];
  values?: (string | number | boolean)[];
  range?: {
    min: string;
    max: string;
    step: string;
  };
  badges?: string[];
};

export type ICommand = {
  buffer: string;
  where: string;
  executedAt: string;
  executionTime: number;
};

export type ISearchControls = {
  up?: boolean;
  down?: boolean;
  regex?: boolean;
  wholeWord?: boolean;
  caseSensitive?: boolean;
};

export type IContextMenuSchema = {
  label: string;
  command: string;
  icon: () => JSX.Element;
  type?: string;
  submenu?: any;
};

export type IProfileFormProp = {
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

export type Section =
  | 'Application'
  | 'Appearance'
  | 'Terminal'
  | 'Profiles'
  | 'Keymaps'
  | 'Window'
  | 'Workspaces'
  | 'Config file';

export interface TabProps {
  id: string;
  title: string;
  tabWidth: 'auto' | 'fixed' | undefined;
  isCurrent: boolean;
  onSelect(): void;
  onClose(): void;
}

export interface TermDefaultProps extends AlphaStore {
  current: string[];
}

export interface TermGroupProps extends TermDefaultProps {
  group: IGroup;
}

export interface TermProps extends IInstance {
  id: string;
  current: string[];
  isCurrent: boolean;
  onData(data: string): void;
  onFocus(broadcast?: boolean): void;
  onResize({ cols, rows }: IViewport): void;
  onTitleChange(title: string): void;
  options: Partial<ISettings>;
}

export interface SplitTermProps {
  orientation: 'vertical' | 'horizontal' | null;
  ratios: number[];
  children: JSX.Element[];
  onResizeGroup(ratios: number[]): void;
}

export interface ModalProps {
  store: AlphaStore;
  modal: string | null;
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleModal(_?: any, modal?: string | null): void;
}

export interface ViewportProps {
  viewport: Partial<IViewport>;
  instances: Record<string, IInstance>;
}

export interface PopoverProps {
  label: string;
  badge?: string;
  badged?: boolean;
  style?: React.CSSProperties;
}

export interface SearchProps {
  isVisible: boolean;
  handleModal(_?: any, modal?: string | undefined): void;
}

export interface SectionProps {
  section: Section;
  options: JSX.Element[];
  store: AlphaStore;
  t: TFunction;
}

export interface SettingsProps {
  origin: string | null;
}

export interface ContextMenuSchemaProps {
  term: Terminal | null;
  group: IGroup | null;
  instance: IInstance | null;
}

export interface ProfileFormProps {
  schema: any;
  properties: any[] | Record<string, string>;
  profile: IProfile;
  section: string;
  setProfile(profile: IProfile): void;
  handleSave: (modal?: boolean) => void;
}

export type ProfileFormSchemaOption = {
  key: string;
  label?: string;
  description?: string;
  type?: 'text' | 'number' | 'checkbox' | 'selector' | 'dialog' | 'password';
  options?: (string | number)[];
  values?: (string | number)[];
};

export type ProfileFormSchemaProperty = {
  key: string;
  selectors: string[];
  placeholder: string;
  inputs: ProfileFormSchemaOption[];
  value: Record<string, Exclude<'export type', IForwardPort>>;
};

export interface ProfileFormOptionProps {
  option: ProfileFormSchemaOption;
  profile: IProfile;
  value: any;
  setProfile(profile: IProfile): void;
  setAuthType?: (authType: string) => void;
}

export interface EnvironmentFormProps {
  schema: any;
  profile: IProfile<'shell'>;
  properties: [string, { value: string; hidden: boolean }][];
  setProfile(profile: IProfile): void;
  handleSave: (modal?: boolean) => void;
}

export interface ConnectionFormProps {
  schema: any;
  profile: IProfile<'ssh' | 'serial'>;
  section: string;
  properties: string[];
  setProfile(profile: IProfile): void;
}

export interface WelcomeProps {
  setIsFirstRun: any;
  // setIsFirstRun: React.Dispatch<SetStateAction<boolean>>;
  setModal(modal: string | null): void;
}

export type WorkspaceContext = {
  tabs: Record<string, number>;
  commands: Record<string, string>;
  prompt: string | undefined;
};

export interface ColorPickerProps {
  isPickingColor: boolean;
  currentColor: string;
  handleSelect: (color: string) => void;
}

export type ISnippet = {
  id: string;
  name: string;
  commands: string[];
  lastRun: string | null;
  lastProfile: string | null;
};

export type IColor = {
  hex: string;
  hue: number;
  alpha: number;
  saturation: number;
  value: number;
};

export type NestedPartial<T> = { [K in keyof T]?: NestedPartial<T[K]> };
