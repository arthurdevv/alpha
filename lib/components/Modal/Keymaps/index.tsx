import { memo, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { resolveCommand } from 'app/keymaps/schema';
import { execCommand } from 'app/keymaps/commands';
import { useSearchFilter } from 'lib/utils/hooks';
import schema from './schema';

import {
  BadgeItem,
  Badges,
  Ghost,
  Name as Label,
  List,
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
      <Tags style={{ paddingRight: '0.75rem' }}>
        <Tag $isTitle>{t('Keymaps')}</Tag>
        <Tag onClick={() => execCommand('app:settings', 'Keymaps')}>
          {t('Manage keymaps')}
        </Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput
            ref={ref}
            value={search}
            placeholder={t('Search for a command')}
            onChange={handleSearch}
            onKeyDown={handleComplete}
            style={{ paddingRight: '2.75rem' }}
          />
          <Suggestion $suggestion={suggestion}>
            <Ghost>{suggestion}</Ghost>
            <BadgeItem>tab</BadgeItem>
          </Suggestion>
        </Search>
        <Wrapper className="w">
          {Object.entries(schema).map(([group, commands], index) => (
            <List role="list" key={index}>
              <Separator />
              <Title>{t(group)}</Title>
              {Object.keys(commands).map((command, index) => {
                let { label, keys = [] } = resolveCommand(command);

                label = command.includes('duplicate') ? 'Duplicate tab' : label;

                return (
                  <Item key={index} data-name={t(label)}>
                    <Label>{t(label)}</Label>
                    <Badges>
                      {keys.map((key, index) => (
                        <BadgeItem key={index}>{key}</BadgeItem>
                      ))}
                    </Badges>
                  </Item>
                );
              })}
            </List>
          ))}
          <Warning style={{ display: 'none' }}>
            {t('No commands found')}
          </Warning>
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Keymaps);
