import { Fragment } from 'preact';
import { memo, useEffect, useMemo, useState } from 'preact/compat';

import { createProfile, getGroups, sortGroups } from 'app/common/profiles';
import { execCommand } from 'app/keymaps/commands';
import storage from 'app/utils/local-storage';
import { onSearch, sortArray } from 'lib/utils';

import {
  EyeClosedIcon,
  EyeIcon,
  SearchIcon,
  SearchOffIcon,
} from 'components/Icons';
import {
  Form,
  FormItem,
  Placeholder,
  Title as Section,
  Separator,
} from '../styles';
import {
  Action,
  Actions,
  BadgeItem,
  Badges,
  Group,
  Groups,
  Icon,
  Info,
  Item,
  List,
  Name,
} from './styles';

const Profiles: React.FC<SectionProps> = ({ options, store, t }) => {
  const { modal, setModal, setProfile } = store;

  const [groups, setGroups] = useState<Record<string, IProfile[]>>({});

  const [unlistedProfiles, setUnlistedProfiles] = useState<string[]>(() =>
    storage.parseItem('unlisted-profiles', '[]'),
  );

  const getInfoBadges = (profile: IProfile) => {
    const badges: string[] = [];

    const addBadge = (count: number, label: string) => {
      if (count > 0) {
        badges.push(`${count} ${t(`${label}${count > 1 ? 's' : ''}`)}`);
      }
    };

    if (profile.type === 'shell') {
      const { length } = Object.keys(profile.options.env);

      addBadge(length, 'Env variable');
    } else {
      if (profile.type === 'ssh') {
        const { length } = profile.options.ports;

        addBadge(length, 'Forwarded port');
      }

      const { length } = profile.options.scripts;

      addBadge(length, 'script');
    }

    return badges;
  };

  const getFilteredBadges = (profile: IProfile) => {
    const badges: (string | number)[] = [];

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

    const infoBadges = getInfoBadges(profile);

    badges.push(...infoBadges);

    return { ...profile, badges };
  };

  const handleVisibility = (id: string) => {
    const unlisted = [...unlistedProfiles];

    if (unlisted.includes(id)) {
      const index = unlisted.findIndex(n => n === id);

      unlisted.splice(index, 1);
    } else {
      unlisted.push(id);
    }

    setUnlistedProfiles(unlisted);

    storage.updateItem('unlisted-profiles', unlisted);
  };

  const handleModal = (
    modal: string,
    profile: IProfile | null,
    callback?: Function,
  ) => {
    setModal(modal);
    setProfile(profile);

    callback && callback();
  };

  const handleFormSearch = ({ currentTarget, type }) => {
    const { parentElement, value } = currentTarget;

    switch (type) {
      case 'click':
        parentElement.style.width = '12rem';
        break;

      case 'focusout':
        if (!value) parentElement.style.width = '5rem';
        break;

      case 'input': {
        const { parentElement } = currentTarget.closest('[role="section"]');

        const event = {
          currentTarget: { value, parentElement: { parentElement } },
        };

        return onSearch(event, 'block');
      }
    }
  };

  useEffect(() => {
    const groups = getGroups(false, true) as Record<string, IProfile[]>;

    setGroups(groups);
  }, [modal]);

  const filteredGroups = ['External', 'System', 'Connections'];

  const actions = useMemo(
    () => ({
      Run: {
        condition: (group: string) => group !== 'Connections',
        onClick: (p: IProfile) =>
          execCommand('terminal:create', { profile: p }),
      },
      Edit: {
        condition: (group: string) => !filteredGroups.includes(group),
        onClick: (p: IProfile) => handleModal('Form', p),
      },
      Duplicate: {
        condition: (group: string) => group,
        onClick: (p: IProfile) => handleModal('Form', createProfile(t, p)),
      },
      Delete: {
        condition: (group: string) => !filteredGroups.includes(group),
        onClick: (p: IProfile) => handleModal('Dialog', p),
      },
    }),
    [],
  );

  return (
    <Fragment>
      <Section style={{ marginTop: 0 }} role="section">
        {t('Profiles')}
        <Form>
          <FormItem style={{ width: '5rem' }}>
            <input
              placeholder={t('Search')}
              onClick={handleFormSearch}
              onBlur={handleFormSearch}
              onChange={handleFormSearch}
            />
            <SearchIcon />
          </FormItem>
          <FormItem
            onClick={() => {
              handleModal('Profiles', null, () => {
                global.shouldSelectProfile = true;
              });
            }}
          >
            {t('New profile')}
          </FormItem>
        </Form>
      </Section>
      {options}
      <Groups
        className={`w ${Object.keys(groups).length === 0 ? 'blank' : ''}`}
      >
        <Separator />
        {sortGroups(Object.keys(groups)).map((name, index) => {
          const group = groups[name];

          return (
            <Group
              key={index}
              data-name={name}
              style={{ marginTop: index !== 0 ? '1rem' : '0' }}
              role="group"
            >
              <Name>
                {filteredGroups.includes(name) || name === 'Ungrouped'
                  ? t(name)
                  : name}
              </Name>
              <List role="list">
                {sortArray(group).map((profile: IProfile, index) => {
                  const { name, group, badges } = getFilteredBadges(profile);

                  const unlisted = unlistedProfiles.includes(profile.id);

                  return (
                    <Item key={index} data-name={name}>
                      <Info>
                        <span>
                          {t(name)}
                          <Icon
                            style={{ opacity: unlisted ? 1 : 0 }}
                            onClick={() => handleVisibility(profile.id)}
                          >
                            {unlisted ? <EyeClosedIcon /> : <EyeIcon />}
                          </Icon>
                        </span>
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
                              {t(label)}
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
        <Placeholder style={{ display: 'none' }} role="alert">
          <SearchOffIcon />
          <span>{t('No profiles found')}</span>
          <span>{t('Try a different search')}</span>
        </Placeholder>
      </Groups>
    </Fragment>
  );
};

export default memo(Profiles);
