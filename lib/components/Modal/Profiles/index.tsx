import { Fragment, h } from 'preact';
import { memo, useState } from 'preact/compat';

import { createProfile, getGroups } from 'app/common/profiles';
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
  const { setProfile } = useStore();

  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const handleClick = (profile: IProfile | null) => {
    if (isSelecting) {
      return props
        .handleModal(undefined, 'Form')
        .then(() => setProfile(createProfile(profile)));
    }

    execCommand('terminal:create', profile).then(props.handleModal);
  };

  const getFilteredBadges = (profile: IProfile) => {
    let badges: (string | number)[] = [];

    if (profile.type === 'shell') {
      let { file, args } = profile.options;

      file = (args.find(arg => arg.includes('.exe')) ?? file)
        .split(/(\\|\/)/g)
        .pop()!;

      badges.push(file);
    } else if (profile.type === 'ssh') {
      const { host, port } = profile.options;

      badges.push(host, port);
    } else {
      const { path, baudRate } = profile.options;

      badges.push(path, baudRate);
    }

    return { ...profile, badges };
  };

  const groups = getGroups(false, isSelecting);

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>Profiles</Tag>
        {isSelecting ? (
          <Tag onClick={() => setIsSelecting(false)}>Cancel</Tag>
        ) : (
          <Fragment>
            <Tag onClick={() => setIsSelecting(true)}>Create new profile</Tag>
            <Tag onClick={() => execCommand('app:settings', 'Profiles')}>
              Manage profiles
            </Tag>
          </Fragment>
        )}
      </Tags>
      <Content>
        <Search>
          <SearchInput
            placeholder={`Select or type a profile${isSelecting ? ' to duplicate' : ''}`}
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
                  const { name, badges } = getFilteredBadges(profile);

                  return (
                    <ListItem
                      key={index}
                      data-name={name}
                      onClick={() => handleClick(profile)}
                    >
                      <Name>{name}</Name>
                      <Badges>
                        {badges.map((value, key) => (
                          <BadgeItem key={key}>{value}</BadgeItem>
                        ))}
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
