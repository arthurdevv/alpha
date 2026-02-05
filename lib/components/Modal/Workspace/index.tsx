import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { setSettings } from 'app/settings';

import settingsStyles from 'components/Settings/styles.module.css';
import { SpinnerDownIcon } from 'components/Icons';
import styles from '../styles.module.css';
import schema from './schema';

const Workspace: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    workspace: { id, name, tabs },
    options: { workspaces = [{ id, name, tabs }] },
  } = props.store;

  const [tab, setTab] = useState<IWorkspaceTab>(tabs[tabIndex]);

  const handleOption = (key: string, type: string, { currentTarget }) => {
    let { value, classList } = currentTarget;

    if (type === 'checkbox') {
      value = classList.toggle(settingsStyles.checked);
    } else if (!value) return;

    setTab(tab => {
      tab[key] = value;

      return tab;
    });
  };

  const handleSave = (del: boolean) => {
    const _workspaces = [...workspaces];

    const index = _workspaces.findIndex(w => w.id === id);

    if (index !== -1) {
      if (del) {
        global.dialog = {
          source: 'Workspaces',
          target: tabs[tabIndex].title,
          from: name,
          data: [index],
        };

        return props.handleModal(undefined, 'Dialog');
      }

      _workspaces[index].tabs[tabIndex] = tab;

      setSettings('workspaces', _workspaces);
    }

    props.handleModal();
  };

  const { t } = useTranslation();

  return (
    <div className={`${styles.container} ${props.isVisible ? styles.containerVisible : styles.containerHidden}`}>
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{`${t('Workspaces')}: ${name}`}</div>
        <div className={styles.tag} onClick={props.handleModal}>{t('Cancel')}</div>
        <div className={styles.tag} onClick={() => handleSave(false)}>{t('Save')}</div>
        <div className={styles.tag} onClick={() => handleSave(true)}>{t('Delete')}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            value={tab.title}
            placeholder={tab.title}
            onChange={event => handleOption('title', 'text', event)}
          />
        </div>
        <div
          className={styles.wrapper}
          style={{
            paddingInline: '1rem',
            paddingBottom: '1rem',
            alignItems: 'unset',
            justifyContent: 'center',
          }}
        >
          {Object.entries(schema).map(([key, option], index) => {
            const { name, label, input, options } = option;

            const onChange = handleOption.bind(null, key, input);

            return (
              <div className={settingsStyles.option} key={index}>
                <hr
                  className={settingsStyles.separator}
                  style={{ margin: index === 0 ? '0.125rem 0' : '0.75rem 0' }}
                />
                <div className={settingsStyles.content}>
                  <div className={settingsStyles.label}>{t(name)}</div>
                  {input === 'checkbox' ? (
                    <div
                      className={`${settingsStyles.switch} ${tab[key] ? settingsStyles.checked : ''}`}
                      onClick={onChange}
                    >
                      <span className={settingsStyles.switchSlider} />
                    </div>
                  ) : (
                    <div className={`${settingsStyles.entry} ${settingsStyles.entryFlex}`}>
                      <select className={settingsStyles.selector} onChange={onChange}>
                        {options.map((option, index) => (
                          <option
                            key={index}
                            value={option.id}
                            selected={option.id === tab.profile}
                          >
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <div className={`${settingsStyles.spinner} ${settingsStyles.spinnerSelect}`}>
                        <SpinnerDownIcon />
                      </div>
                    </div>
                  )}
                </div>
                <span className={settingsStyles.description}>{t(label)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Workspace);
