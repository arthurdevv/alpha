import { Fragment, memo, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { getSettings, setSettings } from 'app/settings';
import storage from 'app/utils/local-storage';

import { Container, Content, Tag, Tags } from '../styles';
import { Title } from './styles';

const Dialog: React.FC<ModalProps> = ({ store, handleModal, isVisible }) => {
  const {
    profile,
    options: { fontFamily, workspaces = [] },
  } = store;

  const { t } = useTranslation();

  const handleDelete = () => {
    if (snippets) {
      const [snippets, id] = data;

      const updated = snippets.filter(s => s.id !== id);
      global.setSnippets(updated);

      storage.updateItem('snippets', updated);
      global.setIsEditing(false);

      return handleModal(undefined, 'Snippets');
    }

    if (target) {
      const [index] = data;
      const _workspaces = [...workspaces];

      const { id, tabs } = _workspaces[index];

      if (tabs.length === 1) {
        _workspaces.splice(index, 1);

        setSettings('workspace', false);
      } else {
        _workspaces[index].tabs.splice(tabIndex, 1);

        global.handleContext('tabs', id, tabs.length - 1);
      }

      return setSettings('workspaces', _workspaces, handleModal);
    }

    const { profiles: _profiles, defaultProfile } = getSettings();

    const profiles = _profiles.filter(item => item.id !== profile.id);

    if (profile.id === defaultProfile) {
      setSettings(
        'defaultProfile',
        profiles.length > 0 ? profiles[profiles.length - 1].id : 'cmd',
      );
    }

    setSettings('profiles', profiles, handleModal);
  };

  useEffect(() => {
    return () => {
      ['dialog', 'handleContext', 'setSnippets', 'setIsEditing'].forEach(
        item => {
          delete global[item];
        },
      );
    };
  }, []);

  const { source, target, from, data, snippets } = global.dialog || {};

  return (
    <Container $isVisible={isVisible}>
      <Tags>
        <Tag $isTitle>{t(source || 'Profiles')}</Tag>
        <Tag onClick={handleModal}>{t('Cancel')}</Tag>
        <Tag onClick={handleDelete}>{t('Delete')}</Tag>
      </Tags>
      <Content>
        <Title>
          {t('Are you sure you want to delete')}&nbsp;
          {target ? (
            <Fragment>
              <span style={{ fontFamily }}>{target}</span>&nbsp;
              {!snippets && (
                <>
                  {t('from')}&nbsp;
                  <span style={{ fontFamily }}>{from}</span>
                </>
              )}
            </Fragment>
          ) : (
            <span style={{ fontFamily }}>{profile.name}</span>
          )}
          ?
        </Title>
      </Content>
    </Container>
  );
};

export default memo(Dialog);
