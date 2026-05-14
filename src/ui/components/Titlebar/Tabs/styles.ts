import { styled } from '@linaria/react';

import {
  Container as TooltipContainer,
  Content as TooltipContent,
} from 'ui/components/Tooltip/styles';

export const List = styled.nav`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const Mask = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 6.25rem;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(
    to right,
    transparent,
    var(--titlebar, --background),
    var(--titlebar, --background)
  );
  transition: 0.2s ease 0s;

  @media (max-width: 40.625rem) {
    width: 3.75rem;
  }

  @media (max-width: 28.75rem) {
    display: none;
  }
`;

export const Title = styled.span`
  overflow: hidden;
  font-size: 0.8125rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0;
  animation: fade-in 0.22s ease forwards;
`;

export const Action = styled.button`
  z-index: 10;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0;
  color: var(--foreground);
  border-radius: 3px;
  transition: all 0.2s ease 0s;

  & svg {
    pointer-events: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12.5rem;
  min-width: 0;
  min-height: 2.375rem;
  padding: 0 1rem;
  cursor: pointer;
  color: var(--muted);
  background: var(--titlebar, transparent);
  transition: 0.2s linear 0s;
  transition-property: color, opacity, width, padding;
  animation: tab 0.3s linear 0s;

  ${TooltipContainer} {
    &:has(${Action}) {
      position: absolute;
      right: 1.875rem;

      &:last-of-type {
        right: 0.375rem;
      }

      ${TooltipContent} {
        top: 2.3125rem;
      }

      @media (max-width: 28.75rem) {
        display: none;
      }

      @media (max-width: 40.625rem) {
        &:not(:last-of-type) {
          display: none;
        }
      }
    }

    &:has(${Title}) {
      align-items: center;
      max-width: 100%;
      min-height: inherit;
    }
  }

  &:hover {
    ${Mask}, ${Action} {
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.25rem;
    top: 0;
    background: var(--indicator, transparent);
    transition: opacity 0.2s ease 0s;
  }

  &.auto {
    width: fit-content;
  }

  &.current {
    cursor: default;
    color: var(--foreground);
    background: var(--acrylic, --background);
  }

  @keyframes tab {
    from {
      width: 0;
      padding: 0;
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;
