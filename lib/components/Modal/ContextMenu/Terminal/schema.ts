import { terms } from 'app/common/terminal';
import {
  ArrowLeft,
  BlankIcon,
  CloseIcon,
  CopyIcon,
  DisconnectIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  GridIcon,
  PasteIcon,
  ReconnectIcon,
  RecordIcon,
  SearchIcon,
  SelectAllIcon,
  SplitHorizontalIcon,
  SplitVerticalIcon,
  TriangleRight,
} from 'lib/components/Icons';

const initialSchema = [
  {
    label: 'Copy',
    command: 'terminal:copy',
    icon: CopyIcon(),
  },
  {
    label: 'Paste',
    command: 'terminal:paste',
    icon: PasteIcon(),
  },
  {
    label: 'Select all',
    command: 'terminal:select-all',
    icon: SelectAllIcon(),
  },
  { label: 'separator', command: ':', icon: BlankIcon() },
];

const extendedSchema = [
  {
    label: 'Split',
    command: 'menu:split',
    icon: GridIcon(),
    submenu: TriangleRight(),
  },
  { label: 'separator', command: ':', icon: BlankIcon() },
  {
    label: 'Close pane',
    command: 'pane:close',
    icon: CloseIcon({ vb: '15' }),
  },
];

const splitSchema = [
  {
    label: 'Back',
    command: 'menu:split',
    icon: ArrowLeft(),
  },
  { label: 'separator', command: ':', icon: BlankIcon() },
  {
    label: 'Split horizontal',
    command: 'pane:split-horizontal',
    icon: SplitHorizontalIcon(),
  },
  {
    label: 'Split vertical',
    command: 'pane:split-vertical',
    icon: SplitVerticalIcon(),
  },
];

const interactionSchema = [
  {
    label: 'Expand pane',
    command: 'pane:expand',
    icon: EnterFullScreenIcon(),
  },
  {
    label: 'Collapse pane',
    command: 'pane:collapse',
    icon: ExitFullScreenIcon(),
  },
  {
    label: 'Broadcast',
    command: 'pane:broadcast',
    icon: RecordIcon(),
  },
  { label: 'separator', command: ':', icon: BlankIcon() },
];

const extrasSchema = [
  {
    label: 'Search',
    command: 'terminal:search',
    icon: SearchIcon(),
  },
];

const connectionSchema = [
  {
    label: 'Disconnect',
    command: 'process:disconnect',
    icon: DisconnectIcon({ vb: '15 15' }),
  },
  {
    label: 'Reconnect',
    command: 'process:reconnect',
    icon: ReconnectIcon(),
  },
];

export default (
  {
    store: {
      context,
      instances,
      current: { origin },
    },
  }: ModalProps,
  isExtended: boolean,
  isMinimal: boolean,
  isSubmenu: boolean,
) => {
  const term = global.id ? terms[global.id] : null;
  const group = origin ? context[origin] : null;
  const instance = global.id ? instances[global.id] : null;

  let schema: IContextMenuSchema[] = [];

  if (term && group && instance) {
    if (instance?.profile.type !== 'shell') {
      schema = schema.concat(connectionSchema);
    } else {
      schema = schema.concat(initialSchema);
    }

    if (!term.hasSelection) {
      schema = schema.filter(({ command }) => command !== 'terminal:copy');
    }

    if (isExtended || !isMinimal) {
      schema = schema.concat(extrasSchema);

      if (group.children.length > 1) {
        let filteredSchema: IContextMenuSchema[] = [...interactionSchema];

        if (instance.isExpanded) {
          filteredSchema = filteredSchema.filter(
            ({ command }) =>
              !['pane:expand', 'pane:broadcast', ':'].includes(command),
          );
        } else {
          filteredSchema = filteredSchema.filter(
            ({ command }) => !['pane:collapse'].includes(command),
          );
        }

        schema = schema.concat(filteredSchema);
      }

      schema = schema.concat(extendedSchema);

      if (instance.isExpanded) {
        schema = schema.filter(({ command }) => command !== 'menu:split');
      }
    }

    if (isSubmenu) {
      schema = [...splitSchema];
    }

    if (isMinimal) {
      schema = schema.filter(({ command }) => command !== ':');
    }
  }

  return schema;
};
