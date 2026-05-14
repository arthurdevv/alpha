import { styled } from '@linaria/react';

export const Container = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition: opacity 1s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;

  &.hidden {
    opacity: 0;
    pointer-events: none;
    transition: none;
  }
`;

export const Logo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: max-content;

  & svg {
    width: 12.5rem;
  }
`;

export const Wrapper = styled.div`
  position: absolute;
  top: calc(50% + 3.5rem);
  display: flex;
  align-items: center;
  opacity: 0;
  font-size: 0.8125rem;
  animation: fade-in 0.5s ease 0s forwards;
`;

export const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 1.25rem 1.5625rem;
`;

export const Version = styled.div`
  font-size: 0.8125rem;
  opacity: 0;
  cursor: pointer;
  pointer-events: none;
  color: var(--muted);
  transition: color 0.2s ease 0s;
  animation: fade-in 1s ease 3.5s forwards;

  &:hover {
    color: var(--foreground);
  }
`;
