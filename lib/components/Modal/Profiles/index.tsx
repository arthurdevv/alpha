import { h } from 'preact';
import { memo } from 'preact/compat';

import { getGroups } from 'app/common/profiles';
import { execCommand } from 'app/keymaps';
import { onSearch, sortArray } from 'lib/utils';
import useStore from 'lib/store';

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

const Profiles: React.FC<ModalProps> = ({
  handleModal,
  isVisible,
}: ModalProps) => {
  const groups = getGroups();

  const { setProfile } = useStore();

  const handleClick = (profile: IProfile) => {
    execCommand('terminal:create', profile).then(() => {
      handleModal();
    });
  };

  const handleCreate = () => {
    handleModal(undefined, 'Form');

    setProfile(undefined);
  };

  return (
    <Container $isVisible={isVisible}>
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
