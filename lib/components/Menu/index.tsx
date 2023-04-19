import { h } from 'preact';
import { memo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import { Overlay, Content } from './styles';
import Profiles from './Profiles';
import Commands from './Commands';
import Settings from './Settings';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const { menu } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    if (target === currentTarget) {
      setVisible(false);

      setTimeout(props.hideMenu, 200);
    }
  };

  useEffect(() => {
    setVisible(Boolean(menu));
  }, [menu]);

  return (
    menu && (
      <Overlay state={props} onClick={handleOverlay}>
        <Content state={props} visible={visible}>
          {menu === 'Profiles' ? (
            <Profiles {...props} />
          ) : menu === 'Commands' ? (
            <Commands {...props} />
          ) : (
            <Settings />
          )}
        </Content>
      </Overlay>
    )
  );
};

export default memo(Menu);
