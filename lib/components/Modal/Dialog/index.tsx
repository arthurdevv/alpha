import { Fragment, memo, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';

import { getSettings, setSettings } from 'app/settings';
import storage from 'app/utils/local-storage';
import useWorkspacesStore from 'lib/store/workspaces';

import { Container, Content, Tag, Tags } from '../styles';
import { Title } from './styles';

const Dialog: React.FC<ModalProps> = (props: ModalProps) => {
  const { store } = props;

  const workspacesStore = useWorkspacesStore(
    useShallow(s => ({
      context: s.context,
      deleteWorkspace: s.deleteWorkspace,
      deleteTab: s.deleteTab,
    })),
  );

  const { t } = useTranslation();

  const handleDelete = () => {
    if (snippets) {
      const [snippets, id] = data;

      const updated = snippets.filter(s => s.id !== id);
      global.setSnippets(updated);

      storage.updateItem('snippets', updated);
      global.setIsEditing(false);

      return props.handleModal(undefined, 'Snippets');
    }

    if (target) {
      const { metadata, index } = store.workspace;

      if (metadata.tabs.length === 1) {
        workspacesStore.deleteWorkspace(metadata.id);
      } else {
        workspacesStore.deleteTab(metadata.id, index);
      }

      return props.handleModal();
    }

    const { profiles: _profiles, defaultProfile } = getSettings();

    const profiles = _profiles.filter(item => item.id !== store.profile.id);

    if (store.profile.id === defaultProfile) {
      setSettings(
        'defaultProfile',
        profiles.length > 0 ? profiles[profiles.length - 1].id : 'cmd',
      );
    }

    setSettings('profiles', profiles, props.handleModal);
  };

  useEffect(() => {
    return () => {
      ['dialog', 'setSnippets', 'setIsEditing'].forEach(item => {
        delete global[item];
      });
    };
  }, []);

  const { source, target, from, data, snippets } = global.dialog || {};

  const { fontFamily } = store.options;

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>{t(source || 'Profiles')}</Tag>
        <Tag onClick={props.handleModal}>{t('Cancel')}</Tag>
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
            <span style={{ fontFamily }}>{store.profile.name}</span>
          )}
          ?
        </Title>
      </Content>
    </Container>
  );
};

export default memo(Dialog);
