import { styled } from '@linaria/react';

import { Keys } from 'components/Tooltip/styles';

export const Content = styled.div`
  flex: 1 0 1%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  font: 400 0.875rem / 1.3 var(--font-family);
  font-variant-ligatures: var(--font-ligatures);
  color: var(--muted);
  transition: color 0.2s ease, opacity 0.1s linear;
  animation: fade-in 0.2s ease-in-out 0s;

  &.defaults {
    cursor: default;
  }

  &:hover,
  &:focus {
    color: var(--foreground);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

export const Selectors = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 1.5rem;
  margin-left: auto;
  padding: 0 0.5rem;
  background: var(--tooltip);
  border: 1px solid var(--border);
  border-radius: 4px;
`;

export const Selector = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.2s ease 0s;

 &.selected {
    color: var(--foreground);
  }

  &:hover {
    color: var(--foreground);
  }

  &:first-of-type {
    padding-right: 0.5rem;
    border-right: 1px solid var(--border);
  }

  &:last-of-type {
    padding-left: 0.5rem;
  }
`;

export const Warning = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  margin-top: 0.125rem;
  margin-left: 0.25rem;
  opacity: 0;
  background: var(--foreground);
  border-radius: 100%;
  transition: opacity 0.2s ease 0s;

  &.visible {
    opacity: 1;
  }
`;

export const Hint = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.25rem;

  ${Keys} {
    margin-left: 0;
  }

  &.media-34 {
    @media screen and (max-width: 34.0625rem) {
      display: none;
    }
  }

  &.media-40 {
    @media screen and (max-width: 40.625rem) {
      display: none;
    }
  }
`;

export const HintLabel = styled.span`
  font-size: 0.875rem;
  color: var(--muted);
`;
