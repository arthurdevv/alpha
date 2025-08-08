import { ReadlineParser, SerialPort } from 'serialport';
import { SerialPortStream } from '@serialport/stream';
import { autoDetect } from '@serialport/bindings-cpp';
import executeScripts from 'app/connections/scripts';
import Logger from 'app/common/logger';
import HexParser from './hex';

export const defaultOptions = <Partial<ISerialOptions>>{
  path: 'COM3',
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  rtscts: false,
  xon: false,
  xoff: false,
  xany: false,
  scripts: [],
  newlineMode: 'default',
  inputBehavior: 'utf8',
  outputBehavior: 'utf8',
};

const delimiters = {
  default: '\n',
  lf: '\n',
  cr: '\r',
  crlf: '\r\n',
} as const;

class Serial extends Logger {
  port!: SerialPortStream;

  options: ISerialOptions;

  constructor(
    options: Partial<ISerialOptions>,
    { id, profile }: IInstance,
    ipc: IPC,
  ) {
    super(id, profile, ipc);

    this.options = <ISerialOptions>Object.assign(defaultOptions, options, {
      binding: autoDetect(),
      autoOpen: false,
    });
  }

  connect() {
    const { path, newlineMode, inputBehavior, scripts } = this.options;

    if (!path) {
      const ports = SerialPort.list();

      ports.then(([port]) => {
        if (port) this.options.path = port.path;
      });
    }

    this.port = new SerialPortStream(this.options);

    if (inputBehavior === 'utf8') {
      let buffer = '';

      this.port.on('data', (chunk: any) => {
        executeScripts({ chunk, buffer }, scripts, execute =>
          this.write(`${execute}${newlineMode}`),
        );

        this.exec(chunk.toString(inputBehavior));
      });
    } else {
      const parser =
        inputBehavior === 'hex'
          ? new HexParser()
          : new ReadlineParser({ delimiter: delimiters[newlineMode] });

      this.port.pipe(parser).on('data', (chunk: string) => this.exec(chunk));
    }

    this.port
      .on('open', () => {
        this.exec(this.port.isOpen, 'connected').info(
          `Connected to ${this.options.path} [${this.options.baudRate}]`,
        );
      })
      .on('readable', () => {
        this.exec(this.port.read());
      })
      .on('error', error => {
        this.error(error.message);
      })
      .on('close', () => {
        this.port.destroy();
      })
      .open();
  }

  write(chunk: any): void {
    if (!this.port.isOpen) return;

    const { outputBehavior } = this.options;

    if (outputBehavior === 'hex') {
      try {
        chunk = Buffer.from(chunk.replace(/\s+/g, ''), outputBehavior);
      } catch (error: any) {
        this.error(error.message);
      }
    }

    this.exec(chunk.toString());
    this.port.write(chunk, outputBehavior);
  }

  reconnect(): void {
    if (this.port.isOpen) this.disconnect();

    this.connect();
  }

  disconnect(): void {
    if (!this.port.isOpen) return;

    try {
      this.port.close();
    } catch (error) {
      console.log(error);
    }

    this.exec(this.port.isOpen, 'connected').info(
      `Disconnected from ${this.options.path}`,
    );
  }
}

export default Serial;
