import { memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clearResult, findResult, onChangeResults } from 'app/common/addons';
import storage from 'app/utils/local-storage';
import { useSuggestions } from 'lib/hooks/useSearchController';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaseSensitivyIcon,
  CloseMenuIcon,
  RegexIcon,
  WholeWordIcon,
} from 'lib/components/Icons';
import { KeyItem, Keys } from 'components/Header/Popover/styles';
import {
  Search as _Search,
  BadgeItem,
  Ghost,
  SearchInput,
  Suggestion,
} from '../styles';
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

  const handleSearch = ({ currentTarget }, match?: string) => {
    const { value } = currentTarget;

    const result = match || value;

    setResult(result);

    findResult(global.id!, result, 'findNext');
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

    const { dispose } = onChangeResults(global.id!, setCount);

    function handleKeyDown({ key }: KeyboardEvent) {
      if (key === 'ArrowUp') findResult(global.id!, result, 'findPrevious');

      if (key === 'ArrowDown') findResult(global.id!, result, 'findNext');
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearResult(global.id!);

      saveSuggestion();

      dispose();

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
        <_Search style={{ position: 'relative', padding: 0 }}>
          <SearchInput
            value={result}
            placeholder={t('Search')}
            onChange={handleSearch}
            onKeyDown={event =>
              handleComplete(event, (s: string) => handleSearch(event, s))
            }
            style={{ paddingRight: suggestion ? '2.75rem' : '0' }}
            ref={input}
          />
          <Suggestion style={{ width: '100%' }} $suggestion={suggestion}>
            <Ghost>{suggestion}</Ghost>
            <BadgeItem>tab</BadgeItem>
          </Suggestion>
        </_Search>
        <Controls>
          <Count>{count.join('/')}</Count>
          <Control
            aria-label="up"
            onClick={() => findResult(global.id!, result, 'findPrevious')}
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
            onClick={() => findResult(global.id!, result, 'findNext')}
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
