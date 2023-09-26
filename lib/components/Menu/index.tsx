import { h, createElement, Fragment } from 'preact';
import { memo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import { execCommand } from 'app/keymaps';
import useStore from 'lib/store';

import { Overlay } from './styles';
import Profiles from './Profiles';
import Commands from './Commands';

const Menu: React.FC = () => {
  const { menu, setMenu } = useStore();

  const [isVisible, setVisible] = useState<boolean>(false);

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    if (target === currentTarget) {
      setVisible(false);

      setTimeout(() => {
        setMenu(undefined);

        execCommand('terminal:focus');
      }, 200);
    }
  };

  useEffect(() => setVisible(Boolean(menu)), [menu]);

  return menu ? (
    <Overlay onClick={handleOverlay}>
      {createElement({ Profiles, Commands }[menu as any], {
        menu,
        setMenu,
        isVisible,
      })}
    </Overlay>
  ) : (
    <Fragment />
  );
};

export default memo(Menu);
