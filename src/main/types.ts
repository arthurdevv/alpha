import type { AuthenticationType, ConnectConfig } from 'ssh2';

import type { IGitInfo, IProfile } from 'shared/types';

export type IShellOptions = {
  file: string;
  cwd: string;
  args: string[];
  env: Record<string, { value: string; hidden: boolean }>;
};

export type ISerialOptions = {
  path: string;
  baudRate: number;
  dataBits: 5 | 6 | 7 | 8;
  stopBits: 1 | 1.5 | 2;
  parity: 'none' | 'even' | 'odd';
  rtscts: boolean;
  xon: boolean;
  xoff: boolean;
  xany: boolean;
  binding: any;
  scripts: IScript[];
  newlineMode: 'default' | 'lf' | 'cr' | 'crlf';
  inputBehavior: 'utf8' | 'line-by-line' | 'hex';
  outputBehavior: 'utf8' | 'hex';
};

export type ISSHOptions = ConnectConfig & {
  host: string;
  port: number;
  authType: AuthenticationType;
  x11: boolean;
  messages: boolean;
  ports: IForwardPort[];
  scripts: IScript[];
  keyPath?: string;
};

export type IForwardPort<T = 'local' | 'remote' | 'dynamic'> = {
  type: T;
} & (
  | {
      type: 'local' | 'remote';
      host: string;
      port: number;
      dstHost: string;
      dstPort: number;
    }
  | {
      type: 'dynamic';
      host: string;
      port: number;
    }
);

export type IScript = {
  execute: string;
} & (
  | {
      type: 'exact';
      match: string;
    }
  | {
      type: 'regex';
      match: RegExp;
    }
);

export interface InstanceArgs {
  profile: IProfile;
  origin?: string;
  id?: string;
  title?: string;
  commands?: string[];
  overrideTitle?: boolean;
}

export interface CacheEntry {
  info: IGitInfo;
  timestamp: number;
}

export interface StatusCounts {
  modified: number;
  staged: number;
  untracked: number;
}

export interface AheadBehind {
  ahead: number;
  behind: number;
}
