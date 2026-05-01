import fs from 'node:fs';

import { app } from 'electron';
import type { ZodSafeParseResult, ZodType } from 'zod';

import { reportError } from './error-reporter';

export const PATHS = {
  get app() {
    return app.getAppPath();
  },

  get exe() {
    return app.getPath('exe');
  },

  get userData() {
    return app.getPath('userData');
  },
};

export abstract class ConfigManager<T, U> {
  private cache: T | null = null;
  private watcher: fs.FSWatcher | null = null;

  constructor(
    protected readonly file: { JSON: string; YAML: string },
    protected readonly schema: ZodType<T> | null,
    protected readonly defaults: T,
  ) {}

  async init(): Promise<void> {
    if (app.getVersion() !== '1.0.0') {
      return await this.migrate();
    }

    if (!fs.existsSync(this.file.JSON)) this.save(this.defaults);
  }

  load(): T {
    if (this.cache) return this.cache;

    try {
      const config = JSON.parse(fs.readFileSync(this.file.JSON, 'utf-8'));
      const result = this.validate(config);

      if (!result.success) {
        reportError(result.error);
        return this.defaults;
      }

      this.cache = { ...this.defaults, ...result.data };
      return this.cache;
    } catch (error) {
      reportError(error);
      return this.defaults;
    }
  }

  save(value: T): void {
    const result = this.validate(value);

    if (!result.success) {
      reportError(result.error);
      return;
    }

    try {
      const { data } = result;
      this.cache = data;

      fs.writeFileSync(this.file.JSON, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      reportError(error);
    }
  }

  validate(value: T): ZodSafeParseResult<T> {
    if (!this.schema) return { success: true, data: value };
    return this.schema.safeParse(value);
  }

  watch(callback: (value: U) => void): void {
    if (this.watcher) return;

    let debounce: NodeJS.Timeout | null = null;

    this.watcher = fs.watch(this.file.JSON, { persistent: false }, event => {
      if (event !== 'change') return;
      if (debounce) clearTimeout(debounce);

      debounce = setTimeout(() => {
        this.cache = null;
        debounce = null;

        callback(this.get());
      }, 50);
    });
  }

  unwatch(): void {
    this.watcher?.close();
    this.watcher = null;
  }

  /**
   * @deprecated YAML support will be removed in 1.1.0. JSON is now the default config format.
   */
  async migrate(): Promise<void> {
    try {
      const hasJson = fs.existsSync(this.file.JSON);
      if (hasJson) return;

      const hasYaml = fs.existsSync(this.file.YAML);
      if (hasYaml) {
        const yaml = await import('js-yaml');

        const parsed = yaml.load(fs.readFileSync(this.file.YAML, 'utf-8')) as T;
        this.migrateSave({ ...this.defaults, ...parsed });

        fs.unlinkSync(this.file.YAML);
        return;
      }

      this.migrateSave(this.defaults);
    } catch (error) {
      reportError(error);
      this.migrateSave(this.defaults);
    }
  }

  /**
   * @deprecated YAML support will be removed in 1.1.0. JSON is now the default config format.
   */
  private migrateSave(value: T): void {
    try {
      this.cache = value;
      fs.writeFileSync(this.file.JSON, JSON.stringify(value, null, 2), 'utf-8');
    } catch (error) {
      reportError(error);
    }
  }

  abstract get(defaults?: boolean): U;
}
