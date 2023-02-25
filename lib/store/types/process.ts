export const PROCESS_ADD = 'PROCESS_ADD';

export const PROCESS_SET_TITLE = 'PROCESS_SET_TITLE';

export const PROCESS_SET_CURRENT = 'PROCESS_SET_CURRENT';

export const PROCESS_SET_DATA = 'PROCESS_SET_DATA';

export const PROCESS_SEND_DATA = 'PROCESS_SEND_DATA';

export const PROCESS_CLEAR_DATA = 'PROCESS_CLEAR_DATA';

export const PROCESS_DELETE = 'PROCESS_DELETE';

export const PROCESS_KILL = 'PROCESS_KILL';

interface ProcessAddAction {
  type: typeof PROCESS_ADD;
  id: string;
  shell: string | null;
  current?: string | undefined;
}

interface ProcessSetTitleAction {
  type: typeof PROCESS_SET_TITLE;
  id: string;
  title: string;
}

interface ProcessSetCurrentAction {
  type: typeof PROCESS_SET_CURRENT;
  id: string;
}

interface ProcessSetDataAction {
  type: typeof PROCESS_SET_DATA;
  id: string;
}

interface ProcessSendDataAction {
  type: typeof PROCESS_SEND_DATA;
}

interface ProcessClearDataAction {
  type: typeof PROCESS_CLEAR_DATA;
}

interface ProcessDeleteAction {
  type: typeof PROCESS_DELETE;
  id: string;
}

interface ProcessKillAction {
  type: typeof PROCESS_KILL;
  id: string;
}

export type ProcessActions =
  | ProcessAddAction
  | ProcessSetTitleAction
  | ProcessSetCurrentAction
  | ProcessSetDataAction
  | ProcessSendDataAction
  | ProcessClearDataAction
  | ProcessDeleteAction
  | ProcessKillAction;
