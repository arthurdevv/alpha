import { h, Fragment } from 'preact';
import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';

import { getSettings, setSettings } from 'app/settings';
import schema from './schema';

import {
  Container,
  Navigation,
  NavigationItem,
  Section,
  Title,
  Key,
  KeyContent,
  KeyLabel,
  Input,
  Selector,
  Separator,
  Switch,
  SwitchThumb,
} from './styles';
import Application from './Application';
import Keymaps from './Keymaps';

const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
  const [section, setSection] = useState<Section>('Application');

  const handleSection = (event: React.TargetedEvent<HTMLElement>) => {
    const { innerText, classList, parentElement } = event.currentTarget;

    setSection(innerText as Section);

    parentElement?.childNodes.forEach(element => {
      (element as Element).classList.remove('selected');
    });

    classList.add('selected');
  };

  return props.isCurrent ? (
    <Container>
      <Navigation>
        {Object.keys(schema).map((value, index) => (
          <NavigationItem
            key={index}
            onClick={handleSection}
            className={value === section && 'selected'}
          >
            {value}
          </NavigationItem>
        ))}
      </Navigation>
      {section !== 'Keymaps' ? (
        <Section $section={section}>
          {section === 'Application' ? (
            <Application />
          ) : (
            <Title>{section}</Title>
          )}
          {Object.keys(schema[section]).map((key, index) => {
            const { label, type, valueType, description, options, range } =
              schema[section][key];

            const keyValue = getSettings(false)[key];

            const defaultValue = getSettings(true)[key];

            const handleUpdate = (
              event: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const { value: inputValue, classList } = event.currentTarget;

              let value: string | number | boolean;

              switch (valueType) {
                case 'number':
                  value = Number(inputValue);
                  break;

                case 'boolean':
                  value = classList.toggle('checked');
                  break;

                default:
                  value = inputValue;
              }

              setSettings(key as keyof ISettings, value);
            };

            return (
              <Key key={index}>
                <Separator />
                <KeyContent>
                  <span>{label}</span>
                  {type === 'checkbox' ? (
                    <Switch
                      className={keyValue && 'checked'}
                      onClick={handleUpdate}
                    >
                      <SwitchThumb />
                    </Switch>
                  ) : type === 'select' ? (
                    <Selector label={label} onChange={handleUpdate}>
                      {options?.map((value, index) => (
                        <option
                          key={index}
                          value={value}
                          selected={value === keyValue}
                        >
                          {key === 'shell' ? value.split('\\').pop() : value}
                        </option>
                      ))}
                    </Selector>
                  ) : (
                    <Input
                      type={valueType}
                      value={keyValue}
                      label={label}
                      placeholder={defaultValue}
                      onChange={handleUpdate}
                      min={range?.min}
                      max={range?.max}
                      step={range?.step}
                    />
                  )}
                </KeyContent>
                <KeyLabel>{description}</KeyLabel>
              </Key>
            );
          })}
        </Section>
      ) : (
        <Section $section={section}>
          <Title>{section}</Title>
          <Keymaps />
        </Section>
      )}
    </Container>
  ) : (
    <Fragment />
  );
};

export default memo(Settings);
