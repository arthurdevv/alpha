import { h } from 'preact';
import { memo } from 'preact/compat';

import { menuCommands } from 'app/keymaps/schema';
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
  Wrapper,
} from '../styles';

const Commands: React.FC<ModalProps> = ({ isVisible }: ModalProps) => {
  const { setModal } = useStore();

  const handleClick = (action: () => Promise<boolean>) =>
    action().then(() => {
      setModal(undefined);
    });

  return (
    <Container $isVisible={isVisible}>
      <Tag>Command Palette</Tag>
      <Content>
        <Search>
          <SearchInput
            placeholder="Select or type a command"
            onChange={onSearch}
          />
        </Search>
        <Wrapper>
          {Object.keys(menuCommands).map((group, index) => {
            const commands = menuCommands[group];

            return (
              <List role="group" key={index}>
                <Separator />
                <Label>{group}</Label>
                {commands.map(({ name, keys, action }, index) => (
                  <ListItem
                    key={index}
                    data-name={name}
                    onClick={() => handleClick(action)}
                  >
                    <Name>{name}</Name>
                    <Badges>
                      {keys.map((key, index) => (
                        <BadgeItem key={index}>{key}</BadgeItem>
                      ))}
                    </Badges>
                  </ListItem>
                ))}
              </List>
            );
          })}
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Commands);
