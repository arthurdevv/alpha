import { memo, useEffect, useMemo, useRef, useState } from 'preact/compat';

import useStore from 'lib/store';

import GitStatus from './git';
import {
  BranchIcon,
  ConnectedIcon,
  DisconnectIcon,
  ScreenFullIcon,
} from 'components/Icons';
import { BadgeItem, Badges, Container, Wrapper } from './styles';

const Indicators: React.FC = () => {
  const {
    current: { origin, terms },
    options: { indicatorsMode, gitStatus },
    viewport: { cols, rows },
    instances,
  } = useStore();

  if (!indicatorsMode || !origin || origin === 'Settings') return <></>;

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const [isResizing, setIsResizing] = useState<boolean>(false);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouse = ({ type }: MouseEvent) => {
    if (indicatorsMode === 'always') return;

    if (type === 'mouseenter') {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

      setIsHovered(true);
    } else if (type === 'mouseleave') {
      hoverTimeout.current = setTimeout(() => setIsHovered(false), 50);
    }
  };

  useEffect(() => {
    if (!cols || !rows) return;

    setIsResizing(true);

    const timeout = setTimeout(() => {
      setIsResizing(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [cols, rows]);

  useEffect(() => setIsHovered(indicatorsMode === 'always'), [indicatorsMode]);

  const instance: IInstance = useMemo(() => {
    const [id] = terms[origin];

    return instances[id];
  }, [terms, origin]);

  const {
    profile: { type, options },
    isConnected,
    isExpanded,
  } = instance;

  const content = useMemo(() => {
    if (type === 'shell') {
      return {
        label: null,
        badge: null,
        indicator: gitStatus ? <BranchIcon /> : null,
      };
    }

    const indicator = isConnected ? (
      <ConnectedIcon />
    ) : (
      <DisconnectIcon vb="16 16" />
    );

    if (type === 'serial') {
      return {
        label: options.path,
        badge: options.baudRate,
        indicator,
      };
    } else {
      return {
        label: `${options.host}:${options.port}`,
        badge: options.username,
        indicator,
      };
    }
  }, [instance, gitStatus]);

  const offset =
    (type !== 'shell' || gitStatus ? 2.125 : 0) + (isExpanded ? 2.125 : 0);

  return (
    <Container>
      <Wrapper
        $text
        $visible={isResizing}
        style={{ padding: '0.25rem 0.5rem', right: `${offset}rem` }}
      >
        {cols}x{rows}
      </Wrapper>
      {(content.label || content.badge || gitStatus) && (
        <Wrapper
          $text
          $visible={isHovered}
          onMouseEnter={handleMouse}
          onMouseLeave={handleMouse}
          style={{ right: isExpanded ? '4.25rem' : '2.125rem' }}
        >
          {content.label ? (
            <>
              {content.label}
              <Badges>
                <BadgeItem>{content.badge}</BadgeItem>
              </Badges>
            </>
          ) : (
            gitStatus && <GitStatus id={instance.id} />
          )}
        </Wrapper>
      )}
      {content.indicator && (
        <Wrapper
          $visible
          onMouseEnter={handleMouse}
          onMouseLeave={handleMouse}
          style={{
            pointerEvents: 'all',
            right: isExpanded ? '2.125rem' : 0,
            transitionDelay: isExpanded ? '0s' : '0.1s',
          }}
        >
          {content.indicator}
        </Wrapper>
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

export default memo(Indicators);
