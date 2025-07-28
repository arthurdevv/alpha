import { h } from 'preact';
import { memo } from 'preact/compat';

import { getPaletteSchema, paletteCommands } from 'app/keymaps/schema';
import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';
import { onSearch } from 'lib/utils';

import {
  BadgeItem,
  Badges,
  Container,
  Content,
  Label,
  List,
  ListItem,
  Name,
  Search,
  SearchInput,
  Separator,
  Tag,
  Tags,
  Wrapper,
} from '../styles';

const Commands: React.FC<ModalProps> = (props: ModalProps) => {
  const { setModal } = useStore();

  const handleClick = (command: string) => {
    execCommand(command).then(() => setModal(null));
  };

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>Command Palette</Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput
            placeholder="Select or type a command"
            onChange={onSearch}
          />
        </Search>
        <Wrapper>
          {Object.entries(paletteCommands).map(([label, actions], index) => (
            <List role="list" key={index}>
              <Separator />
              <Label>{label}</Label>
              {actions.map((action, index) => {
                const {
                  command,
                  keys: [keys = []],
                } = getPaletteSchema(action);

                return (
                  <ListItem
                    key={index}
                    data-name={action}
                    onClick={() => handleClick(command)}
                  >
                    <Name>{action}</Name>
                    <Badges>
                      {keys.map((key, index) => (
                        <BadgeItem key={index}>{key}</BadgeItem>
                      ))}
                    </Badges>
                  </ListItem>
                );
              })}
            </List>
          ))}
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Commands);
