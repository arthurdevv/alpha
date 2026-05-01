import { styled } from '@linaria/react';

import {
  Arrow as TooltipArrow,
  Container as TooltipContainer,
  Content as TooltipContent,
} from 'ui/components/Tooltip/styles';

export const Color = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.4375rem;
  height: 1.4375rem;
  font-size: 0.5625rem;
  font-weight: 900;
  border: 1px solid var(--border);
  border-radius: 4px;
  text-shadow: 0px 1px 3px #000000;

  & ~ ${TooltipContent} {
    top: 2.125rem;
  }
`;

export const Colors = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  transition: margin 0.2s ease 0.15s;

  & ${TooltipContainer}:first-of-type ${Color} ~ ${TooltipContent} {
    left: 0;

    ${TooltipArrow} {
      left: 0.375rem;
    }
  }

  & ${TooltipContainer}:last-of-type ${Color} ~ ${TooltipContent} {
    right: 0;

    ${TooltipArrow} {
      right: 0.375rem;
    }
  }

  ${Color} {
    width: 0;
    height: 0;
    opacity: 0;
    transition:
      width 0.2s ease 0.15s,
      height 0.2s ease 0.15s,
      opacity 0.2s ease 0s;
  }

  &.visible {
    margin-bottom: 0.75rem;
    transition-delay: 0s;

    ${Color} {
      width: 1.4375rem;
      height: 1.4375rem;
      opacity: 1;
      transition:
        width 0.2s ease 0s,
        height 0.2s ease 0s,
        margin 0.2s ease 0s,
        opacity 0.2s ease 0.15s;
    }
  }
`;

export const Preview = styled.div`
  position: relative;
  padding: 0.625rem;
  cursor: text;
  line-height: 1.5;
  font-size: 0.8125rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  transition: background 0.2s ease 0s;
  font-variant-ligatures: common-ligatures discretionary-ligatures;

  & pre {
    cursor: text;
    font-family: inherit;
    color: inherit;
  }

  *::selection {
    color: unset;
    background: var(--selection-background);
  }
`;

export const Button = styled.button`
  position: absolute;
  top: 0.625rem;
  right: 0.75rem;
  cursor: pointer;
  font:
    400 0.6875rem 'Geist',
    sans-serif;
  color: var(--muted);
  transition: color 0.2s ease 0s;

  &:hover {
    color: var(--foreground);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  user-select: text;

  &.col {
    flex-direction: column;
  }
`;
