import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { app } from '@electron/remote';

import { getSettings, setSettings } from 'app/settings';
import { changeLanguage } from 'lib/i18n';
import ipc from 'shared/ipc/renderer';

import Header from 'components/Header';
import Modal from 'components/Modal';
import { AlphaIcon, SpinnerDownIcon } from 'lib/components/Icons';
import {
  Description,
  Entry,
  Label,
  Option,
  Content as OptionContent,
  Selector,
  Separator,
  Spinner,
  Switch,
  SwitchSlider,
} from 'components/Settings/styles';
import styles from './styles.module.css';
import schema from './schema';

const Welcome: React.FC<WelcomeProps> = ({ setIsFirstRun, setModal }) => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const [settings] = useState<ISettings>(() => getSettings());

  const { t } = useTranslation();

  const handleOption = async (
    key: string,
    { type, options, values }: ISettingsOption,
    { currentTarget },
  ) => {
    let { value, classList } = currentTarget;

    if (type === 'boolean') {
      value = classList.toggle('checked');
    } else if (options && values) {
      const index = options.indexOf(value);

      value = values[index];

      await changeLanguage(value);
    }

    setSettings(key as keyof ISettings, value);
  };

  const handleEnter = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();

    setShowWelcome(false);

    setTimeout(() => setIsFirstRun(false), 600);
    setTimeout(() => ipc.emit('app:renderer-ready'), 3900);
  };

  const containerClassName = showWelcome
    ? styles.container
    : `${styles.container} ${styles.containerHidden}`;

  return (
    <div className={containerClassName} tabIndex={0} onKeyDown={handleEnter}>
      <Header welcome />
      <div className={styles.content}>
        <div className={styles.logo}>
          <AlphaIcon />
          <div className={styles.logoName}>LPHA</div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.texts}>
            <span className={styles.title}>{t('Welcome to Alpha')}</span>
            <span className={styles.subtitle}>{t('A modern terminal for modern workflows.')}</span>
          </div>
          <div className={styles.options} role="list">
            {Object.entries(schema).map(([key, option], index) => {
              const { name, label, input, options, values } = option;

              const value = settings[key];

              const handleChange = handleOption.bind(null, key, option);

              return (
                <Option key={index}>
                  <Separator
                    style={{ margin: index === 0 ? '0.125rem 0' : '0.75rem 0' }}
                  />
                  <OptionContent>
                    <Label>{t(name)}</Label>
                    {input === 'checkbox' ? (
                      <Switch
                        className={value ? 'checked' : undefined}
                        onClick={handleChange}
                      >
                        <SwitchSlider />
                      </Switch>
                    ) : (
                      <Entry>
                        <Selector onChange={handleChange}>
                          {options.map((option, index) => {
                            let selected = (values[index] || option) === value;

                            return (
                              <option
                                key={index}
                                value={option}
                                selected={selected}
                              >
                                {option}
                              </option>
                            );
                          })}
                        </Selector>
                        <Spinner $input={input}>
                          <SpinnerDownIcon />
                        </Spinner>
                      </Entry>
                    )}
                  </OptionContent>
                  <Description>{t(label)}</Description>
                </Option>
              );
            })}
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        {t('Press')}
        <div className={styles.keys}>
          <div className={styles.keyItem}>Enter</div>
        </div>
        {t('to start using Alpha')}
        <div className={styles.version} onClick={() => setModal('About')}>{app.getVersion()}</div>
      </footer>
      <Modal />
    </div>
  );
};

export default memo(Welcome);
