import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { execCommand } from 'app/keymaps/commands';
import { resolveCommand } from 'app/keymaps/schema';
import {
  useKeyboardNavigation,
  useSearch,
} from 'lib/hooks/useSearchController';

import { KeyItem } from 'components/Header/Popover/styles';
import {
  BadgeItem,
  Badges,
  Container,
  Content,
  Ghost,
  Name as Label,
  List,
  ListItem,
  Search,
  SearchInput,
  Separator,
  Suggestion,
  Tag,
  Tags,
  Label as Title,
  Warning,
  Wrapper,
} from '../styles';
import getSchema from './schema';

const Commands: React.FC<ModalProps> = (props: ModalProps) => {
  const { store, modal } = props;

  const {
    ref,
    search,
    suggestion,
    handleSearch,
    handleComplete,
    saveSuggestion,
  } = useSearch(modal, props);

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

  const [selectedIndex, setSelectedIndex] = useKeyboardNavigation(
    commands.length,
    handleSelect,
  );

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>{t('Commands')}</Tag>
        <Tag
          $isHint
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
        </Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput
            ref={ref}
            value={search}
            placeholder={t('Select or type a command')}
            onChange={_handleSearch}
            onKeyDown={handleComplete}
            style={{ paddingRight: '2.75rem' }}
          />
          <Suggestion $suggestion={suggestion}>
            <Ghost>{suggestion}</Ghost>
            <BadgeItem>tab</BadgeItem>
          </Suggestion>
        </Search>
        <Wrapper className="w" style={{ paddingBottom: '0.5rem' }}>
          {Object.entries(schema).map(([title, actions]) => {
            if (actions.length === 0) return;

            return (
              <List role="list" key={title}>
                <Separator />
                <Title>{t(title)}</Title>
                {actions.map((command, index) => {
                  let { label, keys = [] } = resolveCommand(command);

                  label = command.includes('duplicate')
                    ? 'Duplicate tab'
                    : label;

                  const cmdIndex = commands.findIndex(c => c.includes(command));

                  return (
                    <ListItem
                      key={index}
                      data-name={t(label)}
                      onClick={() => handleSelect(cmdIndex, command)}
                      onMouseEnter={() => setSelectedIndex(cmdIndex)}
                      $isSelected={selectedIndex === cmdIndex}
                      $transition
                    >
                      <Label>{t(label)}</Label>
                      <Badges>
                        {keys.map((key, index) => (
                          <BadgeItem key={index}>{key}</BadgeItem>
                        ))}
                      </Badges>
                    </ListItem>
                  );
                })}
              </List>
            );
          })}
          <Warning style={{ display: 'none' }}>
            {t('No commands found')}
          </Warning>
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Commands);
