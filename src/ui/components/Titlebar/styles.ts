import { styled } from '@linaria/react';

import {
  Container as TooltipContainer,
  Content as TooltipContent,
  Arrow as TooltipArrow,
} from 'components/Tooltip/styles';

export const DragRegion = styled.div`
  -webkit-app-region: drag;
  flex: 1 0 1%;
  min-width: 3.125rem;
  height: 100%;
  background: var(--titlebar, transparent);
`;

export const Action = styled.button`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 2.375rem;
  padding: 0 0.75rem;
  cursor: pointer;

  & svg {
    color: var(--muted);
    transition: color 0.2s ease 0s;
  }

  &:hover svg {
    color: var(--foreground);
  }
`;

export const Actions = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  background: var(--titlebar, transparent);

  &:first-of-type ${TooltipContent} {
    left: 0.5rem;

    ${TooltipArrow} {
      left: 0.375rem;
    }
  }

  &:last-of-type ${TooltipContainer}:last-of-type ${TooltipContent} {
    right: 0.5rem;

    ${TooltipArrow} {
      right: 0.375rem;
    }
  }
`;

export const Container = styled.header`
  z-index: 100;
  display: flex;
  width: 100%;
  height: 2.375rem;
  opacity: 0;
  pointer-events: none;
  animation: fade-in 1s ease 3.5s forwards;

  ${TooltipContent} {
    top: 2.75rem;
  }

  @media (max-width: 34.375rem) {
    ${Actions}:first-of-type {
      display: none;
    }

    ${Actions}:last-of-type ${TooltipContainer}:first-of-type {
      display: none;
    }
  }
`;
