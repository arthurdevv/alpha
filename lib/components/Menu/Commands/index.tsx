import { h } from 'preact';
import { memo } from 'preact/compat';

import commands from './commands';
import { onSearch } from '../utils';

import { Keys, KeyItem } from './styles';
import {
  Container,
  Content,
  Tag,
  Search,
  SearchInput,
  Wrapper,
  Title,
  List,
  ListItem,
} from '../styles';
import { CommandPaletteIcon } from 'lib/components/Icon';

const Commands: React.FC<MenuProps> = ({ setMenu, isVisible }: MenuProps) => (
  <Container $isVisible={isVisible}>
    <Tag>
      <CommandPaletteIcon />
      Command Palette
    </Tag>
    <Content>
      <Search>
        <SearchInput
          placeholder="Select or type a command"
          onChange={onSearch}
        />
      </Search>
      <Wrapper>
        <List role="group">
          {Object.keys(commands).map((title, index) => {
            const { keys, exec } = commands[title];

            const handleClick = () =>
              exec().then(response => {
                if (response) {
                  setMenu(undefined);
                }
              });

            return (
              <ListItem key={index} data-title={title} onClick={handleClick}>
                <Title>{title}</Title>
                <Keys>
                  {keys.map((key, index) => (
                    <KeyItem key={index}>{key}</KeyItem>
                  ))}
                </Keys>
              </ListItem>
            );
          })}
        </List>
      </Wrapper>
    </Content>
  </Container>
);

export default memo(Commands);
