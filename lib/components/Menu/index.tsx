import { h } from 'preact';
import { memo, Fragment } from 'preact/compat';
import { useState, useRef, useCallback, useEffect } from 'preact/hooks';

import userProfiles from 'app/common/profiles';
import { menuCommands } from 'app/common/keymaps/commands';
import {
  Overlay,
  Content,
  Search,
  SearchInput,
  Separator,
  Wrapper,
  Label,
  Group,
  Container,
  Title,
  Shell,
  Keys,
  KeyItem,
} from './styles';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const { menu, recent } = props;

  const ref = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState<boolean>(false);

  const handleVisible = (): void => {
    setVisible(false);

    setTimeout(() => {
      props.setMenu(null);
    }, 200);
  };

  const handleOverlayClick = useCallback((event: MouseEvent): void => {
    const { target, currentTarget } = event;

    if (target === currentTarget) handleVisible();
  }, []);

  const handleClick = useCallback((callback: () => void) => {
    callback();

    handleVisible();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;

    if (ref.current) {
      const items = Array.from(ref.current.getElementsByTagName('li'));

      items.forEach(element => {
        const dataTitle = element.getAttribute('data-title')?.toLowerCase();

        if (dataTitle) {
          const index = dataTitle.indexOf(value.toLowerCase());

          element.style.display = index > -1 ? '' : 'none';
        }
      });
    }
  };

  const sortAlphabetically = (profiles: IProfile[]): IProfile[] =>
    profiles.sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => setVisible(Boolean(props.menu)), [props.menu]);

  return (
    <Overlay menu={menu} onClick={handleOverlayClick}>
      <Content visible={visible} ref={ref}>
        <Search>
          <SearchInput
            type="text"
            onChange={handleSearch}
            placeholder={`Select or type a ${
              menu === 'Profiles' ? 'profile' : 'command'
            }`}
          />
        </Search>
        {menu === 'Commands' ? (
          Object.keys(menuCommands).map((tag, index) => {
            const tags = menuCommands[tag];

            return (
              <Wrapper ref={ref} key={index}>
                <Separator />
                <Label>{tag}</Label>
                <Group role="group">
                  {Object.keys(tags).map((title, index) => {
                    const { keys, onClick } = tags[title];

                    return (
                      <Container
                        data-title={title}
                        onClick={() => handleClick(onClick)}
                        menuType={props.menu}
                        key={index}
                      >
                        <Title>{title}</Title>
                        <Keys>
                          {keys.map((key: string, index: number) => (
                            <KeyItem key={index}>{key}</KeyItem>
                          ))}
                        </Keys>
                      </Container>
                    );
                  })}
                </Group>
              </Wrapper>
            );
          })
        ) : (
          <Fragment>
            <Wrapper className={recent.length < 1 ? 'hidden' : undefined}>
              <Separator />
              <Label>Recent</Label>
              <Group role="group">
                {sortAlphabetically(recent).map((profile: IProfile, index) => {
                  const { title, shell } = profile;

                  const onClick = props.selectProfile.bind(null, profile);

                  return (
                    <Container
                      data-title={title}
                      onClick={() => handleClick(onClick)}
                      menuType={props.menu}
                      key={index}
                    >
                      <Title>{title}</Title>
                      <Shell>{shell}</Shell>
                    </Container>
                  );
                })}
                <Container onClick={() => handleClick(props.clearRecent)}>
                  <Title>Clear recently opened</Title>
                </Container>
              </Group>
            </Wrapper>
            <Wrapper ref={ref}>
              <Separator />
              <Label>Profiles</Label>
              <Group role="group">
                {sortAlphabetically(userProfiles).map(
                  (profile: IProfile, index) => {
                    const { title, shell } = profile;

                    const onClick = props.selectProfile.bind(null, profile);

                    return (
                      <Container
                        data-title={title}
                        onClick={() => handleClick(onClick)}
                        menuType={props.menu}
                        key={index}
                      >
                        <Title>{title}</Title>
                        <Shell>{shell}</Shell>
                      </Container>
                    );
                  },
                )}
              </Group>
            </Wrapper>
          </Fragment>
        )}
      </Content>
    </Overlay>
  );
};

export default memo(Menu);
