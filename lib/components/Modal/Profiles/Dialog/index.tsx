import { h } from 'preact';
import { memo } from 'preact/compat';

import { getSettings, setSettings } from 'app/settings';
import storage from 'app/utils/local-storage';
import useStore from 'lib/store';

import { Title } from './styles';
import { Container, Content, Tag, Tags } from '../../styles';

const Dialog: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const profile = useStore(store => store.profile as IProfile);

  const handleDelete = () => {
    const { profiles } = getSettings();

    const index = profiles.indexOf(profile);

    profiles.splice(index, 1);

    setSettings('profiles', profiles, handleModal);

    storage.deleteValue('env', profile.id, true);
  };

  return (
    <Container $isVisible={isVisible}>
      <Tags>
        <Tag>Profile</Tag>
        <Tag $isAction onClick={handleModal}>
          Cancel
        </Tag>
        <Tag $isAction onClick={handleDelete}>
          Delete
        </Tag>
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
