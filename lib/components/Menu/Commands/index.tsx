import { h } from 'preact';
import { memo, Fragment } from 'preact/compat';

import { menuCommands } from 'app/keymaps/commands';
import { Keys, KeyItem } from './styles';
import {
  Search,
  SearchInput,
  Separator,
  Wrapper,
  Title,
  Label,
  List,
  ListItem,
} from '../styles';
import { onSearch } from '../utils';

const Commands: React.FC<MenuProps> = (props: MenuProps) => (
  <Fragment>
    <Search>
      <SearchInput placeholder="Select or type a command" onInput={onSearch} />
    </Search>
    {Object.keys(menuCommands).map((tag, index) => {
      const tags = menuCommands[tag];

      return (
        <Wrapper key={index}>
          <Separator />
          <Title>{tag}</Title>
          <List role="group">
            {Object.keys(tags).map((label, index) => {
              const { keys, onClick } = tags[label];

              const handleClick = () => {
                onClick();

                props.hideMenu();
              };

              return (
                <ListItem
                  key={index}
                  state={props}
                  data-label={label}
                  onClick={handleClick}
                >
                  <Label>{label}</Label>
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
      );
    })}
  </Fragment>
);

export default memo(Commands);
