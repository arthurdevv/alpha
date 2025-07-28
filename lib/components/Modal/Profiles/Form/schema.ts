export default {
  shell: {
    general: [
      {
        key: 'group',
        label: 'Group',
        description: 'Name of the group to appear in the profiles list.',
        type: 'text',
      },
      {
        key: 'shell',
        label: 'Command Line',
        description: 'Path to the executable to be launched for the profile.',
        type: 'text',
      },
      {
        key: 'cwd',
        label: 'Working Directory',
        description: 'Absolute path where the executable will be run.',
        type: 'text',
      },
      {
        key: 'title',
        label: 'Tab Title',
        description: 'Sets the tab title to match the profile name.',
        type: 'checkbox',
      },
    ],
    environment: {
      key: 'env',
      inputs: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'value', label: 'Value', type: 'text' },
      ],
      placeholder: 'No variables added',
    },
  },
  ssh: {
    general: [
      {
        key: 'group',
        label: 'Group',
        description: 'Name of the group to appear in the profiles list.',
        type: 'text',
      },
      {
        key: 'host',
        label: 'Host',
        description: 'Hostname or IP address of the server.',
        type: 'text',
      },
      {
        key: 'port',
        label: 'Port',
        description: 'Port number of the server.',
        type: 'number',
      },
      {
        key: 'username',
        label: 'Username',
        description: 'Username for authentication.',
        type: 'text',
      },
      {
        key: 'authType',
        label: 'Authentication method',
        description: 'Method used to authenticate the connection.',
        type: 'selector',
        options: ['Agent', 'Password', 'Interactive', 'Private Key'],
        values: ['agent', 'password', 'keyboard-interactive', 'publickey'],
      },
      { key: 'password' },
      { key: 'keyPath' },
    ],
    advanced: [
      {
        key: 'agentForward',
        label: 'Agent forward',
        description:
          'Whether to use OpenSSH agent forwarding (auth-agent@openssh.com).',
        type: 'checkbox',
      },
      {
        key: 'x11',
        label: 'X11',
        description:
          'Whether to enable x11 forwarding for remote graphical applications.',
        type: 'checkbox',
      },
      {
        key: 'message',
        label: 'Ignore messages',
        description:
          'Whether to ignore the connection banner and greeting messages.',
        type: 'checkbox',
      },
      {
        key: 'keepaliveInterval',
        label: 'Keep alive interval',
        description:
          'How often to send SSH-level keepalive packets to the server.',
        type: 'number',
      },
      {
        key: 'keepaliveCountMax',
        label: 'Keep alive count max',
        description:
          'Number of consecutive unanswered SSH keepalive packets before disconnection.',
        type: 'number',
      },
    ],
    ports: {
      key: 'ports',
      inputs: [
        { key: 'type', label: 'Type', type: 'selector' },
        { key: 'host', label: 'Host', type: 'text' },
        { key: 'port', label: 'Port', type: 'number' },
        { key: 'fwHost', label: 'Forward Host', type: 'text' },
        { key: 'fwPort', label: 'Forward Port', type: 'number' },
      ],
      value: {
        local: { host: '127.0.0.1', port: 0, fwHost: '0.0.0.0', fwPort: 22 },
        remote: { host: '0.0.0.0', port: 0, fwHost: '127.0.0.1', fwPort: 22 },
        dynamic: { host: '127.0.0.1', port: 1080 },
      },
      selectors: ['Local', 'Remote', 'Dynamic'],
      placeholder: 'No ports added',
    },
    scripts: {
      key: 'scripts',
      inputs: [
        { key: 'type', label: 'Type', type: 'selector' },
        { key: 'match', label: 'Match', type: 'text' },
        { key: 'execute', label: 'Execute', type: 'text' },
      ],
      selectors: ['Exact', 'Regex'],
      placeholder: 'No scripts added',
    },
  },
  serial: {
    general: [
      {
        key: 'group',
        label: 'Group',
        description: 'Name of the group to appear in the profiles list.',
        type: 'text',
      },
      {
        key: 'path',
        label: 'Path',
        description: 'System path of the serial port to open.',
        type: 'text',
      },
      {
        key: 'baudRate',
        label: 'Baud Rate',
        description: 'Baud rate of the port to be opened.',
        type: 'selector',
        options: [
          110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200,
        ],
        values: [
          110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200,
        ],
      },
      {
        key: 'newlineMode',
        label: 'Newline Mode',
        description: 'Line-ending characters appended to outgoing data.',
        type: 'selector',
        options: ['Default', 'LF', 'CR', 'CRLF'],
        values: ['default', 'lf', 'cr', 'crlf'],
      },
      {
        key: 'inputBehavior',
        label: 'Input Behavior',
        description: 'Behavior of the parser for incoming serial data.',
        type: 'selector',
        options: ['Default', 'Line by Line', 'Hexadecimal'],
        values: ['utf8', 'line-by-line', 'hex'],
      },
      {
        key: 'outputBehavior',
        label: 'Output Behavior',
        description: 'Behavior of the parser for outgoing serial data.',
        type: 'selector',
        options: ['Default', 'Hexadecimal'],
        values: ['utf8', 'hex'],
      },
    ],
    advanced: [
      {
        key: 'dataBits',
        label: 'Data Bits',
        description: 'Number of data bits in each transmitted character.',
        type: 'selector',
        options: [5, 6, 7, 8],
        values: [5, 6, 7, 8],
      },
      {
        key: 'stopBits',
        label: 'Stop Bits',
        description: 'Number of stop bits signaling the end of a character.',
        type: 'selector',
        options: [1, 1.5, 2],
        values: [1, 1.5, 2],
      },
      {
        key: 'parity',
        label: 'Parity',
        description: 'Number of stop bits signaling the end of a character.',
        type: 'selector',
        options: ['None', 'Even', 'Odd'],
        values: ['none', 'even', 'odd'],
      },
      {
        key: 'rtscts',
        label: 'RTS / CTS',
        description:
          'Whether enables hardware flow control using RTS/CTS signals.',
        type: 'checkbox',
      },
      {
        key: 'xon',
        label: 'XON',
        description: 'Whether enables XON signal to resume data flow.',
        type: 'checkbox',
      },
      {
        key: 'xoff',
        label: 'XOFF',
        description: 'Whether enables XOFF signal to pause data flow.',
        type: 'checkbox',
      },
      {
        key: 'xany',
        label: 'XANY',
        description: 'Whether resumes data flow on any received character.',
        type: 'checkbox',
      },
    ],
    scripts: {
      key: 'scripts',
      inputs: [
        { key: 'type', label: 'Type', type: 'selector' },
        { key: 'match', label: 'Match', type: 'text' },
        { key: 'execute', label: 'Execute', type: 'text' },
      ],
      selectors: ['Exact', 'Regex'],
      placeholder: 'No scripts added',
    },
  },
} as const;
