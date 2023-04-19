const schema: Record<string, ISettingsKey> = {
  Application: {
    language: {
      label: 'Language',
      type: 'select',
      valueType: 'text',
      description: 'Alpha display will appear in this language.',
      options: ['English (US)'],
    },
    autoUpdates: {
      label: 'Automatic Updates',
      type: 'checkbox',
      valueType: 'boolean',
      description:
        'Whether to automatically download an update when it is available.',
    },
    alwaysOnTop: {
      label: 'Always On Top',
      type: 'checkbox',
      valueType: 'boolean',
      description:
        'Whether the window should always stay on top of other windows.',
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
  'Command Line': {
    cwd: {
      label: 'Working Directory',
      type: 'input',
      valueType: 'text',
      description: 'Absolute path to be set for the child program.',
    },
    useConpty: {
      label: 'Use ConPTY',
      type: 'checkbox',
      valueType: 'boolean',
      description: 'Whether to use the ConPTY API on Windows.',
    },
  },
};

export { schema };
