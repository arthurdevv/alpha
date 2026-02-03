import { Fragment } from 'preact';
import { memo, useState } from 'preact/compat';

import { BadgeItem, Badges, Container, Wrapper } from './styles';
import { ConnectedIcon, DisconnectIcon, ScreenFullIcon } from '../../Icons';

const Tooltip: React.FC<TermProps> = (props: TermProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { profile, isConnected, isExpanded } = props;

  const content = (() => {
    const { type, options } = profile;

    if (type === 'shell') return { label: '', badge: '' };

    return type === 'serial'
      ? { label: options.path, badge: options.baudRate }
      : { label: `${options.host}:${options.port}`, badge: options.username };
  })();

  return (
    <Container>
      {profile.type !== 'shell' && (
        <Fragment>
          <Wrapper
            $text
            $hovered={isHovered}
            style={{ right: isExpanded ? '4.25rem' : '2.125rem' }}
          >
            {content.label}
            <Badges>
              <BadgeItem>{content.badge}</BadgeItem>
            </Badges>
          </Wrapper>
          <Wrapper
            $visible={true}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              pointerEvents: 'all',
              right: isExpanded ? '2.125rem' : 0,
              transitionDelay: isExpanded ? '0s' : '0.1s',
            }}
          >
            {isConnected ? <ConnectedIcon /> : <DisconnectIcon vb="16 16" />}
          </Wrapper>
        </Fragment>
      )}
      <Wrapper
        $visible={isExpanded}
        style={{
          pointerEvents: 'none',
          right: 0,
          transitionDelay: isExpanded ? '0.1s' : '0s',
        }}
      >
        <ScreenFullIcon />
      </Wrapper>
    </Container>
  );
};

export default memo(Tooltip);
