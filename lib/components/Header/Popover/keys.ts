export default (label: string): string[] => {
  switch (label) {
    case 'New Terminal':
      return isMac ? ['⌘', 't'] : ['Ctrl', '⇧', 't'];

    case 'Settings':
      return isMac ? ['⌘', ','] : ['Ctrl', ','];

    case 'Minimize':
      return isMac ? ['⌘', 'm'] : ['Ctrl', '⇧', 'm'];

    case 'Close':
      return isMac ? ['⌘', '⇧', 'w'] : ['Alt', 'f4'];

    case 'Close Terminal':
    case 'Close Settings':
      return isMac ? ['⌘', 'w'] : ['Ctrl', '⇧', 'w'];
  }

  return [];
};
