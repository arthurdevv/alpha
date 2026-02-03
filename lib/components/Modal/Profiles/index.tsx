import { Fragment } from 'preact';
import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { createProfile, getGroups, sortGroups } from 'app/common/profiles';
import { execCommand } from 'app/keymaps/commands';
import storage from 'app/utils/local-storage';
import { sortArray, useKeyboardIndex, useSearchFilter } from 'lib/utils/hooks';

import {
  BadgeItem,
  Badges,
  Container,
  Content,
  Ghost,
  Label,
  List,
  ListItem,
  Name,
  Search,
  SearchInput,
  Separator,
  Suggestion,
  Tag,
  Tags,
  Warning,
  Wrapper,
} from '../styles';

const Profiles: React.FC<ModalProps> = (props: ModalProps) => {
  const { modal, store } = props;

  const [isSelecting, setIsSelecting] = useState<boolean>(
    () => global.shouldSelectProfile ?? false,
  );

  const {
    ref,
    search,
    suggestion,
    handleSearch,
    handleComplete,
    saveSuggestion,
  } = useSearchFilter(modal, props);

  const { t } = useTranslation();

  const handleSelect = (
    index: number | undefined,
    profile?: IProfile | null,
  ) => {
    saveSuggestion();

    profile = profile || visibleProfiles[index!];

    if (isSelecting) {
      props.handleModal(undefined, 'Form');

      return store.setProfile(createProfile(t, profile));
    }

    execCommand('terminal:create', { profile }, () => props.handleModal());
  };

  const _handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(event);

    const { value } = event.currentTarget;

    const searchIndex = visibleProfiles.findIndex(p =>
      p.name.toLowerCase().includes(value.toLowerCase()),
    );

    setSelectedIndex(searchIndex);
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

  const groups = getGroups(false, isSelecting);

  const unlistedProfiles = storage.parseItem('unlisted-profiles', '[]');

  const visibleProfiles = sortGroups(Object.keys(groups))
    .map(name => {
      const group: IProfile[] = groups[name];

      return group.filter((p: IProfile) => !unlistedProfiles.includes(p.id));
    })
    .flat();

  const [selectedIndex, setSelectedIndex] = useKeyboardIndex(
    visibleProfiles.length,
    handleSelect,
  );

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>{t('Profiles')}</Tag>
        {isSelecting ? (
          <Tag onClick={() => setIsSelecting(false)}>{t('Cancel')}</Tag>
        ) : (
          <Fragment>
            <Tag onClick={() => setIsSelecting(true)}>{t('New profile')}</Tag>
            <Tag onClick={() => execCommand('app:settings', 'Profiles')}>
              {t('Manage profiles')}
            </Tag>
          </Fragment>
        )}
      </Tags>
      <Content>
        <Search>
          <SearchInput
            ref={ref}
            value={search}
            placeholder={t(
              `Select or type a profile${isSelecting ? ' to duplicate' : ''}`,
            )}
            onChange={_handleSearch}
            onKeyDown={handleComplete}
            style={{ paddingRight: '2.75rem' }}
          />
          <Suggestion $suggestion={suggestion}>
            <Ghost>{suggestion}</Ghost>
            <BadgeItem>tab</BadgeItem>
          </Suggestion>
        </Search>
        <Wrapper
          className={`w ${visibleProfiles.length === 0 && 'blank'}`}
          style={{ paddingBottom: '0.5rem' }}
        >
          {sortGroups(Object.keys(groups)).map((name, index) => {
            const group: IProfile[] = groups[name];

            const defaultGroups = [
              'Ungrouped',
              'External',
              'System',
              'Connections',
            ];

            const listedProfiles = group.filter(
              profile => !unlistedProfiles.includes(profile.id),
            );

            if (!listedProfiles.length) return <Fragment key={index} />;

            return (
              <List role="group" key={index}>
                <Separator />
                <Label>{defaultGroups.includes(name) ? t(name) : name}</Label>
                {sortArray(listedProfiles).map((profile: IProfile, index) => {
                  const { id, name, badges } = getFilteredBadges(profile);

                  const profileIndex = visibleProfiles.findIndex(
                    p => p.id === id,
                  );

                  return (
                    <ListItem
                      key={index}
                      data-name={name}
                      onClick={() => handleSelect(profileIndex, profile)}
                      onMouseEnter={() => setSelectedIndex(profileIndex)}
                      $isSelected={selectedIndex === profileIndex}
                      $transition
                    >
                      <Name>
                        {name.includes('connection') ? t(name) : name}
                      </Name>
                      <Badges>
                        {badges.map((value, key) => (
                          <BadgeItem key={key}>{value}</BadgeItem>
                        ))}
                      </Badges>
                    </ListItem>
                  );
                })}
              </List>
            );
          })}
          <Warning style={{ display: 'none' }}>
            {t('No profiles found')}
          </Warning>
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Profiles);
