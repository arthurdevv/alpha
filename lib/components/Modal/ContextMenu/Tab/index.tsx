import { Fragment } from 'preact';
import { memo } from 'preact/compat';

import { formatKeys } from 'app/keymaps/schema';
import { useContextMenu } from 'lib/utils/hooks';

import { DotsIcon } from 'components/Icons';
import { execCommand } from 'app/keymaps/commands';
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

const TabContextMenu: React.FC<ModalProps> = (props: ModalProps) => {
  const [ref, position, isMinimal, [isExtended, setExtended], storage, t] =
    useContextMenu(props);

  const handleAction = (event: MouseEvent, command?: string | null) => {
    event.preventDefault();

    if (command === 'tab:rename') return props.handleModal(null, 'Rename');
    if (command === 'tab:color') return props.handleModal(null, 'ColorPicker');

    if (command) {
      execCommand(command, props.handleModal).execCommand('terminal:focus');
    } else {
      setExtended(!isExtended);

      storage.updateItem('contextmenu', !isExtended);
    }
  };

  const schema = getSchema(props.store, isExtended, isMinimal);

  return (
    <Container $isVisible={props.isVisible} style={position} ref={ref}>
      <Content $isMinimal={isMinimal}>
        <Actions>
          {schema.map((action, index) => {
            const { label, command, icon } = action;

            const [keys = []] = formatKeys(command);

            return label !== 'separator' ? (
              <Action
                onClick={event => handleAction(event, command)}
                key={index}
              >
                {icon}
                {isMinimal ? (
                  <Fragment>
                    <Label $keys={keys}>
                      <Arrow />
                      <span>{t(label)}</span>
                      <Keys $hidden={keys.length === 0}>
                        {keys.map((key, index) => (
                          <Key key={index}>{key}</Key>
                        ))}
                      </Keys>
                    </Label>
                  </Fragment>
                ) : (
                  <Fragment>
                    <span>{t(label)}</span>
                    <Keys $hidden={keys.length === 0}>
                      {keys.map((key, index) => (
                        <Key key={index}>{key}</Key>
                      ))}
                    </Keys>
                  </Fragment>
                )}
              </Action>
            ) : (
              <Separator key={index} />
            );
          })}
          {isMinimal && (
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

export default memo(TabContextMenu);
