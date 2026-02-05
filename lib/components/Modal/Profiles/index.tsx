import { Fragment } from 'preact';
import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { createProfile, getGroups, sortGroups } from 'app/common/profiles';
import { execCommand } from 'app/keymaps/commands';
import storage from 'app/utils/local-storage';
import { sortArray, useKeyboardIndex, useSearchFilter } from 'lib/utils/hooks';

import styles from '../styles.module.css';

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
    <div className={`${styles.container} ${props.isVisible ? styles.containerVisible : styles.containerHidden}`}>
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{t('Profiles')}</div>
        {isSelecting ? (
          <div className={styles.tag} onClick={() => setIsSelecting(false)}>{t('Cancel')}</div>
        ) : (
          <Fragment>
            <div className={styles.tag} onClick={() => setIsSelecting(true)}>{t('New profile')}</div>
            <div className={styles.tag} onClick={() => execCommand('app:settings', 'Profiles')}>
              {t('Manage profiles')}
            </div>
          </Fragment>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            ref={ref}
            value={search}
            placeholder={t(
              `Select or type a profile${isSelecting ? ' to duplicate' : ''}`,
            )}
            onChange={_handleSearch}
            onKeyDown={handleComplete}
            style={{ paddingRight: '2.75rem' }}
          />
          <div className={`${styles.suggestion} ${suggestion ? styles.suggestionVisible : ''}`}>
            <span className={styles.ghost}>{suggestion}</span>
            <span className={styles.badgeItem}>tab</span>
          </div>
        </div>
        <div
          className={`${styles.wrapper} w ${visibleProfiles.length === 0 ? 'blank' : ''}`}
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
              <ul className={styles.list} role="group" key={index}>
                <hr className={styles.separator} />
                <div className={styles.modalLabel}>{defaultGroups.includes(name) ? t(name) : name}</div>
                {sortArray(listedProfiles).map((profile: IProfile, index) => {
                  const { id, name, badges } = getFilteredBadges(profile);

                  const profileIndex = visibleProfiles.findIndex(
                    p => p.id === id,
                  );

                  const itemClasses = [
                    styles.listItem,
                    styles.listItemTransition,
                    selectedIndex === profileIndex ? styles.listItemSelected : '',
                  ].filter(Boolean).join(' ');

                  return (
                    <li
                      key={index}
                      className={itemClasses}
                      data-name={name}
                      onClick={() => handleSelect(profileIndex, profile)}
                      onMouseEnter={() => setSelectedIndex(profileIndex)}
                    >
                      <div className={styles.name}>
                        {name.includes('connection') ? t(name) : name}
                      </div>
                      <div className={styles.badges}>
                        {badges.map((value, key) => (
                          <span className={styles.badgeItem} key={key}>{value}</span>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          })}
          <span className={styles.warning} style={{ display: 'none' }}>
            {t('No profiles found')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Profiles);
