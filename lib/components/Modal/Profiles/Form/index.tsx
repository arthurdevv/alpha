import { Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { createProfile } from 'app/common/profiles';
import { getSettings, setSettings } from 'app/settings';
import useStore from 'lib/store';

import {
  Container,
  Content,
  Input,
  Label,
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
import Enviroment from './env';

const Form: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const { profile, setProfile, updateProfile } = useStore() as any;

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
      const genericProfile = createProfile();

      setProfile(genericProfile);
    } else {
      handleIsFilled();
    }
  }, []);

  if (profile) {
    const { name, group, title, options } = profile;

    return (
      <Container $width={45} $isVisible={isVisible}>
        <Tags>
          <Tag>{isFilled ? 'Profile' : 'Create a new profile'}</Tag>
          <Tag $isAction onClick={() => setIsEnv(!isEnv)}>
            {isEnv ? 'Options' : 'Enviroment'}
          </Tag>
          <Tag $isAction onClick={handleModal}>
            Cancel
          </Tag>
          <Tag
            $isAction
            onClick={isFilled && handleSave}
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
                  <Label>
                    Group name to be allocated in the list of profiles.
                  </Label>
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
                  <Label>Executable to run in the profile.</Label>
                </Option>
                <Option>
                  <Separator />
                  <OptionContent>
                    <span>Working Directory</span>
                    <Input
                      aria-label="cwd"
                      value={options.cwd}
                      onChange={handleUpdate}
                    />
                  </OptionContent>
                  <Label>Absolute path to be set for the child program.</Label>
                </Option>
                <Option>
                  <Separator />
                  <OptionContent>
                    <span>Tab Title</span>
                    <Switch
                      aria-label="title"
                      className={title && 'checked'}
                      onClick={handleUpdate}
                    >
                      <SwitchSlider />
                    </Switch>
                  </OptionContent>
                  <Label>Replaces the tab title with the profile name.</Label>
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
