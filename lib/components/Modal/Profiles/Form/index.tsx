import { h } from 'preact';
import React, {
  createElement,
  Fragment,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'preact/compat';

import { dialog, getCurrentWindow } from '@electron/remote';
import { getSettings, setSettings } from 'app/settings';
import useStore from 'lib/store';

import { Search, SearchInput } from 'components/Modal/styles';
import { SpinnerDownIcon, SpinnerIcon } from 'components/Icons';
import {
  Container,
  Content,
  Description,
  Dialog,
  Entry,
  Input,
  Option,
  OptionContent,
  Selector,
  Separator,
  Spinner,
  Switch,
  SwitchSlider,
  Tag,
  Tags,
  Wrapper,
} from './styles';
import EnvironmentForm from './env';
import ConnectionForm from './connection';
import schema from './schema';

let cachedSection: string = 'general';

const Form: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const { profile, setProfile } = useStore();

  const [section, setSection] = useState<string>('general');

  const [isFilled, setFilled] = useState<boolean>(false);

  const [fade, setFade] = useState(false);

  const handleSection = (
    { currentTarget: { innerText } },
    value: string,
    toggle = false,
  ) => {
    if (toggle) {
      const section = value === 'advanced' ? 'general' : 'advanced';

      cachedSection =
        section !== cachedSection ? section : innerText.toLowerCase();
    }

    handleFade(toggle ? cachedSection : value);
  };

  const handleSingleSection = () => {
    const index = 1 - tags.indexOf(section);

    handleFade(tags[index]);
  };

  const handleChange = (key: string, { currentTarget: { value } }) => {
    const target = key in profile.options ? profile.options : profile;

    target[key] = value;

    handleIsFilled();
  };

  const handleSave = () => {
    const { profiles } = getSettings();

    const [localProfile] = profiles.filter(({ id }) => id === profile.id);

    if (localProfile) {
      const index = profiles.indexOf(localProfile);

      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }

    setSettings('profiles', profiles, handleModal);
  };

  const handleFade = (value: string) => {
    if (section === value) return;

    setFade(true);

    setTimeout(() => {
      setSection(value);

      setFade(false);
    }, 100);
  };

  const handleIsFilled = () => {
    const values: any[] = [];

    const getValidation = (options: object) => {
      Object.values(options).forEach(value => {
        if (!value) return;

        if (typeof value === 'object') {
          getValidation(value);
        } else if (typeof value !== 'boolean') {
          values.push(value);
        }
      });
    };

    getValidation(profile);

    const isFilled = values.every(value => !!value === true);

    setFilled(isFilled);

    return isFilled;
  };

  useEffect(() => {
    handleIsFilled();

    return () => {
      setProfile(null);
    };
  }, []);

  const tags = useMemo(
    () => (profile ? Object.keys(schema[profile.type]) : []),
    [profile],
  );

  const content = useMemo(() => {
    const entries = schema[profile.type][section];

    let properties: Record<string, string> | any[] = {};

    if (entries.key in profile.options) {
      const values = profile.options[entries.key];

      properties = Array.isArray(values) ? values : Object.entries(values);
    }

    return { schema: entries, properties };
  }, [profile, section]);

  const componentMap = {
    shell: EnvironmentForm,
    ...Object.fromEntries(['ssh', 'serial'].map(t => [t, ConnectionForm])),
  } as const;

  return (
    <Container $width={45} $isVisible={isVisible}>
      <Tags>
        <Tag $isTitle>Profile</Tag>
        {tags.length <= 2 ? (
          <Tag onClick={handleSingleSection}>
            {tags[1 - tags.indexOf(section)]}
          </Tag>
        ) : (
          <Fragment>
            <Tag onClick={event => handleSection(event, section, true)}>
              {cachedSection === 'general' ? 'advanced' : 'general'}
            </Tag>
            {tags.slice(2).map((section, index) => (
              <Tag onClick={event => handleSection(event, section)} key={index}>
                {section}
              </Tag>
            ))}
          </Fragment>
        )}
        <Tag onClick={handleModal}>Cancel</Tag>
        <Tag
          onClick={isFilled ? handleSave : undefined}
          style={{ cursor: isFilled === false ? 'not-allowed' : 'pointer' }}
        >
          Save
        </Tag>
      </Tags>
      <Content $maxHeight={20.4} style={{ overflow: 'auto' }}>
        {section === 'general' && (
          <Search $fade={fade}>
            <SearchInput
              placeholder="Name"
              value={profile.name}
              onChange={event => handleChange('name', event)}
            />
          </Search>
        )}
        <Wrapper $section={section} $fade={fade}>
          {createElement(componentMap[profile.type], {
            ...content,
            section,
            profile,
            setProfile,
          } as ProfileFormProps)}
        </Wrapper>
      </Content>
    </Container>
  );
};

export const FormOption: React.FC<ProfileFormOptionProps> = (
  props: ProfileFormOptionProps,
) => {
  const { option, profile, value } = props;

  const handleSpinner = (key: string, action: -1 | 1, { currentTarget }) => {
    const input = currentTarget.closest('.number').querySelector('input');

    input[action === 1 ? 'stepUp' : 'stepDown']();

    profile.options[key] = Number(input.value);
  };

  const handleOption = (
    key: string,
    { currentTarget: { value, type, dataset } },
  ) => {
    const target = key in profile.options ? profile.options : profile;

    if (!type) {
      target[key] = !target[key];

      props.setProfile({ ...profile });
    } else {
      target[key] =
        type === 'number' || options?.every(value => typeof value === 'number')
          ? Number(value)
          : value;
    }

    if (dataset.auth) props.setAuthType && props.setAuthType(value);
  };

  const handleDialog = (key: string) => {
    dialog
      .showOpenDialog(getCurrentWindow(), {
        properties: ['openFile'],
        buttonLabel: 'Select private key file',
      })
      .then(({ filePaths: [path], canceled }) => {
        if (!canceled) {
          profile.options[key] = path;

          props.setProfile({ ...profile });
        }
      });
  };

  const { key, label, description, type, options, values } = option;

  const handleChange = handleOption.bind(null, key);

  return (
    <Option>
      <Separator />
      <OptionContent>
        <span>{label}</span>
        {options ? (
          <Entry>
            <Selector data-auth={key === 'authType'} onChange={handleChange}>
              {options.map((option, index) => {
                const selected = values ? values[index] === value : false;

                return (
                  <option
                    key={option}
                    value={values && values[index]}
                    selected={selected}
                  >
                    {option}
                  </option>
                );
              })}
            </Selector>
            <Spinner style={{ top: '-0.0625rem' }} $input="text">
              <SpinnerDownIcon />
            </Spinner>
          </Entry>
        ) : type === 'checkbox' ? (
          <Switch
            className={value ? 'checked' : undefined}
            onClick={handleChange as any}
          >
            <SwitchSlider />
          </Switch>
        ) : type === 'text' || type === 'number' || type === 'password' ? (
          <Entry $flex={true} className={type}>
            <Input
              type={type}
              value={value}
              placeholder={type === 'password' ? 'Enter password' : '...'}
              onChange={handleChange}
              $width="calc(25ch + 0.125rem)"
            />
            {type === 'number' && (
              <Spinner $input={type} style={{ top: 1 }}>
                <SpinnerIcon
                  arg0={event => handleSpinner(key, 1, event)}
                  arg1={event => handleSpinner(key, -1, event)}
                />
              </Spinner>
            )}
          </Entry>
        ) : (
          <Fragment>
            <Dialog title={value} onClick={() => handleDialog(key)}>
              {value || 'Upload key...'}
            </Dialog>
          </Fragment>
        )}
      </OptionContent>
      <Description>
        {type === 'password'
          ? 'Password used for authentication.'
          : type === 'dialog'
            ? 'Private key file used for authentication.'
            : description}
      </Description>
    </Option>
  );
};

export default memo(Form);
