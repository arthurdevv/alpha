import { terms } from 'app/common/terminal';
import {
  CloseIcon,
  CopyIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  PasteIcon,
  RecordIcon,
  SearchIcon,
  SelectAllIcon,
  SplitHorizontalIcon,
  SplitVerticalIcon,
} from 'lib/components/Icons';

const initialSchema = [
  {
    label: 'Paste',
    command: 'terminal:paste',
    icon: PasteIcon(),
  },
  {
    label: 'Select All',
    command: 'terminal:selectAll',
    icon: SelectAllIcon(),
  },
];

const extendedSchema = [
  {
    label: 'Split Horizontal',
    command: 'pane:split-horizontal',
    icon: SplitHorizontalIcon(),
  },
  {
    label: 'Split Vertical',
    command: 'pane:split-vertical',
    icon: SplitVerticalIcon(),
  },
  {
    label: 'Close Pane',
    command: 'pane:close',
    icon: CloseIcon(),
  },
];

const interactionSchema = [
  {
    label: 'Expand Pane',
    command: 'pane:expand',
    icon: EnterFullScreenIcon(),
  },
  {
    label: 'Collapse Pane',
    command: 'pane:expand',
    icon: ExitFullScreenIcon(),
  },
  {
    label: 'Broadcast',
    command: 'pane:broadcast',
    icon: RecordIcon(),
  },
];

const extrasSchema = [
  {
    label: 'Search',
    command: 'terminal:search',
    icon: SearchIcon(),
  },
];

const selectionSchema = [
  {
    label: 'Copy',
    command: 'terminal:copy',
    icon: CopyIcon(),
  },
];

export default (
  { group, process, term }: ContextMenuSchemaState,
  isExtended: boolean,
) => {
  let schema: IContextMenuSchema[] = [];

  if (term) {
    if (term.hasSelection()) {
      schema = schema.concat(selectionSchema);
    }

    schema = schema.concat(initialSchema);

    if (isExtended) {
      schema = schema.concat(extrasSchema);

      if (group && group.children.length > 1) {
        const filteredSchema = interactionSchema.filter(
          ({ label }) =>
            label !==
            (process && process.isExpanded ? 'Expand Pane' : 'Collapse Pane'),
        );

        schema = schema.concat(filteredSchema);
      }

      schema = schema.concat(extendedSchema);

      if (process && process.isExpanded) {
        schema = schema.filter(
          ({ label }) => label !== 'Broadcast' && !label.includes('Split'),
        );
      }
    }
  }

  return schema;
};
