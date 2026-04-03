import type { AuthenticationType, ConnectConfig } from 'ssh2';

import type { GitInfo, Profile } from 'shared/types';

export interface ShellOptions {
  file: string;
  cwd: string;
  args: string[];
  env: Record<string, { value: string; hidden: boolean }>;
}

export interface SerialOptions {
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
  scripts: Script[];
  newlineMode: 'default' | 'lf' | 'cr' | 'crlf';
  inputBehavior: 'utf8' | 'line-by-line' | 'hex';
  outputBehavior: 'utf8' | 'hex';
}

export interface SSHOptions extends ConnectConfig {
  host: string;
  port: number;
  authType: AuthenticationType;
  x11: boolean;
  messages: boolean;
  ports: ForwardPort[];
  scripts: Script[];
  keyPath?: string;
}

interface BaseForwardPort {
  host: string;
  port: number;
}

interface LocalRemoteForwardPort extends BaseForwardPort {
  type: 'local' | 'remote';
  dstHost: string;
  dstPort: number;
}

interface DynamicForwardPort extends BaseForwardPort {
  type: 'dynamic';
}

export type ForwardPort = LocalRemoteForwardPort | DynamicForwardPort;

interface BaseScript {
  execute: string;
}

interface ExactScript extends BaseScript {
  type: 'exact';
  match: string;
}

interface RegexScript extends BaseScript {
  type: 'regex';
  match: RegExp;
}

export type Script = ExactScript | RegexScript;

export interface GitCacheEntry {
  info: GitInfo;
  timestamp: number;
}

export interface GitStatusCounts {
  modified: number;
  staged: number;
  untracked: number;
}

export interface GitAheadBehind {
  ahead: number;
  behind: number;
}

export interface InstanceArgs {
  profile: Profile;
  id?: string;
  title?: string;
  origin?: string;
  commands?: string[];
  overrideTitle?: boolean;
}
