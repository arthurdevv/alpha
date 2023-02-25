import { h } from 'preact';
import { memo } from 'preact/compat';

import { Group } from './styles';
import Tab from './element';

const TabGroup: React.FC<TabGroupProps> = (props: TabGroupProps) => {
  const { tabs } = props;

  return (
    <Group role="group">
      {tabs.map((tab: ITab) => {
        const { id, title, isCurrent } = tab;

        const mappedProps: TabProps = {
          isCurrent,
          title: title || 'Terminal',
          onSelect: props.onSelect.bind(null, id),
          onClose: props.onClose.bind(null, id),
        };

        return <Tab {...mappedProps} key={id} />;
      })}
    </Group>
  );
};

export default memo(TabGroup);
