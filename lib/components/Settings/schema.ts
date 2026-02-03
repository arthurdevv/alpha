import { listThemes } from 'app/common/themes';

export default {
  Application: {
    Default: {
      language: {
        name: 'Language',
        label: 'Alpha will be displayed in this language.',
        type: 'string',
        input: 'select',
        options: [
          'Automatic',
          'English',
          'Português do Brasil',
          'Español',
          'Français',
          'Deutsch',
        ],
        values: ['auto', 'en-US', 'pt-BR', 'es-ES', 'fr-FR', 'de-DE'],
        badges: ['Restart required'],
      },
      autoUpdates: {
        name: 'Automatic updates',
        label:
          'Whether to automatically install an update when it is available.',
        type: 'boolean',
        input: 'checkbox',
      },
      enableAnalytics: {
        name: 'Help improve Alpha',
        label:
          'Whether crash reports and error diagnostics are shared to help improve Alpha’s stability.',
        type: 'boolean',
        input: 'checkbox',
        badges: ['Restart required'],
      },
    },
  },
  Appearance: {
    Text: {
      fontSize: {
        name: 'Font size',
        label: 'Controls the font size in pixels.',
        type: 'number',
        input: 'text',
        range: { min: '1', max: '99', step: '1' },
      },
      fontFamily: {
        name: 'Font family',
        label: 'Controls the font family.',
        type: 'string',
        input: 'text',
      },
      fontWeight: {
        name: 'Font weight',
        label: 'Controls the font weight.',
        type: 'number',
        input: 'select',
        options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        values: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      fontWeightBold: {
        name: 'Bold font weight',
        label: 'Controls the font weight used to render bold text.',
        type: 'number',
        input: 'select',
        options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        values: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      drawBoldTextInBrightColors: {
        name: 'Bold text in bright colors',
        label: 'Whether to draw bold text in bright colors.',
        type: 'boolean',
        input: 'checkbox',
      },
      fontLigatures: {
        name: 'Font ligatures',
        label: 'Whether to use font ligatures.',
        type: 'boolean',
        input: 'checkbox',
      },
      lineHeight: {
        name: 'Line height',
        label: 'Controls the line height.',
        input: 'text',
        type: 'number',
        range: { min: '1', max: '99', step: '0.1' },
      },
      letterSpacing: {
        name: 'Letter spacing',
        label: 'Controls the spacing in whole pixels between characters.',
        type: 'number',
        input: 'text',
        range: { min: '-10', max: '10', step: '0.1' },
      },
      minimumContrastRatio: {
        name: 'Minimum contrast ratio',
        label: 'Controls the minimum contrast ratio for text in the terminal.',
        type: 'number',
        input: 'text',
        range: { min: '1', max: '21', step: '1' },
      },
    },
    Cursor: {
      cursorStyle: {
        name: 'Cursor style',
        label: 'Controls the style of cursor.',
        type: 'string',
        input: 'select',
        options: ['|', '█', '__'],
        values: ['bar', 'block', 'underline'],
      },
      cursorBlink: {
        name: 'Cursor blinking',
        label: 'Whether the cursor blinks.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
    Colors: {
      theme: {
        name: 'Theme',
        label: 'Controls the color theme of the terminal.',
        type: 'string',
        input: 'select',
        options: listThemes(),
        values: listThemes(true),
      },
      preserveBackground: {
        name: 'Preserve background',
        label:
          "Whether the terminal preserves Alpha's default background color.",
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
  Terminal: {
    Rendering: {
      renderer: {
        name: 'Renderer',
        label: 'Controls the terminal-based rendering.',
        type: 'string',
        input: 'select',
        options: ['Default', 'WebGL', 'Canvas'],
        values: ['default', 'webgl', 'canvas'],
      },
      scrollback: {
        name: 'Scrollback',
        label: 'Controls the amount of rows beyond the initial viewport.',
        type: 'number',
        input: 'text',
        range: { min: '0', max: '50000', step: '1' },
      },
    },
    Interaction: {
      scrollOnUserInput: {
        name: 'Scroll on input',
        label: 'Whether to scroll to the bottom on user input.',
        type: 'boolean',
        input: 'checkbox',
      },
      rightClick: {
        name: 'Right click',
        label: 'Controls the terminal action triggered by right click.',
        type: 'string',
        input: 'select',
        options: [
          'Disabled',
          'Context menu',
          'Paste text from clipboard, otherwise copy selection',
        ],
        values: [false, 'contextmenu', 'clipboard'],
      },
      linkHandlerKey: {
        name: 'Link modifier',
        label: 'Controls the key modifier required to activate links.',
        type: 'string',
        input: 'select',
        options: ['None', 'Ctrl', 'Shift', 'Alt', 'Meta'],
        values: [false, 'ctrl', 'shift', 'alt', 'meta'],
      },
    },
    Selection: {
      copyOnSelect: {
        name: 'Copy on select',
        label: 'Whether to copy the text when it is selected.',
        type: 'boolean',
        input: 'checkbox',
      },
      trimSelection: {
        name: 'Trim whitespaces',
        label: 'Whether to remove trailing whitespaces from copied selection.',
        type: 'boolean',
        input: 'checkbox',
      },
      wordSeparators: {
        name: 'Word separators',
        label: 'Controls the separator symbols for double-click selection.',
        type: 'string',
        input: 'text',
      },
    },
    Panes: {
      focusOnHover: {
        name: 'Focus on hover',
        label: 'Whether to automatically focus the pane when hovered.',
        type: 'boolean',
        input: 'checkbox',
      },
      preserveCWD: {
        name: 'Preserve working directory',
        label: 'Whether to preserve current directory when creating splits.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
    Startup: {
      openOnStart: {
        name: 'Open a terminal at startup',
        label: 'Whether to automatically open the default profile.',
        type: 'boolean',
        input: 'checkbox',
      },
      restoreOnStart: {
        name: 'Restore previous session at startup',
        label: 'Whether to restore the closed terminal tabs.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
  Profiles: {
    Default: {
      defaultProfile: {
        name: 'Default profile',
        label: 'Controls the default profile for new terminals.',
        type: 'string',
        input: 'select',
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
        badges: ['Restart required'],
      },
      opacity: {
        name: 'Opacity',
        label: 'Controls the opacity of the window.',
        type: 'number',
        input: 'text',
        range: { min: '0.5', max: '1', step: '0.01' },
      },
    },
    Layout: {
      tabWidth: {
        name: 'Tab width',
        label: 'Controls the tabs width mode.',
        type: 'string',
        input: 'select',
        options: ['Auto', 'Fixed'],
        values: ['auto', 'fixed'],
      },
      newTabPosition: {
        name: 'New tab position',
        label: 'Controls where new tabs are added in the tab row.',
        type: 'string',
        input: 'select',
        options: ['After current tab', 'End of the row'],
        values: ['current', 'end'],
      },
      contextMenuStyle: {
        name: 'Context menu style',
        label: 'Controls the visual style of the context menu.',
        type: 'string',
        input: 'select',
        options: ['Minimal', 'Detailed'],
        values: ['minimal', 'detailed'],
      },
    },
    Behavior: {
      onSecondInstance: {
        name: 'Instance behavior',
        label: 'Controls the behavior of new instances of the application.',
        type: 'string',
        input: 'select',
        options: ['Create new window', 'Attach to existing window'],
        values: ['create', 'attach'],
        badges: ['Restart required'],
      },
      alwaysOnTop: {
        name: 'Always on top',
        label: 'Whether the window should stay on top of other windows.',
        type: 'boolean',
        input: 'checkbox',
      },
      autoHideOnBlur: {
        name: 'Automatically hide window',
        label:
          'Whether to automatically hide window when switch to another window.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
    Launch: {
      launchMode: {
        name: 'Launch mode',
        label: 'Controls the initial display mode of the window.',
        type: 'string',
        input: 'select',
        options: ['Default', 'Maximized', 'Full screen'],
        values: ['default', 'maximized', 'fullscreen'],
      },
      centerOnLaunch: {
        name: 'Center on launch',
        label: 'Whether to show window in the center of the screen on launch.',
        type: 'boolean',
        input: 'checkbox',
      },
    },
  },
  Workspaces: {
    Default: {
      workspace: {
        name: 'Workspace',
        label: 'Controls the workspace loaded at startup.',
        type: 'string',
        input: 'select',
      },
    },
  },
  'Config file': {},
} as Record<Section, Record<string, Record<string, ISettingsOption>>>;
