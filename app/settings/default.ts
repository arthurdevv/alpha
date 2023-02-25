const defaultSettings: ISettings = {
  // Controls the font size in pixels.
  fontSize: 16,

  // Controls the font family.
  fontFamily: "Menlo, Consolas, 'Lucida Console', monospace",

  // Controls the font weight.
  fontWeight: 400,

  // Controls whether to use font ligatures.
  fontLigatures: true,

  // Controls the line height.
  lineHeight: 1,

  // Controls the letter spacing.
  letterSpacing: 0,

  // Controls the style of cursor. Accepts "block", "underline" and "bar".
  cursorStyle: 'block',

  // Controls whether the cursor blinks.
  cursorBlink: true,

  // Command line arguments at execution.
  args: [],

  // Command line environment variables.
  env: {},

  // Colors to theme the terminal with.
  theme: {
    black: '#000000',
    red: '#FF3045',
    green: '#5FFA74',
    yellow: '#FFFC7E',
    blue: '#00AAFF',
    magenta: '#F924E7',
    cyan: '#00FFFC',
    white: '#E6E6E6',
    brightBlack: '#686868',
    brightRed: '#FF5A5A',
    brightGreen: '#75FF88',
    brightYellow: '#FFFD96',
    brightBlue: '#00AAFF',
    brightMagenta: '#F15BE5',
    brightCyan: '#88FFFE',
    brightWhite: '#FFFFFF',
  },
};

export = defaultSettings;
