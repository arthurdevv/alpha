import { styled } from '@linaria/react';

import { Action } from 'components/Settings/styles';

export const Container = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 5rem;
  margin-bottom: 3.75rem;
`;

export const Logo = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: max-content;
  gap: 0.25rem;

  & svg {
    width: 15rem;
    height: fit-content;
  }
`;

export const Version = styled.button`
  font-size: 0.8125rem;
  cursor: pointer;
  color: var(--muted);
  transition: color 0.2s ease 0s;
  transform: translateY(5px);

  &:hover {
    color: var(--foreground);
  }
`;

export const CheckForUpdates = styled(Action)`
  transform: translateX(-12px);

  &::after {
    content: '...';
    opacity: 0;
    transition: opacity 0.2s ease 1s;
  }
`;
