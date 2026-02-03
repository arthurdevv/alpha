import args from 'args';
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import {
  spawn,
  type SpawnOptionsWithoutStdio,
  type StdioPipeNamed,
} from 'child_process';

args.command('<default>', 'Initialize Alpha');

const main = async () => {
  args.parse(process.argv, {
    name: 'alpha',
    version: false,
    mainColor: 'white',
    subColor: 'black',
    mri: {},
  });

  const argsc = args.sub.map(path => {
    const cwd = isAbsolute(path) ? path : resolve(process.cwd(), path);

    if (!existsSync(cwd)) process.exit(1);

    return cwd;
  });

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    ALPHA_CLI: '1',
  };

  delete env['ELECTRON_RUN_AS_NODE'];

  const options: SpawnOptionsWithoutStdio = {
    env,
    detached: true,
    stdio: 'ignore' as StdioPipeNamed,
  };

  const child = spawn(process.execPath, argsc, options);

  child.unref();

  await new Promise(resolve => {
    setTimeout(resolve, 100);
  });
};

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
