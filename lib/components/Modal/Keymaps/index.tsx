import { memo, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { resolveCommand } from 'app/keymaps/schema';
import { execCommand } from 'app/keymaps/commands';
import { useSearchFilter } from 'lib/utils/hooks';
import schema from './schema';

import styles from '../styles.module.css';
import { Container, Content, Item } from './styles';

const Keymaps: React.FC<ModalProps> = (props: ModalProps) => {
  const { modal } = props;

  const {
    ref,
    search,
    suggestion,
    handleSearch,
    handleComplete,
    saveSuggestion,
  } = useSearchFilter(modal, props);

  const { t } = useTranslation();

  const handleFocus = ({ currentTarget }, focused: boolean) => {
    if (!props.isVisible) return;

    const { classList } = currentTarget;

    classList[focused ? 'add' : 'remove']('focused');
  };

  useEffect(() => () => saveSuggestion(), []);

  return (
    <Container
      className="focused"
      $isVisible={props.isVisible}
      onClick={(event: MouseEvent) => handleFocus(event, true)}
      onMouseEnter={(event: MouseEvent) => handleFocus(event, true)}
      onMouseLeave={(event: MouseEvent) => handleFocus(event, false)}
    >
      <div className={styles.tags} style={{ paddingRight: '0.75rem' }}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{t('Keymaps')}</div>
        <div className={styles.tag} onClick={() => execCommand('app:settings', 'Keymaps')}>
          {t('Manage keymaps')}
        </div>
      </div>
      <Content>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            ref={ref}
            value={search}
            placeholder={t('Search for a command')}
            onChange={handleSearch}
            onKeyDown={handleComplete}
            style={{ paddingRight: '2.75rem' }}
          />
          <div className={`${styles.suggestion} ${suggestion ? styles.suggestionVisible : ''}`}>
            <span className={styles.ghost}>{suggestion}</span>
            <span className={styles.badgeItem}>tab</span>
          </div>
        </div>
        <div className={`${styles.wrapper} w`}>
          {Object.entries(schema).map(([group, commands], index) => (
            <ul className={styles.list} role="list" key={index}>
              <hr className={styles.separator} />
              <div className={styles.modalLabel}>{t(group)}</div>
              {Object.keys(commands).map((command, index) => {
                let { label, keys = [] } = resolveCommand(command);

                label = command.includes('duplicate') ? 'Duplicate tab' : label;

                return (
                  <Item key={index} data-name={t(label)}>
                    <div className={styles.name}>{t(label)}</div>
                    <div className={styles.badges}>
                      {keys.map((key, index) => (
                        <span className={styles.badgeItem} key={index}>{key}</span>
                      ))}
                    </div>
                  </Item>
                );
              })}
            </ul>
          ))}
          <span className={styles.warning} style={{ display: 'none' }}>
            {t('No commands found')}
          </span>
        </div>
      </Content>
    </Container>
  );
};

export default memo(Keymaps);
