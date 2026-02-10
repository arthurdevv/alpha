import { Fragment } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import storage from 'app/utils/local-storage';
import { onSearch } from 'lib/utils';
import { useKeyboardNavigation } from 'lib/hooks/useSearchController';

import {
  BadgeItem,
  Container,
  Content,
  Search,
  SearchInput,
  Tag,
  Tags,
} from '../styles';
import {
  Action,
  Command,
  Dot,
  Info,
  List,
  Value,
  Warning,
  Wrapper,
} from './styles';

const History: React.FC<ModalProps> = ({ store, isVisible, handleModal }) => {
  const [history, setHistory] = useState<Record<string, ICommand[]>>(
    () => storage.parseItem('history') || {},
  );

  const [confimation, setConfimation] = useState<number>(0);

  const { profile } = store.instances[store.current.focused];

  const commands = (history[profile.id] || []).flatMap(item => {
    if (item.buffer === 'H') return [];

    if (item.buffer.startsWith('H'))
      return [{ ...item, buffer: item.buffer.slice(1) }];

    return [item];
  });

  const [selectedIndex, setSelectedIndex] = useKeyboardNavigation(
    commands ? commands.length : 0,
  );

  const input = useRef<HTMLInputElement | null>(null);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const { t } = useTranslation();

  const handleClearHistory = (flag: number) => {
    setConfimation(flag);

    if (flag === 2) {
      setHistory(history => {
        delete history[profile.id];

        storage.updateItem('history', history);

        return {};
      });

      setConfimation(0);
    }
  };

  const handleSearch = (event: React.TargetedEvent<HTMLInputElement>) => {
    onSearch(event, 'flex');

    const { value } = event.currentTarget;

    const searchIndex = commands.findIndex(command => command.buffer === value);

    setSelectedIndex(searchIndex);
  };

  const handleDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  };

  const handleFocus = ({ currentTarget }) => {
    const [input] = currentTarget.getElementsByTagName('input');

    if (input) input.focus();
  };

  useEffect(() => {
    const { current } = input;

    if (current) setTimeout(() => current.focus(), 100);
  }, [isVisible]);

  useEffect(() => {
    const handleEnterCommand = ({ key }: KeyboardEvent) => {
      if (key === 'Enter' && selectedIndex !== -1) {
        const { buffer } = commands[selectedIndex];

        store.onData(buffer);

        setTimeout(handleModal, 0);
      }
    };

    window.addEventListener('keydown', handleEnterCommand);

    return () => window.removeEventListener('keydown', handleEnterCommand);
  }, [selectedIndex, commands]);

  return (
    <Container $isVisible={isVisible} $width={23} onClick={handleFocus}>
      <Tags>
        <Tag $isTitle title={profile.name}>
          {t('History')}: {profile.name}
        </Tag>
        {commands.length ? (
          <Fragment>
            <Tag onClick={() => handleClearHistory(confimation === 0 ? 1 : 2)}>
              {confimation === 0 ? t('Clear history') : t('Confirm')}
            </Tag>
          </Fragment>
        ) : (
          <Fragment />
        )}
      </Tags>
      <Content>
        <Wrapper
          className="w"
          style={{
            padding: commands.length ? '0 1rem .875rem' : '.875rem 1rem',
          }}
        >
          {commands.length ? (
            <Fragment>
              <Search style={{ padding: '0', marginBottom: '.5rem' }}>
                <SearchInput
                  ref={input}
                  spellcheck={false}
                  placeholder={t('Select or type a command')}
                  onChange={handleSearch}
                />
              </Search>
              <List role="list">
                {Object.values(commands).map((value, index, array) => {
                  const { buffer, where, executedAt, executionTime } = value;

                  const ref = (element: HTMLLIElement | null) => {
                    itemRefs.current[index] = element;
                  };

                  return (
                    <Value
                      ref={ref}
                      key={index}
                      data-name={buffer}
                      $selected={selectedIndex === index}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <Dot
                        $first={index === 0}
                        $last={index === array.length - 1}
                        $old={index > Math.floor(array.length * (1 / 1.15))}
                      />
                      <Command>
                        {buffer}
                        <Info>
                          <span>
                            {handleDate(executedAt)} | {executionTime} ms
                          </span>
                          <span>{where}</span>
                        </Info>
                      </Command>
                      <Action>
                        <BadgeItem style={{ gap: '.25rem' }}>ENTER ↵</BadgeItem>
                      </Action>
                    </Value>
                  );
                })}
                <Warning style={{ display: 'none' }}>
                  {t('No results found')}
                </Warning>
              </List>
            </Fragment>
          ) : (
            <Warning>{t('No history yet')}</Warning>
          )}
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(History);
