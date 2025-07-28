import { h } from 'preact';
import { memo } from 'preact/compat';

import { getSettings, setSettings } from 'app/settings';
import useStore from 'lib/store';

import { Title } from './styles';
import { Container, Content, Tag, Tags } from '../../styles';

const Dialog: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const profile = useStore(store => store.profile) as IProfile;

  const handleDelete = () => {
    let { profiles, defaultProfile } = getSettings();

    profiles = profiles.filter(item => item.id !== profile.id);

    setSettings('profiles', profiles, handleModal);

    if (profile.id === defaultProfile) {
      defaultProfile =
        profiles.length > 0 ? profiles[profiles.length - 1].id : 'cmd';

      setSettings('defaultProfile', defaultProfile);
    }
  };

  return (
    <Container $isVisible={isVisible}>
      <Tags>
        <Tag $isTitle>Profile</Tag>
        <Tag onClick={handleModal}>Cancel</Tag>
        <Tag onClick={handleDelete}>Delete</Tag>
      </Tags>
      <Content>
        <Title>
          Are you sure you want to delete &quot;{profile.name}&quot;?
        </Title>
      </Content>
    </Container>
  );
};

export default memo(Dialog);
