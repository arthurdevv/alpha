import { Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps';
import { getGroups } from 'app/common/profiles';
import { sortArray } from 'lib/utils';
import useStore from 'lib/store';

import {
  Action,
  Actions,
  Column,
  Group,
  Info,
  Item,
  List,
  Shell,
  Tag,
} from './styles';

const Profiles: React.FC<SectionProps> = ({ options }) => {
  const { modal, setModal, setProfile } = useStore();

  const [groups, setGroups] = useState<Record<string, IProfile[]>>({});

  const handleModal = (modal: string, profile?: IProfile) => {
    setModal(modal);

    setProfile(profile);
  };

  useEffect(() => {
    const groups = getGroups() as Record<string, IProfile[]>;

    setGroups(groups);
  }, [modal]);

  return (
    <Fragment>
      {options}
      <Column>
        {Object.keys(groups).map((name, index) => {
          const group = groups[name];

          return (
            <Group key={index}>
              <Tag>{name}</Tag>
              <List role="group">
                {sortArray(group).map((profile: IProfile, index) => {
                  const { name, group, options } = profile;

                  return (
                    <Item key={index} data-name={name}>
                      <Info>
                        <span>{name}</span>
                        <Shell>{options.shell.split(/(\\|\/)/g).pop()}</Shell>
                      </Info>
                      <Actions>
                        <Action
                          onClick={() =>
                            execCommand('terminal:create', profile)
                          }
                        >
                          Run
                        </Action>
                        {group !== 'System' && (
                          <Fragment>
                            <Action
                              onClick={() => handleModal('Form', profile)}
                            >
                              Edit
                            </Action>
                            <Action
                              onClick={() => handleModal('Dialog', profile)}
                            >
                              Delete
                            </Action>
                          </Fragment>
                        )}
                      </Actions>
                    </Item>
                  );
                })}
              </List>
            </Group>
          );
        })}
      </Column>
    </Fragment>
  );
};

export default memo(Profiles);
