import { Client, type ClientChannel } from 'ssh2';
import net from 'net';
import socks from 'socksv5';
import sshpk from 'sshpk';
import crypto from 'crypto';
import { readFileSync } from 'fs';
import executeScripts, { getUnique } from 'app/connections/scripts';
import Logger from 'app/common/logger';
import getAgent from './agent';
import algorithms from './algorithms';

export const defaultOptions = <ISSHOptions>{
  host: '127.0.0.1',
  port: 22,
  username: 'root',
  authType: 'password',
  password: undefined,
  keyPath: undefined,
  agent: getAgent(),
  agentForward: false,
  x11: false,
  messages: false,
  keepaliveInterval: 3000,
  keepaliveCountMax: 5,
  ports: [],
  scripts: [],
};

class SSH extends Logger {
  client!: Client;

  options: ISSHOptions;

  private fingerprint!: string;

  private attempts: number = 0;

  private connected: boolean = false;

  constructor(
    options: Partial<ISSHOptions>,
    { id, profile }: IInstance,
    ipc: IPC,
  ) {
    super(id, profile, ipc);

    this.options = Object.assign(defaultOptions, options, <
      Partial<ISSHOptions>
    >{
      hostVerifier: (hash: Buffer) => {
        this.fingerprint = crypto
          .createHash('sha256')
          .update(hash)
          .digest('base64');

        return Boolean(this.fingerprint);
      },
      authHandler: (_, __, callback) => {
        const { authType: type, keyPath } = this.options;

        const username = options.username ?? 'root';

        if (type === 'password') {
          callback({ type, username, password: options.password ?? '' });
        }

        if (type === 'publickey' && keyPath) {
          let key = <string | Buffer>'';

          try {
            const content = readFileSync(keyPath);

            key = sshpk
              .parsePrivateKey(content.toString(), 'auto')
              .toString('openssh');
          } catch (error) {
            if (
              error instanceof sshpk.KeyEncryptedError ||
              error instanceof sshpk.KeyParseError
            ) {
              this.error(error.message);
            }
          }

          callback({ type, username, key });
        }

        callback(type);
      },
      tryKeyboard: true,
    });
  }

  connect() {
    this.client = new Client();

    this.info(`${this.options.host} ⇌  ${this.options.port}`).startSpinner(
      `Connecting...`,
    );

    this.client
      .on('ready', async () => {
        this.connected = true;

        this.client
          .shell({ term: 'xterm-256color' }, this.options, (error, stream) => {
            if (error) return this.error(error.message);

            let buffer = '';

            stream
              .on('data', (data: string) => {
                executeScripts(
                  { chunk: data, buffer },
                  this.options.scripts,
                  execute => stream.write(`${execute}`),
                );

                this.exec(data);
              })
              .on('end', () => stream.destroy());
          })
          .setNoDelay(true);

        await Promise.all(
          getUnique(this.options.ports).map(port => this.forward(port)),
        );

        this.exec(this.connected, 'connected')
          .exec('clear', 'action')
          .stopSpinner();
      })
      .on('handshake', negotiated => {
        this.debug(`Host key (${negotiated.serverHostKey})`).debug(
          `SHA256:${this.fingerprint}`,
        );
      })
      .on('x11', (_, accept) => {
        const socket = new net.Socket();

        socket
          .on('connect', () => {
            const stream = accept();

            stream
              .pipe(socket)
              .pipe(stream)
              .on('close', () => socket.destroy());
          })
          .on('error', error => this.error(error.message))
          .connect(6000, 'localhost');
      })
      .on('tcp connection', (details, accept, reject) => {
        const port = this.options.ports.find(
          port => port.port === details.destPort,
        );

        if (port && port.type !== 'dynamic') {
          const socket = net.connect(port.dstPort, port.dstHost);

          socket
            .on('connect', () => {
              const stream = accept();

              stream
                .pipe(socket)
                .pipe(stream)
                .on('close', () => socket.destroy());
            })
            .on('error', error => this.error(error.message, reject));
        }
      })
      .on('end', () => {
        this.client.destroy();

        this.exec(this.connected, 'connected').info(
          `Disconnected from ${this.options.host}:${this.options.port}`,
        );
      })
      .on('error', ({ message }) => {
        if (message.includes('ECONNREFUSED') && this.attempts < 5) {
          this.attempts += 1;

          setTimeout(() => this.reconnect(true), 1000);
        } else {
          this.attempts = 0;

          this.stopSpinner().error(message);
        }
      })
      .connect({ ...this.options, algorithms });

    ['greeting', 'banner'].forEach((event: any) =>
      this.client.on(
        event,
        message => !this.options.messages && this.exec(message),
      ),
    );
  }

  async forward(port: IForwardPort) {
    switch (port.type) {
      case 'local': {
        return new Promise<void>((resolve, reject) => {
          net
            .createServer(socket => {
              this.client.forwardOut(
                socket.remoteAddress || '127.0.0.1',
                socket.remotePort || 0,
                port.dstHost,
                port.dstPort,
                (error, stream) => {
                  if (error)
                    return this.error(error.message, () => {
                      socket.end();
                      reject();
                    });

                  stream
                    .pipe(socket)
                    .pipe(stream)
                    .on('close', () => this.disconnect());

                  resolve();
                },
              );
            })
            .on('error', error => this.error(error.message, reject))
            .listen(port.port, port.host, () => {
              this.info(
                `Local port forwarded:  ${port.host}:${port.port} →  ${port.dstHost}:${port.dstPort}`,
              );
            });
        });
      }

      case 'remote': {
        return new Promise<void>((resolve, reject) => {
          this.client.forwardIn(port.host, port.port, error => {
            if (error) return this.error(error.message, reject);

            this.info(
              `Remote port forwarded: ${port.host}:${port.port}  ← ${port.dstHost}:${port.dstPort}`,
            );

            resolve();
          });
        });
      }

      case 'dynamic': {
        return new Promise<void>((resolve, reject) => {
          socks
            .createServer((info, accept, reject) => {
              this.client.forwardOut(
                info.srcAddr || '127.0.0.1',
                info.srcPort || 0,
                info.dstAddr,
                info.dstPort,
                (error, stream) => {
                  if (error) return this.error(error.message, reject);

                  const socket = accept(true);

                  if (socket) {
                    stream
                      .pipe<ClientChannel>(socket)
                      .pipe(stream)
                      .on('close', () => this.disconnect());

                    resolve();
                  } else {
                    this.disconnect();
                  }
                },
              );
            })
            .on('error', error => this.error(error.message, reject))
            .listen(port.port, port.host, () => {
              this.info(
                `Dynamic port forwarded: ${port.host}:${port.port} →  SOCKS Proxy`,
              );
            })
            .useAuth(socks.auth.None());
        });
      }
    }
  }

  reconnect(error?: boolean): void {
    if (this.connected) this.disconnect();

    if (!error) this.startSpinner(`Connecting...`);

    this.client.connect(this.options);
  }

  disconnect(): void {
    if (!this.connected) return;

    try {
      this.client.end();
    } catch (error) {
      console.error(error);
    }

    this.connected = false;
  }

  write(): void {}
}

export default SSH;
