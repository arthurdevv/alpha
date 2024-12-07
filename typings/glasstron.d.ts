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
