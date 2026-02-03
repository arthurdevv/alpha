import React, {
  createElement,
  Fragment,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'preact/compat';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  const handleSection = (
    { currentTarget: { ariaLabel } },
    value: string,
    toggle = false,
  ) => {
    if (toggle) {
      const section = value === 'advanced' ? 'general' : 'advanced';

      cachedSection =
        section !== cachedSection ? section : ariaLabel.toLowerCase();
    }

    handleFade(toggle ? cachedSection : value);
  };

  const handleSingleSection = () => {
    const index = 1 - tags.indexOf(section);

    handleFade(tags[index]);
  };

  const handleChange = (key: string, { currentTarget: { value } }) => {
    if (!value) return;

    const target = key in profile.options ? profile.options : profile;

    target[key] = value;

    handleIsFilled();
  };

  const handleBlur = (key: string, { currentTarget }) => {
    const { value } = currentTarget;

    if (!value)
      currentTarget.value =
        key in profile ? profile[key] : profile.options[key];
  };

  const handleSave = (modal = true) => {
    const { profiles } = getSettings();

    const [localProfile] = profiles.filter(({ id }) => id === profile.id);

    if (localProfile) {
      const index = profiles.indexOf(localProfile);

      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }

    setSettings('profiles', profiles, modal ? handleModal : undefined);
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
        <Tag $isTitle>{t('Profile')}</Tag>
        {tags.length <= 2 ? (
          <Tag aria-label={cachedSection} onClick={handleSingleSection}>
            {t(tags[1 - tags.indexOf(section)])}
          </Tag>
        ) : (
          <Fragment>
            <Tag
              aria-label={cachedSection}
              onClick={event => handleSection(event, section, true)}
            >
              {t(cachedSection === 'general' ? 'advanced' : 'general')}
            </Tag>
            {tags.slice(2).map((section, index) => (
              <Tag
                aria-label={cachedSection}
                onClick={event => handleSection(event, section)}
                key={index}
              >
                {t(section)}
              </Tag>
            ))}
          </Fragment>
        )}
        <Tag
          onClick={isFilled ? () => handleSave(true) : undefined}
          style={{ cursor: isFilled === false ? 'not-allowed' : 'pointer' }}
        >
          {t('Save')}
        </Tag>
        <Tag onClick={handleModal}>{t('Cancel')}</Tag>
      </Tags>
      <Content $maxHeight={20.4} style={{ overflow: 'auto' }}>
        {section === 'general' && (
          <Search $fade={fade}>
            <SearchInput
              placeholder={profile.name}
              value={profile.name}
              onChange={event => handleChange('name', event)}
              onBlur={event => handleBlur('name', event)}
            />
          </Search>
        )}
        <Wrapper $section={section} $fade={fade}>
          {createElement(componentMap[profile.type], {
            ...content,
            section,
            profile,
            setProfile,
            handleSave,
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

  const { t } = useTranslation();

  const handleSpinner = (key: string, action: -1 | 1, { currentTarget }) => {
    const input = currentTarget.closest('.number').querySelector('input');

    input[action === 1 ? 'stepUp' : 'stepDown']();

    profile.options[key] = Number(input.value);
  };

  const handleOption = (
    key: string,
    { currentTarget: { value, type, dataset } },
  ) => {
    if (type === 'text' && !value) return;

    const target = key in profile.options ? profile.options : profile;

    if (!type) {
      target[key] = !target[key];

      props.setProfile({ ...profile });
    } else {
      if (key === 'cwd' || key === 'file') value = String.raw`${value}`;

      target[key] =
        type === 'number' || options?.every(value => typeof value === 'number')
          ? Number(value)
          : value;
    }

    if (dataset.auth) props.setAuthType && props.setAuthType(value);
  };

  const handleBlur = (
    key: string,
    type: string | undefined,
    { currentTarget },
  ) => {
    const { value } = currentTarget;

    if (type === 'text' && !value)
      currentTarget.value =
        key in profile ? profile[key] : profile.options[key];
  };

  const handleDialog = (key: string) => {
    dialog
      .showOpenDialog(getCurrentWindow(), {
        properties: ['openFile'],
        buttonLabel: t('Select private key file'),
      })
      .then(({ filePaths: [path], canceled }) => {
        if (!canceled) {
          profile.options[key] = path;

          props.setProfile({ ...profile });
        }
      });
  };

  const { key, label, description, type, options, values } = option;

  const onChange = handleOption.bind(null, key);
  const onBlur = handleBlur.bind(null, key, type);

  return (
    <Option>
      <Separator />
      <OptionContent>
        <span>{t(label || '')}</span>
        {options ? (
          <Entry>
            <Selector data-auth={key === 'authType'} onChange={onChange}>
              {options.map((option, index) => {
                const selected = values ? values[index] === value : false;

                return (
                  <option
                    key={option}
                    value={values && values[index]}
                    selected={selected}
                  >
                    {t(`${option}`)}
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
            onClick={onChange as any}
          >
            <SwitchSlider />
          </Switch>
        ) : type === 'text' || type === 'number' || type === 'password' ? (
          <Entry $flex={true} className={type}>
            <Input
              type={type}
              value={
                key === 'group' && value === 'Ungrouped'
                  ? t('Ungrouped')
                  : value
              }
              placeholder={type === 'password' ? t('Enter password') : value}
              onChange={onChange}
              onBlur={onBlur}
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
              {value || t('Upload key...')}
            </Dialog>
          </Fragment>
        )}
      </OptionContent>
      <Description>
        {t(
          type === 'password'
            ? 'Password used for authentication.'
            : type === 'dialog'
              ? 'Private key file used for authentication.'
              : description!,
        )}
      </Description>
    </Option>
  );
};

export default memo(Form);
