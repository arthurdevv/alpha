import type { FlatSettings, Profile, Viewport, Workspace } from 'shared/types';

export interface AppState {
  settings: Partial<FlatSettings>;
  keymaps: Record<string, string[]>;
  combos: Record<string, string>;
  modal: string | null;
  profile: Profile | null;
  workspace: Workspace | null;
  viewport: Viewport;
}

export interface AppActions {
  setSetting: <K extends keyof FlatSettings>(
    key: K,
    value: FlatSettings[K],
  ) => void;
  setSettings: (partial: Partial<FlatSettings>) => void;
  setKeymap: (command: string, combo: string) => void;
  setKeymaps: (keymaps: Record<string, string[]>) => void;
  setModal: (modal: string | null) => void;
  setProfile: (profile: Profile | null) => void;
  setWorkspace: (workspace: Workspace | null) => void;
  setViewport: (viewport: Viewport) => void;
}

export type AppStore = AppState & AppActions;
