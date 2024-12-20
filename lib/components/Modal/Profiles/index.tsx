import { h } from 'preact';
import { memo } from 'preact/compat';

import { getGroups } from 'app/common/profiles';
import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';
import { onSearch, sortArray } from 'lib/utils';

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

const Profiles: React.FC<ModalProps> = (props: ModalProps) => {
  const groups = getGroups();

  const { setProfile } = useStore();

  const handleClick = (profile: IProfile) => {
    execCommand('terminal:create', profile).then(props.handleModal);
  };

  const handleCreate = () => {
    props.handleModal(undefined, 'Form').then(() => setProfile(null));
  };

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag>Profiles</Tag>
        <Tag $isAction onClick={handleCreate}>
          Create new profile
        </Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput
            placeholder="Select or type a profile"
            onChange={onSearch}
          />
        </Search>
        <Wrapper>
          {Object.keys(groups).map((name, index) => {
            const group = groups[name];

            return (
              <List role="group" key={index}>
                <Separator />
                <Label>{name}</Label>
                {sortArray(group).map((profile: IProfile, index) => {
                  const { name, options } = profile;

                  return (
                    <ListItem
                      key={index}
                      data-name={name}
                      onClick={() => handleClick(profile)}
                    >
                      <Name>{name}</Name>
                      <Badges>
                        <BadgeItem>
                          {options.shell.split(/(\\|\/)/g).pop()}
                        </BadgeItem>
                      </Badges>
                    </ListItem>
                  );
                })}
              </List>
            );
          })}
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Profiles);
