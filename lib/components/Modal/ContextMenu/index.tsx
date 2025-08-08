import { h } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';

import { formatKeys } from 'app/keymaps/schema';
import { execCommand } from 'app/keymaps/commands';
import { terms } from 'app/common/terminal';
import storage from 'app/utils/local-storage';
import useStore from 'lib/store';

import { DotsIcon } from 'lib/components/Icons';
import getSchema from './schema';
import {
  Action,
  Actions,
  Arrow,
  Container,
  Content,
  Key,
  Keys,
  Label,
} from './styles';

const ContextMenu: React.FC<ModalProps> = (props: ModalProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const [isExtended, setExtended] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const {
    context,
    instances,
    current: { origin },
  } = useStore();

  const schema = getSchema(
    {
      term: global.id ? terms[global.id] : null,
      group: origin ? context[origin] : null,
      instance: global.id ? instances[global.id] : null,
    },
    isExtended,
  );

  const handleAction = (event: MouseEvent, command?: string | null) => {
    event.preventDefault();

    if (command) {
      execCommand(command).then(() => props.setVisible(false));
    } else {
      setExtended(!isExtended);

      storage.updateItem('contextmenu', !isExtended);
    }
  };

  useEffect(() => {
    const isExtended = storage.parseItem('contextmenu', false);

    setExtended(isExtended);

    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();

      let { top, left } = global.menu!;

      if (top + height > window.innerHeight) {
        top -= height;
      }

      if (left + width > window.innerWidth) {
        left -= width;
      }

      setPosition({ top, left });
    }
  }, [props]);

  return (
    <Container $isVisible={props.isVisible} style={position} ref={ref}>
      <Content>
        <Actions>
          {schema.map((action, index) => {
            const { label, command, icon } = action;

            const [keys = []] = formatKeys(command);

            return (
              <Action
                onClick={(event: MouseEvent) => handleAction(event, command)}
                key={index}
              >
                {icon}
                <Label $keys={keys}>
                  <Arrow />
                  <span>{label}</span>
                  <Keys $hidden={keys.length === 0} key={index}>
                    {keys.map((key, index) => (
                      <Key key={index}>{key}</Key>
                    ))}
                  </Keys>
                </Label>
              </Action>
            );
          })}
          <Action onClick={handleAction}>
            <DotsIcon />
            <Label $keys={[]}>
              <Arrow />
              <span>{isExtended ? 'See Less' : 'See More'}</span>
            </Label>
          </Action>
        </Actions>
      </Content>
    </Container>
  );
};

export default memo(ContextMenu);
