import { Fragment, h } from 'preact';
import { memo, useEffect, useMemo, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps/commands';
import { getGroups } from 'app/common/profiles';
import { sortArray } from 'lib/utils';
import useStore from 'lib/store';

import {
  Action,
  Actions,
  BadgeItem,
  Badges,
  Column,
  Group,
  Info,
  Item,
  List,
  Tag,
} from './styles';

const Profiles: React.FC<SectionProps> = ({ options }) => {
  const { modal, setModal, setProfile } = useStore();

  const [groups, setGroups] = useState<Record<string, IProfile[]>>({});

  const handleModal = (modal: string, profile: IProfile | null) => {
    setModal(modal);
    setProfile(profile);
  };

  const getFilteredBadges = (profile: IProfile) => {
    let badges: (string | number)[] = [];

    if (profile.type === 'shell') {
      let { file, args } = profile.options;

      file = (args.find(arg => arg.includes('.exe')) ?? file)
        .split(/(\\|\/)/g)
        .pop()!;

      badges.push(file);
    } else if (profile.type === 'ssh') {
      const { host, port } = profile.options;

      badges.push(host, port);
    } else {
      const { path, baudRate } = profile.options;

      badges.push(path, baudRate);
    }

    return { ...profile, badges };
  };

  useEffect(() => {
    const groups = getGroups() as Record<string, IProfile[]>;

    setGroups(groups);
  }, [modal]);

  const actions = useMemo(
    () => ({
      Run: {
        condition: (group: string) => group,
        onClick: (profile: IProfile) => execCommand('terminal:create', profile),
      },
      Edit: {
        condition: (group: string) => group !== 'System',
        onClick: (profile: IProfile) => handleModal('Form', profile),
      },
      Delete: {
        condition: (group: string) => group !== 'System',
        onClick: (profile: IProfile) => handleModal('Dialog', profile),
      },
    }),
    [],
  );

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
                  const { name, group, badges } = getFilteredBadges(profile);

                  return (
                    <Item key={index} data-name={name}>
                      <Info>
                        <span>{name}</span>
                        <Badges>
                          {badges.map((value, key) => (
                            <BadgeItem key={key}>{value}</BadgeItem>
                          ))}
                        </Badges>
                      </Info>
                      <Actions>
                        {Object.entries(actions).map(([label, action]) => {
                          const { condition, onClick } = action;

                          return condition(group) ? (
                            <Action
                              key={label}
                              onClick={() => onClick(profile)}
                            >
                              {label}
                            </Action>
                          ) : (
                            <Fragment key={label} />
                          );
                        })}
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
