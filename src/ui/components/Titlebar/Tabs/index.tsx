import { cx } from '@linaria/core';
import { useEffect, useMemo, useReducer, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';

import { useFormattedKeymaps } from 'ui/hooks/useFormattedKeymaps';
import { useAppStore } from 'ui/store/app/store';
import { useTermsStore } from 'ui/store/terms/store';
import { local, session } from 'ui/utils/storage';

import { CloseTabIcon, DotsIcon } from 'components/Icons';
import Tooltip from 'components/Tooltip';

import { Action, Container, List, Mask, Title } from './styles';

interface TabProps {
  id: UUID;
  title: string;
  type: 'terminal' | 'settings';
  isCurrent: boolean;
}

interface TabState {
  isClosing: boolean;
  color: string;
}

export default function Tabs() {
  const { tabs, origin } = useTermsStore(useShallow(s => ({ tabs: s.tabs, origin: s.origin })));

  const tabsList = useMemo(() => Object.values(tabs), [tabs]);

  useEffect(() => {
    console.log({ tabs, origin });
  }, [tabs, origin]);

  return (
    <List role="tablist">
      {tabsList.map(({ id, title, type }) => (
        <Tab key={id} id={id} title={title} type={type} isCurrent={id === origin} />
      ))}
    </List>
  );
}

function Tab({ id, title, type, isCurrent }: TabProps) {
  const tabWidth = useAppStore(s => s.settings.tabWidth);
  const { selectTab, closeTab } = useTermsStore(
    useShallow(s => ({ selectTab: s.selectTab, closeTab: s.closeTab })),
  );

  const formattedKeymaps = useFormattedKeymaps();
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(
    (prev: TabState, next: Partial<TabState>) => ({ ...prev, ...next }),
    undefined,
    () => {
      const color = local.parse('tab-colors')[id];
      return { isClosing: false, color: color || '#00000000' };
    },
  );

  const handleSelect = () => {
    selectTab(id);
    ipc.window.action('setTitle', title);
  };

  const handleClose = (event: MouseEvent) => {
    event.stopPropagation();
    closeTab(id);
    dispatch({ isClosing: true });
  };

  const handleContextMenu = (event: MouseEvent) => {
    session.update('menu', { id, top: event.clientY, left: event.clientX });
    // global.handleModal(undefined, 'TabContextMenu', { on: 1, off: 1 });
  };

  const handleTransitionEnd = ({ target, currentTarget, propertyName }) => {
    if (target !== currentTarget || propertyName !== 'width') return;
    if (state.isClosing) closeTab(id);
  };

  useEffect(() => {
    const handleColorChange = () => {
      const colors = local.parse('tab-colors');
      dispatch({ color: colors[id] || '#00000000' });
    };

    window.addEventListener('tab:color', handleColorChange);

    return () => window.removeEventListener('tab:color', handleColorChange);
  }, [id]);

  return (
    <Container
      role="tab"
      className={cx(isCurrent && 'current', tabWidth)}
      onClick={handleSelect}
      onContextMenu={handleContextMenu}
      onTransitionEnd={handleTransitionEnd}
      style={{ '--indicator': state.color }}
    >
      <Mask />
      <Title title={title}>{t(title)}</Title>
      <Tooltip label="Tab menu" keys={['right click']}>
        <Action onClick={handleContextMenu}>
          <DotsIcon />
        </Action>
      </Tooltip>
      <Tooltip
        label={`Close ${type === 'terminal' ? 'tab' : 'settings'}`}
        keys={formattedKeymaps['tab:close']}
      >
        <Action onClick={handleClose}>
          <CloseTabIcon />
        </Action>
      </Tooltip>
    </Container>
  );
}
