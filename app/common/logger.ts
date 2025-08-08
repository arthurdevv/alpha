import colors from 'ansi-colors';

class Logger {
  private ipc: IPC;

  private interval!: NodeJS.Timeout;

  constructor(
    public id: string,
    public profile: IProfile,
    ipc: IPC,
  ) {
    this.ipc = ipc;
  }

  info(text: string) {
    this.exec(
      `${colors.bgWhiteBright.black(` ${this.profile.type.toUpperCase()} `)} ${text}\r\n`,
    );

    return this;
  }

  debug(text: string) {
    this.exec(`${colors.bgBlue.whiteBright(' DEBUG ')} ${text}\r\n`);

    return this;
  }

  warn(text: string) {
    this.exec(
      `${colors.bgYellow.black(' WARNING ')} ${colors.yellow(text)}\r\n`,
    );

    return this;
  }

  error(text: string, reject?: () => void) {
    this.exec(
      `${colors.bgRedBright.black(' X ')} ${colors.redBright(text)}\r\n`,
    );

    if (reject) reject();

    return this;
  }

  startSpinner(text: string) {
    const frames = ['|', '/', '-', '\\'];
    let index = 0;

    this.interval = setInterval(() => {
      this.exec(`\r${frames[index]} ${text}`);

      index = (index + 1) % frames.length;
    }, 100);

    return this;
  }

  stopSpinner() {
    clearInterval(this.interval);

    this.exec(`\x1b[2K\r\x1b[2K`);

    return this;
  }

  exec(data: any, command = 'write', focus = false) {
    if (data === '\r') data += '\r\n';

    this.ipc.send(
      `terminal:${command}`,
      command === 'write' ? { id: this.id, data } : data,
    );

    if (focus) setTimeout(() => this.ipc.send('terminal:action', 'focus'), 0);

    return this;
  }
}

export default Logger;
