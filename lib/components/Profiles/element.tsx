import { h } from 'preact';
import { memo } from 'preact/compat';

import { Container, Info, Title, Shell } from './styles';

const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
  const { title, shell, onSelect } = props;

  return (
    <Container data-title={title} onClick={onSelect}>
      <Info>
        <Title>{title}</Title>
        <Shell>{shell}</Shell>
      </Info>
    </Container>
  );
};

export default memo(Profile);
