import { memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clearResult, findResult, onChangeResults } from 'app/common/addons';
import storage from 'app/utils/local-storage';
import { useSuggestions } from 'lib/utils/hooks';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaseSensitivyIcon,
  CloseMenuIcon,
  RegexIcon,
  WholeWordIcon,
} from 'lib/components/Icons';
import { KeyItem, Keys } from 'components/Header/Popover/styles';
import styles from '../styles.module.css';
import {
  Arrow,
  Container,
  Content,
  Control,
  Controls,
  Count,
  Label,
} from './styles';

const schema = {
  caseSensitive: {
    label: 'Case sensitive',
    icon: <CaseSensitivyIcon />,
  },
  wholeWord: {
    label: 'Whole word',
    icon: <WholeWordIcon />,
  },
  regex: {
    label: 'Regular expression',
    icon: <RegexIcon />,
  },
};

const Search: React.FC<SearchProps> = (props: SearchProps) => {
  const [result, setResult] = useState<string>('');

  const [count, setCount] = useState<number[]>([0, 0]);

  const input = useRef<HTMLInputElement | null>(null);

  const { suggestion, handleComplete, saveSuggestion } = useSuggestions(
    'Search',
    result,
  );

  const { t } = useTranslation();

  const handleSearch = async ({ currentTarget }, match?: string) => {
    const { value } = currentTarget;

    const result = match || value;

    setResult(result);

    await findResult(global.id!, result, 'findNext');
  };

  const handleControl = ({ currentTarget }) => {
    const { classList, ariaLabel: key } = currentTarget;

    classList.toggle('actived');

    const controls = storage.parseItem('controls');

    storage.updateItem('controls', { [key]: !controls[key] }, true);
  };

  const handleFocus = ({ currentTarget }, focused: boolean) => {
    if (!props.isVisible) return;

    const { classList } = currentTarget;

    classList[focused ? 'add' : 'remove']('focused');

    const input = currentTarget.getElementsByTagName('input')[0];

    input.focus();
  };

  useEffect(() => {
    const { current } = input;

    if (current) setTimeout(() => current.focus(), 100);

    let disposeCallback: (() => void) | undefined;

    // Initialize search addon and set up results listener
    onChangeResults(global.id!, setCount).then(subscription => {
      disposeCallback = subscription.dispose;
    });

    function handleKeyDown({ key }: KeyboardEvent) {
      if (key === 'ArrowUp') findResult(global.id!, result, 'findPrevious');

      if (key === 'ArrowDown') findResult(global.id!, result, 'findNext');
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearResult(global.id!);

      saveSuggestion();

      if (disposeCallback) disposeCallback();

      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [props.isVisible]);

  return (
    <Container
      className="focused"
      $isVisible={props.isVisible}
      onClick={(event: MouseEvent) => handleFocus(event, true)}
      onMouseEnter={(event: MouseEvent) => handleFocus(event, true)}
      onMouseLeave={(event: MouseEvent) => handleFocus(event, false)}
    >
      <Content>
        <div className={styles.search} style={{ position: 'relative', padding: 0 }}>
          <input
            className={styles.searchInput}
            value={result}
            placeholder={t('Search')}
            onChange={handleSearch}
            onKeyDown={event =>
              handleComplete(event, (s: string) => handleSearch(event, s))
            }
            style={{ paddingRight: suggestion ? '2.75rem' : '0' }}
            ref={input}
          />
          <div className={`${styles.suggestion} ${suggestion ? styles.suggestionVisible : ''}`} style={{ width: '100%' }}>
            <span className={styles.ghost}>{suggestion}</span>
            <span className={styles.badgeItem}>tab</span>
          </div>
        </div>
        <Controls>
          <Count>{count.join('/')}</Count>
          <Control
            aria-label="up"
            onClick={async () =>
              await findResult(global.id!, result, 'findPrevious')
            }
          >
            <ArrowUpIcon />
            <Label $hasKeys>
              <Arrow />
              <span>
                {t('Previous match')}
                <Keys>
                  <KeyItem>arrow up</KeyItem>
                </Keys>
              </span>
            </Label>
          </Control>
          <Control
            aria-label="down"
            onClick={async () =>
              await findResult(global.id!, result, 'findNext')
            }
          >
            <ArrowDownIcon />
            <Label $hasKeys>
              <Arrow />
              <span>
                {t('Next match')}
                <Keys>
                  <KeyItem>arrow down</KeyItem>
                </Keys>
              </span>
            </Label>
          </Control>
          {Object.keys(schema).map((control, index) => {
            const { label, icon } = schema[control];

            const controls = storage.parseItem('controls') || {};

            return (
              <Control
                key={index}
                aria-label={control}
                className={controls[control] ? 'actived' : undefined}
                onClick={handleControl}
              >
                {icon}
                <Label>
                  <Arrow />
                  <span>{t(label)}</span>
                </Label>
              </Control>
            );
          })}
          <Control onClick={props.handleModal}>
            <CloseMenuIcon />
            <Label $hasKeys>
              <Arrow />
              <span>
                {t('Close')}
                <Keys>
                  <KeyItem>esc</KeyItem>
                </Keys>
              </span>
            </Label>
          </Control>
        </Controls>
      </Content>
    </Container>
  );
};

export default memo(Search);
