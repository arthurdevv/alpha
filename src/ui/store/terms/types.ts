import type { Instance, Viewport } from 'shared/types';
import type { Tab, Term } from 'ui/types';

export interface TermsState {
  tabs: Record<UUID, Tab>;
  terms: Record<UUID, Term>;
  instances: Record<UUID, Instance>;
  focused: Record<UUID, UUID[]>;
  origin: UUID | null;
}

export interface TermsActions {
  requestTerm: (instance: Instance) => void;
  splitTerm: (
    id: UUID,
    instance: Instance,
    orientation: 'horizontal' | 'vertical',
  ) => void;
  switchTerm: (
    id: UUID,
    order: 'next' | 'previous' | number,
    nested?: boolean,
  ) => void;
  resizeTerm: (id: UUID, direction: 'up' | 'right' | 'down' | 'left') => void;
  disposeTerm: (id: UUID, origin: string) => void;
}

export interface TabsActions {
  createTab: (title: string, type: 'terminal' | 'settings') => void;
  selectTab: (id: UUID) => void;
  renameTab: (id: UUID, title: string) => void;
  duplicateTab: (id: UUID) => void;
  closeTab: (id: UUID, dispose?: boolean) => void;
}

export type TermsStore = TermsState & TermsActions & TabsActions;
