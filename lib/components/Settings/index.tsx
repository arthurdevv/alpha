import { createElement, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getSettings, setSettings } from 'app/settings';
import { getGroups } from 'app/common/profiles';
import listeners from 'app/settings/listeners';
import schema from 'app/settings/schema';

import {
  BadgeItem,
  Badges,
  Container,
  Content,
  Description,
  Input,
  Label,
  Navigation,
  NavigationItem,
  Option,
  Section,
  Selector,
  Separator,
  Switch,
  SwitchSlider,
  Title,
  Wrapper,
} from './styles';
import Application from './Application';
import Keymaps from './Keymaps';
import Profiles from './Profiles';

const initialSettings = getSettings();

function getProfiles(): Record<string, string[]> {
  const profiles = getGroups(true) as IProfile[];

  return {
    options: profiles.map(({ name }) => name),
    values: profiles.map(({ id }) => id),
  };
}

const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
  const [section, setSection] = useState<Section>('Application');

  const [profiles, setProfiles] = useState(getProfiles);

  const [transition, setTransition] = useState<boolean>(true);

  const handleSection = (value: Section) => {
    if (value !== section) {
      setTransition(false);

      setTimeout(() => {
        setTransition(true);

        setSection(value);
      }, 125);
    }
  };

  const handleBadges = ({ parentElement }) => {
    const option = parentElement.querySelector('div');

    const badges: HTMLElement = option.querySelector('div');

    if (badges) badges.classList.toggle('visible');
  };

  const handleBadgesClass = (key: string, value: any) =>
    initialSettings[key] === value ? undefined : 'visible';

  const handleUpdate = (
    key: string,
    { type, options, values }: ISettingsOption,
    { currentTarget },
  ) => {
    let { value, classList } = currentTarget;

    switch (type) {
      case 'number':
        value = Number(value);
        break;

      case 'boolean':
        value = classList.toggle('checked');
        handleBadges(currentTarget);
        break;
    }

    if (key === 'defaultProfile') {
      [options, values] = [profiles.options, profiles.values];
    }

    if (options && values) {
      const index = options.indexOf(value);

      value = values[index];
    }

    setSettings(key as keyof ISettings, value);
  };

  useEffect(() => {
    listeners.subscribe('options', () => setProfiles(getProfiles));
  }, []);

  const options = Object.entries(schema[section]).map(
    ([title, value], index) => (
      <Wrapper key={index}>
        {section !== 'Application' && (
          <Title>{title === 'Default' ? section : title}</Title>
        )}
        {Object.entries(value).map(([key, option], index) => {
          const { name, label, type, input, options, values, range, badges } =
            option;

          const value = getSettings()[key];

          const handleChange = handleUpdate.bind(null, key, option);

          return (
            <Option key={index}>
              <Separator />
              <Content>
                <Label>
                  {name}
                  {badges && (
                    <Badges className={handleBadgesClass(key, value)}>
                      {badges.map((text, index) => (
                        <BadgeItem key={index}>{text}</BadgeItem>
                      ))}
                    </Badges>
                  )}
                </Label>
                {input === 'checkbox' ? (
                  <Switch
                    className={value ? 'checked' : undefined}
                    onClick={handleChange}
                  >
                    <SwitchSlider />
                  </Switch>
                ) : input === 'select' ? (
                  <Selector $name={name} onChange={handleChange}>
                    {(options || profiles.options)?.map((option, index) => {
                      let selected = false;

                      if (values) {
                        selected = (values[index] || option) === value;
                      } else {
                        selected = profiles.values[index] === value;
                      }

                      return (
                        <option key={index} value={option} selected={selected}>
                          {option}
                        </option>
                      );
                    })}
                  </Selector>
                ) : (
                  <Input
                    $name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    {...range}
                  />
                )}
              </Content>
              <Description>{label}</Description>
            </Option>
          );
        })}
      </Wrapper>
    ),
  );

  const children = (() => {
    const element = createElement({ Application, Profiles, Keymaps }[section], {
      section,
      options,
    });

    return element.type ? element : null;
  })();

  return (
    <Container $origin={props.origin}>
      <Navigation>
        {Object.keys(schema).map((value, index) => (
          <NavigationItem
            key={index}
            className={value === section ? 'selected' : undefined}
            onClick={() => handleSection(value as Section)}
          >
            {value}
          </NavigationItem>
        ))}
      </Navigation>
      <Section $section={section} $transition={transition}>
        {children || options}
      </Section>
    </Container>
  );
};

export default memo(Settings);
