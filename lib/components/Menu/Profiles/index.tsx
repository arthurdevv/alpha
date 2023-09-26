import { h } from 'preact';
import { memo } from 'preact/compat';

import profiles from 'app/common/profiles';
import { execCommand } from 'app/keymaps';
import { sortArray, onSearch } from '../utils';

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
import { ProfilesIcon } from 'lib/components/Icon';
import { KeyItem, Keys } from '../Commands/styles';

const Profiles: React.FC<MenuProps> = ({ setMenu, isVisible }: MenuProps) => (
  <Container $isVisible={isVisible}>
    <Tag>
      <ProfilesIcon />
      Profiles
    </Tag>
    <Content>
      <Search>
        <SearchInput
          placeholder="Select or type a profile"
          onChange={onSearch}
        />
      </Search>
      <Wrapper>
        <List role="group">
          {sortArray(profiles).map((profile: IProfile, index) => {
            const { title, shell } = profile;

            const handleClick = () =>
              execCommand('terminal:create', profile).then(response => {
                if (response) {
                  setMenu(undefined);
                }
              });

            return (
              <ListItem key={index} data-title={title} onClick={handleClick}>
                <Title>{title}</Title>
                <Keys>
                  <KeyItem>{shell.split(/(\\|\/)/g).pop()}</KeyItem>
                </Keys>
              </ListItem>
            );
          })}
        </List>
      </Wrapper>
    </Content>
  </Container>
);

export default memo(Profiles);
