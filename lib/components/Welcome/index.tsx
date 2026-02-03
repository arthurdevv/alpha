import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { app } from '@electron/remote';

import { getSettings, setSettings } from 'app/settings';
import { changeLanguage } from 'lib/i18n';
import ipc from 'shared/ipc/renderer';

import Header from 'components/Header';
import Modal from 'components/Modal';
import { AlphaIcon, SpinnerDownIcon } from 'lib/components/Icons';
import {
  Description,
  Entry,
  Label,
  Option,
  Content as OptionContent,
  Selector,
  Separator,
  Spinner,
  Switch,
  SwitchSlider,
} from 'components/Settings/styles';
import {
  Container,
  Content,
  Footer,
  KeyItem,
  Keys,
  Logo,
  LogoName,
  Options,
  Subtitle,
  Texts,
  Title,
  Version,
  Wrapper,
} from './styles';
import schema from './schema';

const Welcome: React.FC<WelcomeProps> = ({ setIsFirstRun, setModal }) => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const [settings] = useState<ISettings>(() => getSettings());

  const { t } = useTranslation();

  const handleOption = async (
    key: string,
    { type, options, values }: ISettingsOption,
    { currentTarget },
  ) => {
    let { value, classList } = currentTarget;

    if (type === 'boolean') {
      value = classList.toggle('checked');
    } else if (options && values) {
      const index = options.indexOf(value);

      value = values[index];

      await changeLanguage(value);
    }

    setSettings(key as keyof ISettings, value);
  };

  const handleEnter = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();

    setShowWelcome(false);

    setTimeout(() => setIsFirstRun(false), 600);
    setTimeout(() => ipc.emit('app:renderer-ready'), 3900);
  };

  return (
    <Container $showWelcome={showWelcome} tabIndex={0} onKeyDown={handleEnter}>
      <Header welcome />
      <Content>
        <Logo>
          <AlphaIcon />
          <LogoName>LPHA</LogoName>
        </Logo>
        <Wrapper>
          <Texts>
            <Title>{t('Welcome to Alpha')}</Title>
            <Subtitle>{t('A modern terminal for modern workflows.')}</Subtitle>
          </Texts>
          <Options role="list">
            {Object.entries(schema).map(([key, option], index) => {
              const { name, label, input, options, values } = option;

              const value = settings[key];

              const handleChange = handleOption.bind(null, key, option);

              return (
                <Option key={index}>
                  <Separator
                    style={{ margin: index === 0 ? '0.125rem 0' : '0.75rem 0' }}
                  />
                  <OptionContent>
                    <Label>{t(name)}</Label>
                    {input === 'checkbox' ? (
                      <Switch
                        className={value ? 'checked' : undefined}
                        onClick={handleChange}
                      >
                        <SwitchSlider />
                      </Switch>
                    ) : (
                      <Entry>
                        <Selector onChange={handleChange}>
                          {options.map((option, index) => {
                            let selected = (values[index] || option) === value;

                            return (
                              <option
                                key={index}
                                value={option}
                                selected={selected}
                              >
                                {option}
                              </option>
                            );
                          })}
                        </Selector>
                        <Spinner $input={input}>
                          <SpinnerDownIcon />
                        </Spinner>
                      </Entry>
                    )}
                  </OptionContent>
                  <Description>{t(label)}</Description>
                </Option>
              );
            })}
          </Options>
        </Wrapper>
      </Content>
      <Footer>
        {t('Press')}
        <Keys>
          <KeyItem>Enter</KeyItem>
        </Keys>
        {t('to start using Alpha')}
        <Version onClick={() => setModal('About')}>{app.getVersion()}</Version>
      </Footer>
      <Modal />
    </Container>
  );
};

export default memo(Welcome);
