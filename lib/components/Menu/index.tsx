import { h, createElement, Fragment } from 'preact';
import { memo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import { execCommand } from 'app/keymaps';
import useStore from 'lib/store';

import { Overlay } from './styles';
import Profiles from './Profiles';
import Commands from './Commands';
import Search from './Search';

const Menu: React.FC = () => {
  const { menu, setMenu } = useStore();

  const [isVisible, setVisible] = useState<boolean>(false);

  const handleVisible = () => {
    setVisible(false);

    setTimeout(() => {
      setMenu(undefined);

      execCommand('terminal:focus');
    }, 200);
  };

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    if (target === currentTarget) {
      handleVisible();
    }
  };

  useEffect(() => setVisible(Boolean(menu)), [menu]);

  return menu ? (
    menu === 'Search' ? (
      <Search isVisible={isVisible} onClose={handleVisible} />
    ) : (
      <Overlay onClick={handleOverlay}>
        {createElement({ Profiles, Commands }[menu]!, {
          menu,
          setMenu,
          isVisible,
        })}
      </Overlay>
    )
  ) : (
    <Fragment />
  );
};

export default memo(Menu);
