import args from 'args';
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

args.command('<default>', 'Initialize Alpha');

(() => {
  args.parse(process.argv, {
    name: 'alpha',
    version: false,
    mainColor: 'white',
    subColor: 'black',
    mri: {},
  });

  const argsc = args.sub.map(path => {
    const cwd = isAbsolute(path) ? path : resolve(process.cwd(), path);

    if (!existsSync(cwd)) {
      process.exit(1);
    }

    return cwd;
  });

  const env = Object.assign(process.env, {
    ALPHA_CLI: 'true',
  });

  delete env.ELECTRON_RUN_AS_NODE;

  const options: SpawnOptionsWithoutStdio = {
    env,
    detached: true,
  };

  const child = spawn(process.execPath, argsc, options);

  child.unref();

  return Promise.resolve();
})().then(() => {
  setTimeout(() => process.exit(0), 100);
});
