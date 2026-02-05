import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { execCommand } from 'app/keymaps/commands';
import { resolveCommand } from 'app/keymaps/schema';
import { useKeyboardIndex, useSearchFilter } from 'lib/utils/hooks';

import { KeyItem } from 'components/Header/Popover/styles';
import getSchema from './schema';
import styles from '../styles.module.css';

const Commands: React.FC<ModalProps> = (props: ModalProps) => {
  const { store, modal } = props;

  const {
    ref,
    search,
    suggestion,
    handleSearch,
    handleComplete,
    saveSuggestion,
  } = useSearchFilter(modal, props);

  const { t } = useTranslation();

  const handleSelect = (index?: number, command?: string) => {
    saveSuggestion();

    execCommand(command || commands[index!], props.handleModal);
  };

  const _handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(event);

    const { value } = event.currentTarget;

    const searchIndex = commands.findIndex(c => {
      const { label } = resolveCommand(c);

      return label.toLowerCase().includes(value.toLowerCase());
    });

    setSelectedIndex(searchIndex);
  };

  const schema = getSchema(store);

  const commands = Object.values(schema).flat();

  const [selectedIndex, setSelectedIndex] = useKeyboardIndex(
    commands.length,
    handleSelect,
  );

  return (
    <div className={`${styles.container} ${props.isVisible ? styles.containerVisible : styles.containerHidden}`}>
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{t('Commands')}</div>
        <div
          className={`${styles.tag} ${styles.tagHint}`}
          style={{
            padding: '0.25rem 0.25rem 0.25rem 0.5rem',
            gap: '0.25rem',
          }}
        >
          {t('Navigate with')}
          <KeyItem $isHint style={{ minWidth: '1rem', padding: 0 }}>
            ↑
          </KeyItem>
          <KeyItem $isHint style={{ minWidth: '1rem', padding: 0 }}>
            ↓
          </KeyItem>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            ref={ref}
            value={search}
            placeholder={t('Select or type a command')}
            onChange={_handleSearch}
            onKeyDown={handleComplete}
            style={{ paddingRight: '2.75rem' }}
          />
          <div className={`${styles.suggestion} ${suggestion ? styles.suggestionVisible : ''}`}>
            <span className={styles.ghost}>{suggestion}</span>
            <span className={styles.badgeItem}>tab</span>
          </div>
        </div>
        <div className={`${styles.wrapper} w`} style={{ paddingBottom: '0.5rem' }}>
          {Object.entries(schema).map(([title, actions]) => {
            if (actions.length === 0) return;

            return (
              <ul className={styles.list} role="list" key={title}>
                <hr className={styles.separator} />
                <div className={styles.modalLabel}>{t(title)}</div>
                {actions.map((command, index) => {
                  let { label, keys = [] } = resolveCommand(command);

                  label = command.includes('duplicate')
                    ? 'Duplicate tab'
                    : label;

                  const cmdIndex = commands.findIndex(c => c.includes(command));

                  const itemClasses = [
                    styles.listItem,
                    styles.listItemTransition,
                    selectedIndex === cmdIndex ? styles.listItemSelected : '',
                  ].filter(Boolean).join(' ');

                  return (
                    <li
                      key={index}
                      className={itemClasses}
                      data-name={t(label)}
                      onClick={() => handleSelect(cmdIndex, command)}
                      onMouseEnter={() => setSelectedIndex(cmdIndex)}
                    >
                      <div className={styles.name}>{t(label)}</div>
                      <div className={styles.badges}>
                        {keys.map((key, index) => (
                          <span className={styles.badgeItem} key={index}>{key}</span>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          })}
          <span className={styles.warning} style={{ display: 'none' }}>
            {t('No commands found')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Commands);
