import {
  BlankIcon,
  CloseAllIcon,
  CloseIcon,
  CloseRightIcon,
  DuplicateIcon,
  HistoryIcon,
  PaletteIcon,
  RenameIcon,
} from 'lib/components/Icons';

const initialSchema = [
  {
    label: 'Rename tab',
    command: 'tab:rename',
    icon: RenameIcon,
  },
  {
    label: 'Duplicate tab',
    command: 'tab:duplicate',
    icon: DuplicateIcon,
  },
  {
    label: 'Color tab',
    command: 'tab:color',
    icon: PaletteIcon,
  },
  { label: 'separator', command: ':', icon: BlankIcon },
  {
    label: 'Reopen closed tab',
    command: 'tab:reopen-closed',
    icon: HistoryIcon,
  },
];

const extendedSchema = [
  {
    label: 'Close tab',
    command: 'tab:close',
    icon: () => CloseIcon({ vb: '15' }),
  },
  {
    label: 'Close other tabs',
    command: 'tab:close-others',
    icon: CloseAllIcon,
  },
  {
    label: 'Close tabs to the right',
    command: 'tab:close-right',
    icon: CloseRightIcon,
  },
];

export default (
  { context, session }: AlphaStore,
  isExtended: boolean,
  isMinimal: boolean,
) => {
  const tab = global.id ? context[global.id] : null;

  let schema: IContextMenuSchema[] = [];

  if (tab) {
    schema = schema.concat(initialSchema);

    const tabs = Object.keys(context);

    if (isExtended || !isMinimal) schema = schema.concat(extendedSchema);

    if (isMinimal) {
      schema = schema.filter(({ label }) => label !== 'separator');
    }

    if (/settings/i.test(tab.id)) {
      schema = schema.filter(({ command }) => command !== 'tab:duplicate');
    }

    if (tabs.length === 1) {
      schema = schema.filter(({ command }) => !/close-/i.test(command));
    }

    if (tab.id === tabs[tabs.length - 1]) {
      schema = schema.filter(({ command }) => command !== 'tab:close-right');
    }

    if (
      !session.group ||
      session.instances.length === 0 ||
      (session.group &&
        /settings/i.test(session.group.id) &&
        'Settings' in context)
    ) {
      schema = schema.filter(({ command }) => command !== 'tab:reopen-closed');
    }
  }

  return schema;
};
