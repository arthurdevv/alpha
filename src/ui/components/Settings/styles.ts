import { styled } from '@linaria/react';

export const Container = styled.div`
  position: absolute;
  z-index: 1;
  flex: 1 0 0;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
  animation: fade-in 0.4s ease 0s forwards;
`;

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  padding: 1rem 1.5rem 1.5rem 0.625rem;
  transition: opacity 0.1s linear 0s;
  animation: fade-in 0.2s ease-in-out;
`;

export const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-width: 11.75rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
`;

export const NavigationItem = styled.button`
  min-height: 2.0625rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--muted);
  transition: 0.2s ease 0s;

  &:hover,
  &.selected {
    color: var(--foreground);
  }
`;

export const Title = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0.875rem 0 0.875rem 0;
  font-size: 1.25rem;

  &:first-of-type {
    margin-top: 0;
  }
`;
