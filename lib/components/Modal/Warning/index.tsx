import { h } from 'preact';
import { memo } from 'preact/compat';

import { clipboard } from '@electron/remote';

import { Preview, Title, Wrapper } from './styles';
import { Container, Content, Tag, Tags } from '../styles';

const Warning: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const data = clipboard.readText('clipboard');

  const handlePaste = () => {
    document.execCommand('paste');

    handleModal();
  };

  return (
    <Container $width={34} $isVisible={isVisible}>
      <Tags>
        <Tag $isTitle>Warning</Tag>
        <Tag onClick={handleModal}>Cancel</Tag>
        <Tag onClick={handlePaste}>Paste anyway</Tag>
      </Tags>
      <Content>
        <Wrapper>
          <Title>
            The clipboard text has multiple lines, which might lead to
            unexpected execution.
          </Title>
          <Preview>{data}</Preview>
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Warning);
