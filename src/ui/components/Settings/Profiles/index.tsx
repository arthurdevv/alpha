import { cx } from '@linaria/core';
import { useMemo } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import type { Profile } from 'shared/types';
import { useSearch } from 'ui/hooks/useSearch';
import { useAppStore } from 'ui/store/app/store';
import type { SectionProps } from 'ui/types';

import { EyeClosedIcon, EyeIcon, PersonOffIcon, SearchIcon } from 'components/Icons';
import { Content, Form, FormItem, NoResults, Title } from 'components/Settings/styles';
import { Key as Badge, Keys as Badges } from 'components/Tooltip/styles';

import { Action, Actions, Group, GroupLabel, Icon, Info, Item, List, Name } from './styles';

function groupProfiles(profiles: Profile[]): Record<string, Profile[]> {
  return profiles
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .reduce(
      (acc, profile) => {
        acc[profile.group] ??= [];
        acc[profile.group].push(profile);
        return acc;
      },
      {} as Record<string, Profile[]>,
    );
}

export default function Profiles({ children }: SectionProps) {
  const profiles = useAppStore(s => s.settings.profiles);

  const { query, setQuery, filtered, isEmpty } = useSearch(profiles ?? []);
  const { t } = useTranslation();

  const grouped = useMemo(() => groupProfiles(profiles ?? []), [filtered]);

  const getTypeBadges = (profile: Profile): (string | number)[] => {
    if (profile.type === 'shell') {
      const { file, args } = profile.options;
      const exe = (args.find(arg => arg.includes('.exe')) ?? file)
        .split(/(\\|\/)/g)
        .pop() as string;

      return [exe];
    }

    if (profile.type === 'ssh') {
      const { host, port } = profile.options;
      return [host, port];
    }

    const { path, baudRate } = profile.options;
    return [path, baudRate];
  };

  const getExtraBadges = (profile: Profile): string[] => {
    const badge = (count: number, label: string) =>
      count > 0 ? `${count} ${t(`${label}${count > 1 ? 's' : ''}`)}` : null;

    if (profile.type === 'shell') {
      const count = Object.keys(profile.options.env).length;
      return [badge(count, 'Env variable')].filter(Boolean) as string[];
    }

    const ports =
      profile.type === 'ssh' ? [badge((profile.options.ports || []).length, 'Forwarded port')] : [];

    const scripts = badge((profile.options.scripts || []).length, 'script');

    return [...ports, scripts].filter(Boolean) as string[];
  };

  const getProfileBadges = (profile: Profile) => [
    ...getTypeBadges(profile),
    ...getExtraBadges(profile),
  ];

  return (
    <>
      <Title>
        {t('Profiles')}
        <Form>
          <FormItem>
            <input
              placeholder={t('Search')}
              value={query}
              onInput={e => setQuery(e.currentTarget.value)}
            />
            <SearchIcon />
          </FormItem>
          <FormItem>
            <button type="button">{t('New profile')}</button>
          </FormItem>
        </Form>
      </Title>
      {children}
      <Content className={cx(isEmpty && 'empty')} style={{ gap: '0.625rem', marginTop: '1rem' }}>
        {isEmpty ? (
          <NoResults>
            <PersonOffIcon />
            <span>{t('No profiles found')}</span>
            <span>{t('Try a different search')}</span>
          </NoResults>
        ) : (
          Object.entries(grouped).map(([group, profiles]) => {
            const x = 1;

            return (
              <Group key={group} role="group">
                <GroupLabel>{t(group)}</GroupLabel>
                <List>
                  {profiles.map(profile => {
                    const badges = getProfileBadges(profile);

                    return (
                      <Item key={profile.id}>
                        <Info>
                          <Name>
                            {t(profile.name)}
                            <Badges style={{ marginLeft: 0 }}>
                              {badges.map((value, key) => (
                                <Badge key={key}>{value}</Badge>
                              ))}
                            </Badges>
                            {/* <Icon>{profile.unlisted ? <EyeClosedIcon /> : <EyeIcon />}</Icon> */}
                          </Name>
                        </Info>
                        <Actions>
                          <Action>{t('Run')}</Action>
                          <Action>{t('Edit')}</Action>
                          <Action>{t('Duplicate')}</Action>
                          <Action>{t('Delete')}</Action>
                        </Actions>
                      </Item>
                    );
                  })}
                </List>
              </Group>
            );
          })
        )}
      </Content>
    </>
  );
}
