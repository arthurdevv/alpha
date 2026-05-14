const commandMap: Record<string, Record<string, string[]>> = {
  app: {
    modal: ['commands', 'profiles', 'keymaps'],
  },
  connection: {
    action: ['disconnect', 'reconnect'], // TODO
  },
  pane: {
    action: ['broadcast', 'collapse', 'expand'], // TODO
    focus: ['next', 'previous'],
    split: ['horizontal', 'vertical'],
    resize: ['up', 'right', 'down', 'left'],
  },
  process: {
    action: ['clear', 'kill'], // TODO
  },
  tab: {
    action: ['color', 'duplicate', 'rename', 'reopen-closed'],
    navigate: ['next', 'previous'],
    // close: ['close', 'others', 'to-right'],
  },
  terminal: {
    action: ['clear', 'copy', 'focus', 'paste', 'select-all', 'write'],
    modal: ['search', 'history', 'snippets'],
  },
};

export function resolveCommand(command: string): [string, string | null] {
  const [scope, action] = command.split(':');
  const map = commandMap[scope];

  if (map) {
    for (const [key, values] of Object.entries(map)) {
      const match = values.find(v => action.includes(v));
      if (match) return [`${scope}:${key}`, match];
    }
  }

  return [command, null];
}
