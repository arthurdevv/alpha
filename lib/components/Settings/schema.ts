import defaultProfiles from 'app/common/profiles';

const schema: Record<Section, Record<string, ISettingsKey>> = {
  Application: {
    language: {
      label: 'Language',
      type: 'select',
      valueType: 'text',
      description: 'Alpha will be displayed in this language.',
      options: ['English (US)'],
    },
    autoUpdates: {
      label: 'Automatic Updates',
      type: 'checkbox',
      valueType: 'boolean',
      description:
        'Whether to automatically download an update when it is available.',
    },
    gpu: {
      label: 'GPU Acceleration',
      type: 'checkbox',
      valueType: 'boolean',
      description:
        'Whether the application will use the GPU to do its rendering.',
    },
  },
  Appearance: {
    fontSize: {
      label: 'Font Size',
      type: 'input',
      valueType: 'number',
      description: 'Controls the font size in pixels.',
      range: {
        min: 1,
        max: 99,
        step: 1,
      },
    },
    fontFamily: {
      label: 'Font Family',
      type: 'input',
      valueType: 'text',
      description: 'Controls the font family.',
    },
    fontWeight: {
      label: 'Font Weight',
      type: 'select',
      valueType: 'number',
      description: 'Controls the font weight.',
      options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    fontLigatures: {
      label: 'Font Ligatures',
      type: 'checkbox',
      valueType: 'boolean',
      description: 'Controls whether to use font ligatures.',
    },
    lineHeight: {
      label: 'Line Height',
      type: 'input',
      valueType: 'number',
      description: 'Controls the line height.',
      range: {
        min: 1,
        max: 99,
        step: 1,
      },
    },
    letterSpacing: {
      label: 'Letter Spacing',
      type: 'input',
      valueType: 'number',
      description: 'Controls the letter spacing.',
      range: {
        min: 0,
        max: 99,
        step: 1,
      },
    },
    cursorStyle: {
      label: 'Cursor Style',
      type: 'select',
      valueType: 'text',
      description: 'Controls the style of cursor.',
      options: ['bar', 'block', 'underline'],
    },
    cursorBlink: {
      label: 'Cursor Blinking',
      type: 'checkbox',
      valueType: 'boolean',
      description: 'Controls whether the cursor blinks.',
    },
  },
  Keymaps: {},
  Terminal: {
    renderer: {
      label: 'Renderer',
      type: 'select',
      valueType: 'text',
      description:
        'Controls the renderer responsible for the visual of the terminal.',
      options: ['dom', 'webgl', 'canvas'],
    },
    scrollback: {
      label: 'Scrollback',
      type: 'input',
      valueType: 'number',
      description:
        'Controls the amount of rows that are retained beyond the initial viewport.',
      range: {
        min: 1,
        max: 50000,
        step: 1000,
      },
    },
    copyOnSelect: {
      label: 'Copy on select',
      type: 'checkbox',
      valueType: 'boolean',
      description: 'Whether to copy the text when it is selected.',
    },
    openOnStart: {
      label: 'Open a terminal on start',
      type: 'checkbox',
      valueType: 'boolean',
      description:
        'Whether to automatically open the default terminal on start.',
    },
  },
  'Command Line': {
    shell: {
      label: 'Default Shell',
      type: 'select',
      valueType: 'text',
      description: 'Controls the default shell to run for new child programs.',
      options: defaultProfiles
        .map(({ shell }) => shell)
        .filter(
          (shell, index, array) =>
            array.findIndex(value => value === shell) === index,
        ),
    },
    cwd: {
      label: 'Working Directory',
      type: 'input',
      valueType: 'text',
      description:
        'Controls the absolute path to be set for the child program.',
    },
    useConpty: {
      label: 'Use ConPTY',
      type: 'checkbox',
      valueType: 'boolean',
      description: 'Whether to use the experimental ConPTY API on Windows.',
    },
  },
};

export default schema;
