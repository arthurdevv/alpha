import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import { BrowserWindow } from '@electron/remote';
import { schema } from 'app/settings/schema';
import { getSettings, setSettings } from 'app/settings';
import {
  Wrapper,
  Navigation,
  NavigationItem,
  Section,
  Title,
  Separator,
  Container,
  InnerContent,
  Label,
  Input,
  Selector,
  Switch,
  SwitchThumb,
} from './styles';

const Settings: React.FC<{}> = () => {
  const [section, setSection] = useState<string>('Application');

  const [updatedSettings, updateSettings] = useState<ISettings>(getSettings());

  const handleSetSection = (event: React.TargetedEvent<HTMLElement>) => {
    const { innerText, classList, parentElement } = event.currentTarget;

    setSection(innerText);

    (parentElement as any).childNodes.forEach((element: Element) => {
      element.classList.remove('selected');
    });

    classList.add('selected');

    updateSettings(getSettings());
  };

  useEffect(() => {
    const focusedWindow = BrowserWindow.getFocusedWindow();

    if (focusedWindow) {
      const { setAlwaysOnTop } = focusedWindow;

      setAlwaysOnTop(updatedSettings.alwaysOnTop);
    }
  }, [updatedSettings.alwaysOnTop]);

  return (
    <Wrapper>
      <Navigation>
        {Object.keys(schema).map((value, index) => (
          <NavigationItem
            key={index}
            onClick={handleSetSection}
            className={value === section && 'selected'}
          >
            {value}
          </NavigationItem>
        ))}
      </Navigation>
      <Section>
        <Title>{section}</Title>
        {Object.keys(schema[section]).map((key, index) => {
          const { label, type, valueType, description, options, range } =
            schema[section][key];

          const keyValue = updatedSettings[key];

          const defaultValue = getSettings(true)[key];

          const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            ``;
            const { value: inputValue, classList } = event.currentTarget;

            const value =
              valueType !== 'boolean'
                ? valueType === 'number'
                  ? parseInt(inputValue, 10)
                  : inputValue
                : classList.toggle('checked');

            setSettings(key as keyof ISettings, value);

            const userSettings = getSettings();

            updatedSettings !== userSettings && updateSettings(updatedSettings);
          };

          return (
            <Container key={index}>
              <Separator />
              <InnerContent>
                <span>{label}</span>
                {type === 'checkbox' ? (
                  <Switch className={keyValue && 'checked'} onClick={onChange}>
                    <SwitchThumb />
                  </Switch>
                ) : type === 'select' ? (
                  <Selector label={label} onChange={onChange}>
                    {options?.map((value, index) => (
                      <option
                        key={index}
                        value={value}
                        selected={value === keyValue}
                      >
                        {value}
                      </option>
                    ))}
                  </Selector>
                ) : (
                  <Input
                    type={valueType}
                    value={keyValue}
                    placeholder={defaultValue}
                    onChange={onChange}
                    min={range?.min}
                    max={range?.max}
                  />
                )}
              </InnerContent>
              <Label>{description}</Label>
            </Container>
          );
        })}
      </Section>
    </Wrapper>
  );
};

export default memo(Settings);
