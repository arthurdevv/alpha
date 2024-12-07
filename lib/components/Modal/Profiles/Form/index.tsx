import { Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getSettings, setSettings } from 'app/settings';
import { createProfile } from 'app/common/profiles';
import useStore from 'lib/store';

import Enviroment from './env';
import {
  Container,
  Content,
  Description,
  Input,
  Option,
  OptionContent,
  Search,
  SearchInput,
  Separator,
  Switch,
  SwitchSlider,
  Tag,
  Tags,
  Wrapper,
} from './styles';

const Form: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const { profile, setProfile, updateProfile } =
    useStore() as NestedExclude<AlphaStore>;

  const [isEnv, setIsEnv] = useState<boolean>(false);

  const [isFilled, setFilled] = useState<boolean>(false);

  const handleIsFilled = () => {
    const values: any[] = [];

    const getValidation = (options: object) => {
      Object.values(options).forEach(value => {
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

  const handleUpdate = ({ currentTarget }) => {
    const { value, ariaLabel } = currentTarget;

    updateProfile(ariaLabel, value);

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

  useEffect(() => {
    if (!profile) {
      const blankProfile = createProfile();

      setProfile(blankProfile);
    } else {
      handleIsFilled();
    }
  }, []);

  if (profile) {
    const { name, group, title, options } = profile;

    return (
      <Container $width={45} $isVisible={isVisible}>
        <Tags>
          <Tag>Profile</Tag>
          <Tag $isAction onClick={() => setIsEnv(!isEnv)}>
            {isEnv ? 'Options' : 'Enviroment'}
          </Tag>
          <Tag $isAction onClick={handleModal}>
            Cancel
          </Tag>
          <Tag
            $isAction
            onClick={isFilled ? handleSave : undefined}
            style={{ cursor: isFilled === false ? 'not-allowed' : 'pointer' }}
          >
            Save
          </Tag>
        </Tags>
        <Content $maxHeight={21.375}>
          {isEnv ? (
            <Enviroment profile={profile} setProfile={setProfile} />
          ) : (
            <Fragment>
              <Search>
                <SearchInput
                  aria-label="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleUpdate}
                />
              </Search>
              <Wrapper>
                <Option>
                  <Separator />
                  <OptionContent>
                    <span>Group</span>
                    <Input
                      aria-label="group"
                      value={group}
                      onChange={handleUpdate}
                    />
                  </OptionContent>
                  <Description>
                    Name of the group to appear in the profiles list.
                  </Description>
                </Option>
                <Option>
                  <Separator />
                  <OptionContent>
                    <span>Command Line</span>
                    <Input
                      aria-label="shell"
                      value={options.shell}
                      onChange={handleUpdate}
                    />
                  </OptionContent>
                  <Description>
                    Path to the executable to be launched for the profile.
                  </Description>
                </Option>
                <Option>
                  <Separator />
                  <OptionContent>
                    <span>Working Directory</span>
                    <Input
                      aria-label="cwd"
                      value={options.cwd!}
                      onChange={handleUpdate}
                    />
                  </OptionContent>
                  <Description>
                    Absolute path where the executable will run.
                  </Description>
                </Option>
                <Option>
                  <Separator />
                  <OptionContent>
                    <span>Tab Title</span>
                    <Switch
                      aria-label="title"
                      className={title ? 'checked' : undefined}
                      onClick={handleUpdate}
                    >
                      <SwitchSlider />
                    </Switch>
                  </OptionContent>
                  <Description>
                    Sets the tab title to match the profile name.
                  </Description>
                </Option>
              </Wrapper>
            </Fragment>
          )}
        </Content>
      </Container>
    );
  }

  return <Fragment />;
};

export default memo(Form);
