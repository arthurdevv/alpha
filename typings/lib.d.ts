namespace Alpha {
  interface ConstructorOptions
    extends Electron.BrowserWindowConstructorOptions {
    blurType?: 'acrylic' | 'blurbehind' | 'transparent';
  }

  class BrowserWindow extends Electron.BrowserWindow {
    constructor(options: ConstructorOptions);

    setBlur(value: boolean);
  }

  export { BrowserWindow };
}

declare module 'glasstron' {
  export = Alpha;
}

declare module 'socksv5' {
  export const auth: { None(): void };

  interface SocksServer {
    on(event: 'error', callback: (error: Error) => void): this;
    listen(port: number, host: string, callback?: () => void): this;
    useAuth(auth: any): this;
  }

  export function createServer(
    handler: (
      info: {
        srcAddr: string;
        srcPort: number;
        dstAddr: string;
        dstPort: number;
      },
      accept: (flag: boolean) => void | null,
      deny: () => void,
    ) => void,
  ): SocksServer;
}
