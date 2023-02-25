import { h, Fragment } from 'preact';
import { memo, useRef, useCallback } from 'preact/compat';

import userProfiles from 'app/common/profiles';
import {
  Overlay,
  Content,
  Search,
  SearchInput,
  Separator,
  Wrapper,
  Label,
  Group,
} from './styles';
import Profile from './element';

const Profiles: React.FC<ProfilesProps> = (props: ProfilesProps) => {
  const { recent } = props;

  const ref = useRef<HTMLElement | null>(null);

  const handleToggle = useCallback(
    (event: MouseEvent): void => {
      const { target, currentTarget } = event;

      if (target === currentTarget) {
        props.toggleProfiles();
      }
    },
    [props.isVisible],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;

    if (ref.current) {
      const profiles = Array.from(ref.current.getElementsByTagName('li'));

      profiles.forEach(profile => {
        const title = profile.getAttribute('data-title')?.toLowerCase();

        if (title) {
          const index = title.indexOf(value.toLowerCase());

          [profile].forEach(element => {
            element.style.display = index > -1 ? '' : 'none';
          });
        }
      });
    }
  };

  const sortAlphabetically = (profiles: IProfile[]): IProfile[] =>
    profiles.sort((a, b) => a.title.localeCompare(b.title));

  return props.isVisible ? (
    <Overlay role="presentation" onClick={handleToggle}>
      <Content>
        <Search>
          <SearchInput
            type="text"
            placeholder="Select or type a profile"
            onChange={handleSearch}
          />
        </Search>
        <Wrapper className={recent.length < 1 ? 'hidden' : undefined}>
          <Separator />
          <Label>Recent</Label>
          <Group role="group">
            {sortAlphabetically(recent).map((profile: IProfile, key) => {
              const { title, shell } = profile;

              const mappedProps: ProfileProps = {
                title,
                shell,
                onSelect: props.onSelect.bind(null, profile),
              };

              return <Profile {...mappedProps} key={key} />;
            })}
            <Profile
              title="Clear recently opened"
              shell=""
              onSelect={props.clearRecent}
            />
          </Group>
        </Wrapper>
        <Wrapper ref={ref}>
          <Separator />
          <Label>Profiles</Label>
          <Group role="group">
            {sortAlphabetically(userProfiles).map((profile: IProfile, key) => {
              const { title, shell } = profile;

              const mappedProps: ProfileProps = {
                title,
                shell,
                onSelect: props.onSelect.bind(null, profile),
              };

              return <Profile {...mappedProps} key={key} />;
            })}
          </Group>
        </Wrapper>
      </Content>
    </Overlay>
  ) : (
    <Fragment />
  );
};

export default memo(Profiles);
