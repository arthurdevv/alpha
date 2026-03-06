import { Fragment } from 'preact';
import { memo, useState } from 'preact/compat';

import { execCommand } from 'main/keymaps/commands';
import { formatKeys } from 'main/keymaps/schema';
import { useContextMenu } from 'ui/hooks/use-context-menu';
import type { ModalProps } from 'ui/types';

import { DotsIcon } from 'components/Icons';

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
  Separator,
} from '../styles';

const TerminalContextMenu: React.FC<ModalProps> = (props: ModalProps) => {
  const [ref, position, isMinimal, [isExtended, setExtended], storage, t] =
    useContextMenu(props);

  const [isSubmenu, setIsSubmenu] = useState<boolean>(false);

  const handleAction = (event: MouseEvent, command?: string | null) => {
    event.preventDefault();

    if (command === 'menu:split') return setIsSubmenu(!isSubmenu);

    if (command) {
      execCommand(command, () => {
        props.setVisible(false);
      }).execCommand('terminal:focus');
    } else {
      setExtended(!isExtended);

      storage.updateItem('contextmenu', !isExtended);
    }
  };

  const schema = getSchema(props, isExtended, isMinimal, isSubmenu);

  return (
    <Container $isVisible={props.isVisible} style={position} ref={ref}>
      <Content $isMinimal={isMinimal}>
        <Actions>
          {schema.map((action, index) => {
            let { label, command, icon, submenu } = action;

            const [keys = []] = formatKeys(command);

            return label !== 'separator' ? (
              <Action
                onClick={(event: MouseEvent) => handleAction(event, command)}
                key={index}
              >
                {icon()}
                {isMinimal ? (
                  <Fragment>
                    <Label $keys={keys}>
                      <Arrow />
                      <span>{t(label)}</span>
                      <Keys $hidden={keys.length === 0} key={index}>
                        {keys.map((key, index) => (
                          <Key key={index}>{key}</Key>
                        ))}
                      </Keys>
                    </Label>
                  </Fragment>
                ) : (
                  <Fragment>
                    <span>{t(label)}</span>
                    <Keys>
                      {keys.map((key, index) => (
                        <Key key={index}>{key}</Key>
                      ))}
                    </Keys>
                    {submenu && submenu}
                  </Fragment>
                )}
              </Action>
            ) : (
              <Separator key={index} />
            );
          })}
          {isMinimal && !isSubmenu && (
            <Action onClick={handleAction}>
              <DotsIcon />
              <Label $keys={[]}>
                <Arrow />
                <span>{t(isExtended ? 'See less' : 'See more')}</span>
              </Label>
            </Action>
          )}
        </Actions>
      </Content>
    </Container>
  );
};

export default memo(TerminalContextMenu);
