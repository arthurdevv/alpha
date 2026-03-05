export default {
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
  },
  enableAnalytics: {
    name: 'Help improve Alpha',
    label:
      'Whether crash reports and error diagnostics are shared to help improve Alpha’s stability.',
    type: 'boolean',
    input: 'checkbox',
    options: [],
    values: [],
  },
} as Record<string, Required<Omit<ISettingsOption, 'range' | 'badges'>>>;
