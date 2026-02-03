import { createElement } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { getSettings, setSettings } from 'app/settings';
import { getGroups } from 'app/common/profiles';
import listeners from 'app/settings/listeners';
import storage from 'app/utils/local-storage';
import useStore from 'lib/store';
import { getAutomaticLanguage } from 'lib/i18n';

import schema from './schema';
import {
  BadgeItem,
  Badges,
  Container,
  Content,
  Description,
  Entry,
  Input,
  Label,
  Navigation,
  NavigationItem,
  Option,
  Section,
  Selector,
  Separator,
  Spinner,
  Switch,
  SwitchSlider,
  Title,
  Wrapper,
} from './styles';
import { SpinnerDownIcon, SpinnerIcon } from '../Icons';
import Application from './Application';
import Appearance from './Appearance';
import Keymaps from './Keymaps';
import Profiles from './Profiles';
import Workspaces from './Workspaces';
import Config from './Config';

const initialSettings = getSettings();

function getEntityOptions(entity?: string) {
  let target: (IProfile | IWorkspace)[] = [];

  if (!entity) return { options: [], values: [] };

  if (entity === 'profiles') {
    target = getGroups(true) as IProfile[];
  } else {
    const blankWorkspaces: any[] = [{ id: false, name: 'None', tabs: [] }];

    target = blankWorkspaces.concat(getSettings().workspaces);
  }

  return {
    options: target.map(({ name }) => name),
    values: target.map(({ id }) => id),
  };
}

const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
  const [section, setSection] = useState<Section>(() =>
    storage.parseItem('section', 'Application'),
  );

  const [entityOptions, setEntityOptions] = useState(() => getEntityOptions());

  const [transition, setTransition] = useState<boolean>(true);

  const { t } = useTranslation();

  const handleSection = (value: Section) => {
    if (value !== section) {
      setTransition(false);

      setTimeout(() => {
        setTransition(true);

        setSection(value);
      }, 125);

      storage.updateItem('section', value);

      document
        .querySelector('section')
        ?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBadges = ({ parentElement }) => {
    const option = parentElement.querySelector('div');

    const badges = option.querySelector('div');

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

    if (key === 'defaultProfile' || key === 'workspace') {
      [options, values] = [entityOptions.options, entityOptions.values];
    }

    if (options && values) {
      const index = options.indexOf(value);

      value = values[index];

      if (key === 'language') value = getAutomaticLanguage(value);
    }

    setSettings(key as keyof ISettings, value);
  };

  const handleSpinner = (
    key: string,
    action: -1 | 1,
    { max, min, step }: any,
  ) => {
    const prop = getSettings()[key] as number;

    const value =
      Math.round((prop + (step ? action * Number(step) : action)) * 100) / 100;

    if (value <= Number(max) && value >= Number(min)) {
      setSettings(key as keyof ISettings, value);
    }
  };

  const handleEntityOptions = (section: string) => {
    const entity = section.toLowerCase();

    if (['profiles', 'workspaces'].includes(entity)) {
      const entityOptions = getEntityOptions(entity);

      setEntityOptions(entityOptions);
    }
  };

  useEffect(() => {
    const { unsubscribe } = listeners.subscribe('options', () =>
      handleEntityOptions(section),
    );

    global.handleSection = handleSection;

    return () => {
      unsubscribe();
    };
  }, [section]);

  const customSections = ['Application', 'Profiles', 'Workspaces'];

  const options = Object.entries(schema[section]).map(
    ([title, value], index) => (
      <Wrapper key={index}>
        {!customSections.includes(section) && (
          <Title>{t(title === 'Default' ? section : title)}</Title>
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
                  {t(name)}
                  {badges && (
                    <Badges className={handleBadgesClass(key, value)}>
                      {badges.map((text, index) => (
                        <BadgeItem key={index}>{t(text)}</BadgeItem>
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
                  <Entry>
                    <Selector onChange={handleChange} id="mySelect">
                      {(options || entityOptions.options)?.map(
                        (option, index) => {
                          let selected = false;

                          if (values) {
                            selected = (values[index] || option) === value;
                          } else {
                            selected = entityOptions.values[index] === value;
                          }

                          return (
                            <option
                              key={index}
                              value={option}
                              selected={selected}
                            >
                              {t(`${option}`)}
                            </option>
                          );
                        },
                      )}
                    </Selector>
                    <Spinner $input={input}>
                      <SpinnerDownIcon />
                    </Spinner>
                  </Entry>
                ) : (
                  <Entry>
                    <Input
                      type={type}
                      value={value}
                      onChange={handleChange}
                      placeholder="..."
                      {...(type === 'number' ? range : {})}
                    />
                    {type === 'number' && (
                      <Spinner $input={input}>
                        <SpinnerIcon
                          arg0={() => handleSpinner(key, 1, range)}
                          arg1={() => handleSpinner(key, -1, range)}
                        />
                      </Spinner>
                    )}
                  </Entry>
                )}
              </Content>
              <Description>{t(label)}</Description>
            </Option>
          );
        })}
      </Wrapper>
    ),
  );

  const children = (() => {
    const element = createElement(
      {
        Application,
        Appearance,
        Profiles,
        Keymaps,
        Workspaces,
        'Config file': Config,
      }[section],
      { section, options, store: useStore(), t },
    );

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
            {t(value)}
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
