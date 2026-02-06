import { createElement } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { getSettings, setSettings } from 'app/settings';
import { getGroups } from 'app/common/profiles';
import listeners from 'app/settings/listeners';
import storage from 'app/utils/local-storage';
import useStore from 'lib/store';
import { getAutomaticLanguage } from 'lib/i18n';

import schema from './schema';
import styles from './styles.module.css';
import { SpinnerDownIcon, SpinnerIcon } from '../Icons';
import Application from './Application';
import Appearance from './Appearance';
import Keymaps from './Keymaps';
import Profiles from './Profiles';
import Workspaces from './Workspaces';
import Config from './Config';

const initialSettings = getSettings();

function getEntityOptions(entity?: string) {
  let target: (IProfile | IWorkspace)[] = [];

  if (!entity) return { options: [], values: [] };

  if (entity === 'profiles') {
    target = getGroups(true) as IProfile[];
  } else {
    const blankWorkspaces: any[] = [{ id: false, name: 'None', tabs: [] }];

    target = blankWorkspaces.concat(getSettings().workspaces);
  }

  return {
    options: target.map(({ name }) => name),
    values: target.map(({ id }) => id),
  };
}

const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
  const [section, setSection] = useState<Section>(() =>
    storage.parseItem('section', 'Application'),
  );

  const [entityOptions, setEntityOptions] = useState(() => getEntityOptions());

  const [transition, setTransition] = useState<boolean>(true);

  const { t } = useTranslation();

  const handleSection = (value: Section) => {
    if (value !== section) {
      setTransition(false);

      setTimeout(() => {
        setTransition(true);

        setSection(value);
      }, 125);

      storage.updateItem('section', value);

      document
        .querySelector('section')
        ?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBadges = ({ parentElement }) => {
    const option = parentElement.querySelector('div');

    const badges = option.querySelector('div');

    if (badges) badges.classList.toggle(styles.visible);
  };

  const handleBadgesClass = (key: string, value: any) =>
    initialSettings[key] === value ? undefined : styles.visible;

  const handleUpdate = (
    key: string,
    { type, options, values }: ISettingsOption,
    { currentTarget },
  ) => {
    let { value, classList } = currentTarget;

    switch (type) {
      case 'number':
        value = Number(value);
        break;

      case 'boolean':
        value = classList.toggle(styles.checked);
        handleBadges(currentTarget);
        break;
    }

    if (key === 'defaultProfile' || key === 'workspace') {
      [options, values] = [entityOptions.options, entityOptions.values];
    }

    if (options && values) {
      const index = options.indexOf(value);

      value = values[index];

      if (key === 'language') value = getAutomaticLanguage(value);
    }

    setSettings(key as keyof ISettings, value);
  };

  const handleSpinner = (
    key: string,
    action: -1 | 1,
    { max, min, step }: any,
  ) => {
    const prop = getSettings()[key] as number;

    const value =
      Math.round((prop + (step ? action * Number(step) : action)) * 100) / 100;

    if (value <= Number(max) && value >= Number(min)) {
      setSettings(key as keyof ISettings, value);
    }
  };

  const handleEntityOptions = (section: string) => {
    const entity = section.toLowerCase();

    if (['profiles', 'workspaces'].includes(entity)) {
      const entityOptions = getEntityOptions(entity);

      setEntityOptions(entityOptions);
    }
  };

  useEffect(() => {
    const { unsubscribe } = listeners.subscribe('options', () =>
      handleEntityOptions(section),
    );

    global.handleSection = handleSection;

    return () => {
      unsubscribe();
    };
  }, [section]);

  const customSections = ['Application', 'Profiles', 'Workspaces'];

  const options = Object.entries(schema[section]).map(
    ([title, value], index) => (
      <div className={styles.wrapper} key={index}>
        {!customSections.includes(section) && (
          <span className={styles.title}>{t(title === 'Default' ? section : title)}</span>
        )}
        {Object.entries(value).map(([key, option], index) => {
          const { name, label, type, input, options, values, range, badges } =
            option;

          const value = getSettings()[key];

          const handleChange = handleUpdate.bind(null, key, option);

          return (
            <div className={styles.option} key={index}>
              <hr className={styles.separator} />
              <div className={styles.content}>
                <div className={styles.label}>
                  {t(name)}
                  {badges && (
                    <div className={`${styles.badges} ${handleBadgesClass(key, value) || ''}`}>
                      {badges.map((text, index) => (
                        <span className={styles.badgeItem} key={index}>{t(text)}</span>
                      ))}
                    </div>
                  )}
                </div>
                {input === 'checkbox' ? (
                  <div
                    className={`${styles.switch} ${value ? styles.checked : ''}`}
                    onClick={handleChange}
                  >
                    <span className={styles.switchSlider} />
                  </div>
                ) : input === 'select' ? (
                  <div className={styles.entry}>
                    <select className={styles.selector} onChange={handleChange} id="mySelect">
                      {(options || entityOptions.options)?.map(
                        (option, index) => {
                          let selected = false;

                          if (values) {
                            selected = (values[index] || option) === value;
                          } else {
                            selected = entityOptions.values[index] === value;
                          }

                          return (
                            <option
                              key={index}
                              value={option}
                              selected={selected}
                            >
                              {t(`${option}`)}
                            </option>
                          );
                        },
                      )}
                    </select>
                    <div className={`${styles.spinner} ${styles.spinnerSelect}`}>
                      <SpinnerDownIcon />
                    </div>
                  </div>
                ) : (
                  <div className={styles.entry}>
                    <input
                      className={`${styles.input} ${type === 'number' ? styles.inputNumber : styles.inputText}`}
                      type={type}
                      value={value}
                      onChange={handleChange}
                      placeholder="..."
                      style={type !== 'number' ? { width: 'calc(15ch + 0.125rem)' } : undefined}
                      {...(type === 'number' ? range : {})}
                    />
                    {type === 'number' && (
                      <div className={`${styles.spinner} ${styles.spinnerNumber}`}>
                        <SpinnerIcon
                          arg0={() => handleSpinner(key, 1, range)}
                          arg1={() => handleSpinner(key, -1, range)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className={styles.description}>{t(label)}</span>
            </div>
          );
        })}
      </div>
    ),
  );

  const children = (() => {
    const element = createElement(
      {
        Application,
        Appearance,
        Profiles,
        Keymaps,
        Workspaces,
        'Config file': Config,
      }[section],
      { section, options, store: useStore(), t },
    );

    return element.type ? element : null;
  })();

  return (
    <div className={`${styles.container} ${props.origin === 'Settings' ? styles.containerVisible : ''}`}>
      <nav className={styles.navigation}>
        {Object.keys(schema).map((value, index) => (
          <div
            key={index}
            className={`${styles.navigationItem} ${value === section ? styles.selected : ''}`}
            onClick={() => handleSection(value as Section)}
          >
            {t(value)}
          </div>
        ))}
      </nav>
      <section className={`${styles.section} ${transition ? styles.sectionVisible : styles.sectionHidden}`}>
        {children || options}
      </section>
    </div>
  );
};

export default memo(Settings);
