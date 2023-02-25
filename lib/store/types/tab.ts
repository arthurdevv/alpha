export const TAB_SELECT = 'SELECT_TAB';

export const TAB_NEXT = 'TAB_NEXT';

export const TAB_PREVIOUS = 'TAB_PREVIOUS';

export const TAB_SPECIFIC = 'TAB_SPECIFIC';

export const TAB_CLOSE = 'TAB_CLOSE';

export interface SelectTabAction {
  type: typeof TAB_SELECT;
}

export interface NextTabAction {
  type: typeof TAB_NEXT;
}

export interface PreviousTabAction {
  type: typeof TAB_PREVIOUS;
}

export interface SpecificTabAction {
  type: typeof TAB_SPECIFIC;
}

export interface CloseTabAction {
  type: typeof TAB_CLOSE;
}

export type TabActions =
  | SelectTabAction
  | NextTabAction
  | PreviousTabAction
  | SpecificTabAction
  | CloseTabAction;
