import { h, createElement } from 'preact';
import { memo, useState } from 'preact/compat';

import { getSettings, setSettings } from 'app/settings';
import schema from 'app/settings/schema';
import useStore from 'lib/store';

import {
  Container,
  Navigation,
  NavigationItem,
  Section,
  Wrapper,
  Title,
  Option,
  Content,
  Label,
  Input,
  Switch,
  SwitchSlider,
  Selector,
  Separator,
} from './styles';
import Application from './Application';
import Keymaps from './Keymaps';
import Profiles from './Profiles';

const Settings: React.FC = () => {
  const { current } = useStore();

  const [section, setSection] = useState<Section>('Application');

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

  const options = Object.entries(schema[section]).map(
    ([title, value], index) => (
      <Wrapper key={index}>
        {section !== 'Application' && (
          <Title>{title === 'Default' ? section : title}</Title>
        )}
        {Object.entries(value).map(([key, option], index) => {
          const { name, label, type, input, options, range } = option;

          const value = getSettings(false)[key];

          const handleUpdate = ({ currentTarget }) => {
            let { value, classList } = currentTarget;

            switch (type) {
              case 'number':
                value = Number(value);
                break;

              case 'boolean':
                value = classList.toggle('checked');
                break;
            }

            setSettings(key as keyof ISettings, value);
          };

          return (
            <Option key={index}>
              <Separator />
              <Content>
                <span>{name}</span>
                {input === 'checkbox' ? (
                  <Switch className={value && 'checked'} onClick={handleUpdate}>
                    <SwitchSlider />
                  </Switch>
                ) : input === 'select' ? (
                  <Selector $name={name} onChange={handleUpdate}>
                    {options?.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        selected={option === value}
                      >
                        {option}
                      </option>
                    ))}
                  </Selector>
                ) : (
                  <Input
                    $name={name}
                    type={type}
                    value={value}
                    onMouseUp={handleUpdate}
                    min={range?.min}
                    max={range?.max}
                    step={range?.step}
                  />
                )}
              </Content>
              <Label>{label}</Label>
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
    <Container $current={current}>
      <Navigation>
        {Object.keys(schema).map((value, index) => (
          <NavigationItem
            key={index}
            className={value === section && 'selected'}
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
