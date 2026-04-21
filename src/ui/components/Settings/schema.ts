import type { SettingsSchema } from 'ui/types';

const schema: SettingsSchema = {
  Application: [
    {
      key: 'language',
      name: 'Language',
      description: 'Alpha will be displayed in this language.',
      input: 'select',
      options: [
        { label: 'Automatic', value: 'auto' },
        { label: 'English', value: 'en-US' },
        { label: 'Português do Brasil', value: 'pt-BR' },
        { label: 'Español', value: 'es-ES' },
        { label: 'Français', value: 'fr-FR' },
        { label: 'Deutsch', value: 'de-DE' },
        { label: '日本語', value: 'ja-JP' },
        { label: '한국어', value: 'ko-KR' },
        { label: 'Русский', value: 'ru-RU' },
        { label: '中文', value: 'zh-CN' },
      ],
      badges: [{ label: 'Restart required', type: 'warning' }],
    },
    {
      key: 'autoUpdates',
      name: 'Automatic updates',
      description: 'Whether to automatically install an update when it is available.',
      input: 'checkbox',
    },
    {
      key: 'enableAnalytics',
      name: 'Help improve Alpha',
      description:
        'Whether crash reports and error diagnostics are shared to help improve Alpha’s stability.',
      input: 'checkbox',
      badges: [{ label: 'Restart required', type: 'warning' }],
    },
  ],

  Appearance: [
    { title: 'Text' },

    {
      key: 'fontSize',
      name: 'Font size',
      description: 'Sets the size of the text in pixels.',
      input: 'number',
      range: { min: 1, max: 50, step: 1 },
    },
    {
      key: 'fontFamily',
      name: 'Font family',
      description: 'Sets the font used to render text.',
      input: 'text',
    },
    {
      key: 'fontWeight',
      name: 'Font weight',
      description: 'Adjusts the thickness of the text.',
      input: 'range',
      range: { min: 100, max: 900, step: 100, type: 'number' },
    },
    {
      key: 'fontWeightBold',
      name: 'Bold font weight',
      description: 'Sets the weight used for bold text.',
      input: 'range',
      range: { min: 100, max: 900, step: 100, type: 'number' },
    },
    {
      key: 'drawBoldTextInBrightColors',
      name: 'Bold text in bright colors',
      description: 'Displays bold text using brighter colors.',
      input: 'checkbox',
    },
    {
      key: 'fontLigatures',
      name: 'Font ligatures',
      description: 'Enables combined character glyphs for supported fonts.',
      input: 'checkbox',
    },
    {
      key: 'lineHeight',
      name: 'Line height',
      description: 'Adjusts the vertical spacing between lines.',
      input: 'number',
      range: { min: -100, max: 100, step: 1 },
    },
    {
      key: 'letterSpacing',
      name: 'Letter spacing',
      description: 'Adjusts the spacing between characters.',
      input: 'number',
      range: { min: -100, max: 100, step: 0.1 },
    },
    {
      key: 'minimumContrastRatio',
      name: 'Minimum contrast ratio',
      description: 'Ensures text maintains a minimum contrast level.',
      input: 'range',
      range: { min: 1, max: 21, step: 0.5, type: 'number' },
    },

    { title: 'Cursor' },

    {
      key: 'cursorStyle',
      name: 'Cursor style',
      description: 'Sets the appearance of the cursor.',
      input: 'segmented',
      options: [
        { label: '█', value: 'block' },
        { label: '|', value: 'bar' },
        { label: '_', value: 'underline' },
      ],
    },
    {
      key: 'cursorBlink',
      name: 'Cursor blinking',
      description: 'Enables cursor blinking.',
      input: 'checkbox',
    },

    { title: 'Colors' },

    {
      key: 'theme',
      name: 'Theme',
      description: 'Sets the color theme of the terminal.',
      input: 'select',
      options: [{ label: 'Default', value: 'default' }],
    },
    {
      key: 'preserveBackground',
      name: 'Preserve background',
      description: "Keeps Alpha's default background color in the terminal.",
      input: 'checkbox',
    },
  ],

  Terminal: [
    { title: 'Rendering' },

    {
      key: 'renderer',
      name: 'Renderer',
      description: 'Sets the rendering engine used by the terminal.',
      input: 'segmented',
      options: [
        { label: 'DOM', value: 'dom' },
        { label: 'WebGL', value: 'webgl' },
        { label: 'Canvas', value: 'canvas' },
      ],
    },
    {
      key: 'scrollback',
      name: 'Scrollback',
      description: 'Sets how many lines are kept in history.',
      input: 'number',
      range: { min: 0, max: 50000, step: 100 },
    },

    { title: 'Interaction' },

    {
      key: 'scrollOnUserInput',
      name: 'Scroll on input',
      description: 'Scrolls to the bottom when typing.',
      input: 'checkbox',
    },
    {
      key: 'rightClick',
      name: 'Right click',
      description: 'Sets the action for right-click in the terminal.',
      input: 'select',
      options: [
        { label: 'Disabled', value: null },
        { label: 'Context menu', value: 'contextmenu' },
        { label: 'Paste or copy', value: 'clipboard' },
      ],
    },
    {
      key: 'linkHandlerKey',
      name: 'Link modifier',
      description: 'Sets the key required to open links.',
      input: 'segmented',
      options: [
        { label: 'None', value: null },
        { label: 'Ctrl', value: 'ctrl' },
        { label: 'Shift', value: 'shift' },
        { label: 'Alt', value: 'alt' },
      ],
    },

    { title: 'Selection' },

    {
      key: 'copyOnSelect',
      name: 'Copy on select',
      description: 'Copies text automatically when selected.',
      input: 'checkbox',
    },
    {
      key: 'trimSelection',
      name: 'Trim whitespaces',
      description: 'Removes trailing spaces when copying text.',
      input: 'checkbox',
    },
    {
      key: 'wordSeparators',
      name: 'Word separators',
      description: 'Defines characters that split words on double-click.',
      input: 'text',
    },

    { title: 'Panes' },

    {
      key: 'focusOnHover',
      name: 'Focus on hover',
      description: 'Focuses a pane when hovering over it.',
      input: 'checkbox',
    },
    {
      key: 'preserveCWD',
      name: 'Preserve working directory',
      description: 'Keeps the current directory when splitting panes.',
      input: 'checkbox',
    },

    { title: 'Indicators' },

    {
      key: 'indicatorsMode',
      name: 'Status indicators',
      description: 'Sets when terminal status indicators are shown.',
      input: 'segmented',
      options: [
        { label: 'Always', value: 'always' },
        { label: 'On hover', value: 'hover' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },
    {
      key: 'gitStatus',
      name: 'Git indicators',
      description: 'Shows the current Git branch and status.',
      input: 'checkbox',
    },

    { title: 'Zen mode' },

    {
      key: 'showTabs',
      name: 'Show tabs',
      description: 'Sets tab visibility in zen mode.',
      input: 'segmented',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Multiple', value: 'multiple' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },
    {
      key: 'hideIndicators',
      name: 'Hide indicators',
      description: 'Hides terminal indicators in zen mode.',
      input: 'checkbox',
    },

    { title: 'Startup' },

    {
      key: 'openOnStart',
      name: 'Open a terminal at startup',
      description: 'Opens the default profile on startup.',
      input: 'checkbox',
    },
    {
      key: 'restoreOnStart',
      name: 'Restore previous session at startup',
      description: 'Restores previously open terminals on startup.',
      input: 'checkbox',
    },
  ],

  Profiles: [
    { title: 'Profiles' },

    {
      key: 'defaultProfile',
      name: 'Default profile',
      description: 'Sets the profile for new terminals.',
      input: 'select',
      options: [],
    },
  ],

  Keymaps: [{ title: 'Keymaps' }],

  Window: [
    { title: 'Transparency' },

    {
      key: 'acrylic',
      name: 'Acrylic background',
      description: 'Enables a translucent window background.',
      input: 'checkbox',
      badges: [{ label: 'Restart required', type: 'warning' }],
    },
    {
      key: 'opacity',
      name: 'Opacity',
      description: 'Adjusts the window transparency.',
      input: 'range',
      range: { min: 0.5, max: 1, step: 0.01, type: 'percentage' },
    },

    { title: 'Layout' },

    {
      key: 'tabWidth',
      name: 'Tab width',
      description: 'Sets how tab width is determined.',
      input: 'segmented',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Fixed', value: 'fixed' },
      ],
    },
    {
      key: 'newTabPosition',
      name: 'New tab position',
      description: 'Sets where new tabs are placed.',
      input: 'select',
      options: [
        { label: 'After current tab', value: 'after-current' },
        { label: 'End of the row', value: 'end' },
      ],
    },
    {
      key: 'contextMenuStyle',
      name: 'Context menu style',
      description: 'Sets the appearance of the context menu.',
      input: 'segmented',
      options: [
        { label: 'Minimal', value: 'minimal' },
        { label: 'Detailed', value: 'detailed' },
      ],
    },

    { title: 'Behavior' },

    {
      key: 'onSecondInstance',
      name: 'Instance behavior',
      description: 'Sets how new app instances are handled.',
      input: 'select',
      options: [
        { label: 'Create new window', value: 'new-window' },
        { label: 'Attach to existing window', value: 'attach' },
      ],
      badges: [{ label: 'Restart required', type: 'warning' }],
    },
    {
      key: 'alwaysOnTop',
      name: 'Always on top',
      description: 'Keeps the window above other windows.',
      input: 'checkbox',
    },
    {
      key: 'autoHideOnBlur',
      name: 'Automatically hide window',
      description: 'Hides the window when switching to another app.',
      input: 'checkbox',
    },

    { title: 'Launch' },

    {
      key: 'launchMode',
      name: 'Launch mode',
      description: 'Sets the initial window display mode.',
      input: 'segmented',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Maximized', value: 'maximized' },
        { label: 'Full screen', value: 'fullscreen' },
      ],
    },
    {
      key: 'centerOnLaunch',
      name: 'Center on launch',
      description: 'Centers the window on the screen when opened.',
      input: 'checkbox',
    },
  ],

  Workspaces: [
    { title: 'Workspaces' },

    {
      key: 'workspace',
      name: 'Workspace',
      description: 'Sets the workspace loaded at startup.',
      input: 'select',
      options: [{ label: 'None', value: null }],
    },
  ],

  'Config file': [{ title: 'Config file' }],
};

export default schema;
