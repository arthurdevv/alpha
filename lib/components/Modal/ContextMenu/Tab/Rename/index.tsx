import { memo, useEffect, useRef } from 'preact/compat';

import {
  Container,
  Content,
  Search,
  SearchInput,
  Tag,
  Tags,
} from 'components/Modal/styles';
import { useTranslation } from 'react-i18next';

const Rename: React.FC<ModalProps> = (props: ModalProps) => {
  const input = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const handleRename = () => {
    const { current } = input;

    if (current?.value) renameTab(tab, input.current!.value);

    props.handleModal();
  };

  useEffect(() => {
    if (input.current) input.current.select();
  }, []);

  const {
    context,
    instances,
    current: { origin, terms },
    renameTab,
  } = props.store;

  const tab = global.id || origin!;

  const [focused] = terms[tab];

  const instance = instances[focused || 'Settings'];

  const title = context[tab].title || instance.title;

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>{t('Tab')}</Tag>
        <Tag onClick={handleRename}>{t('Rename')}</Tag>
        <Tag onClick={props.handleModal}>{t('Cancel')}</Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput placeholder={title} value={title} ref={input} />
        </Search>
      </Content>
    </Container>
  );
};

export default memo(Rename);
