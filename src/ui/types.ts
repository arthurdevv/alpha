import type { StateCreator } from 'zustand';

import type { Setting } from 'shared/types';

export interface Tab {
  id: UUID;
  title: string;
  type: 'terminal' | 'settings';
}

export interface Term {
  id: UUID;
  pid: UUID | null;
  ratios: number[];
  children: Term[];
  orientation: 'vertical' | 'horizontal' | null;
}

export interface Command {
  buffer: string;
  where: string;
  executedAt: string;
  executionTime: number;
}

export interface Snippet {
  id: UUID;
  name: string;
  commands: string[];
  lastRun: string | null;
  lastProfile: string | null;
}

export interface Color {
  hex: string;
  hue: number;
  alpha: number;
  saturation: number;
  value: number;
}

export interface SearchFilters {
  regex: boolean;
  wholeWord: boolean;
  caseSensitive: boolean;
}

export type SettingsSection =
  | 'Application'
  | 'Appearance'
  | 'Terminal'
  | 'Profiles'
  | 'Keymaps'
  | 'Window'
  | 'Workspaces'
  | 'Config file';

export interface SectionProps {
  content: preact.ComponentChildren;
}

export type SettingsSchema = Record<SettingsSection, ({ title: string } | Setting)[]>;

export type StoreActions<S, A> = StateCreator<S, [['zustand/immer', never]], [], A>;
