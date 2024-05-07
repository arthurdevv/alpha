import { getGroups } from 'app/common/profiles';

type ISettingsSchema = Record<
  Section,
  Record<string, Record<string, ISettingsOption>>
>;

const schema: ISettingsSchema = {
  Application: {
    Default: {
      language: {
        name: 'Language',
        label: 'Alpha will be displayed in this language.',
        type: 'string',
        input: 'select',
        options: ['English (US)'],
      },
      autoUpdates: {
        name: 'Automatic Updates',
        label:
          'Whether to automatically install an update when it is available.',
        type: 'boolean',
        input: 'checkbox',
      },
      gpu: {
        name: 'GPU Acceleration',
        label: 'Whether the application will use the GPU to do its rendering.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
  Appearance: {
    Text: {
      fontSize: {
        name: 'Font Size',
        label: 'Controls the font size in pixels.',
        type: 'number',
        input: 'text',
        range: { min: 1, max: 99, step: 1 },
      },
      fontFamily: {
        name: 'Font Family',
        label: 'Controls the font family.',
        type: 'string',
        input: 'text',
      },
      fontWeight: {
        name: 'Font Weight',
        label: 'Controls the font weight.',
        type: 'number',
        input: 'select',
        options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      fontWeightBold: {
        name: 'Bold Font Weight',
        label: 'Controls the font weight used to render bold text.',
        type: 'number',
        input: 'select',
        options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      drawBoldTextInBrightColors: {
        name: 'Bold text in bright colors',
        label: 'Controls whether to draw bold text in bright colors.',
        type: 'boolean',
        input: 'checkbox',
      },
      fontLigatures: {
        name: 'Font Ligatures',
        label: 'Controls whether to use font ligatures.',
        type: 'boolean',
        input: 'checkbox',
      },
      lineHeight: {
        name: 'Line Height',
        label: 'Controls the line height.',
        input: 'text',
        type: 'number',
        range: { min: 1, max: 99, step: 0.1 },
      },
      letterSpacing: {
        name: 'Letter Spacing',
        label: 'Controls the spacing in whole pixels between characters.',
        type: 'number',
        input: 'text',
        range: { min: 0, max: 99, step: 0.1 },
      },
      minimumContrastRatio: {
        name: 'Contrast Ratio',
        label: 'Controls the minimum contrast ratio for text in the terminal.',
        type: 'number',
        input: 'text',
        range: { min: 1, max: 21, step: 1 },
      },
    },
    Cursor: {
      cursorStyle: {
        name: 'Cursor Style',
        label: 'Controls the style of cursor.',
        type: 'string',
        input: 'select',
        options: ['bar', 'block', 'underline'],
      },
      cursorBlink: {
        name: 'Cursor Blinking',
        label: 'Controls whether the cursor blinks.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
  Terminal: {
    Rendering: {
      renderer: {
        name: 'Renderer',
        label: 'Controls the terminal based-renderer.',
        type: 'string',
        input: 'select',
        options: ['dom', 'webgl', 'canvas'],
      },
      scrollback: {
        name: 'Scrollback',
        label: 'Controls the amount of rows beyond the initial viewport.',
        type: 'number',
        input: 'text',
        range: { min: 1, max: 50000, step: 1 },
      },
    },
    Interaction: {
      scrollOnUserInput: {
        name: 'Scroll on input',
        label: 'Whether to scroll to the bottom on user input.',
        type: 'boolean',
        input: 'checkbox',
      },
      copyOnSelect: {
        name: 'Copy on select',
        label: 'Whether to copy the text when it is selected.',
        type: 'boolean',
        input: 'checkbox',
      },
      wordSeparator: {
        name: 'Word separators',
        label: 'Controls the separator symbols for double-click selection.',
        type: 'string',
        input: 'text',
      },
    },
    Startup: {
      openOnStart: {
        name: 'Open a terminal on start',
        label: 'Whether to automatically open the default profile.',
        type: 'boolean',
        input: 'checkbox',
      },
      restoreOnStart: {
        name: 'Restore latest session on start',
        label: 'Whether to restore the previous terminal tabs.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
  Profiles: {
    Default: {
      defaultProfile: {
        name: 'Default Profile',
        label: 'Controls the default profile to set for new terminal.',
        type: 'string',
        input: 'select',
        options: (getGroups(true) as IProfile[]).map(({ name }) => name),
      },
    },
  },
  Keymaps: {
    Default: {},
  },
  Window: {
    Transparency: {
      acrylic: {
        name: 'Acrylic background',
        label: 'Whether to enable window translucent background.',
        type: 'boolean',
        input: 'checkbox',
      },
      opacity: {
        name: 'Opacity',
        label: 'Controls the opacity of the window.',
        type: 'number',
        input: 'text',
        range: { min: 0.4, max: 1, step: 0.01 },
      },
    },
    Behavior: {
      alwaysOnTop: {
        name: 'Always on top',
        label: 'Whether the window should always stay on top of other windows.',
        type: 'boolean',
        input: 'checkbox',
      },
      autoHideOnBlur: {
        name: 'Automatically hide window',
        label:
          'Whether to automatically hide terminal when switch to another window.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
};

export default schema;
