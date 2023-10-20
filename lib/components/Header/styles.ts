import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 2.375rem;
  z-index: 1000;
  display: flex;
  opacity: 0;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  `} 1s ease 3s forwards;
`;

export const DragRegion = styled.div`
  min-width: ${`${isMac ? '4.5' : '3.125'}rem`};
  height: calc(100% - 0.125rem);
  margin-top: 0.125rem;
  flex: 1 0 1%;
  -webkit-app-region: drag;
`;

export const Actions = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:first-of-type {
    padding: ${isMac && '0 0.5rem'};
  }
`;

export const ActionItem = styled.div`
  height: 2.375rem;
  padding: 0 0.75rem;
  cursor: pointer;
  overflow: hidden;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    color: ${({ theme }) => theme.disabled};
    transition: color 0.2s ease 0s;
  }

  &:hover {
    & svg {
      color: ${({ theme }) => theme.foreground};
      transition: color 0.2s ease 0s;
    }

    & div span {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.55s;
    }
  }

  &[aria-label] div span:first-of-type {
    left: auto !important;
    right: auto !important;
  }

  &[aria-label='Close'] div span:last-of-type {
    right: 0.5rem;
  }

  &[aria-label='Settings'] div span:last-of-type {
    right: ${isMac && '0.5rem'};
  }

  &[aria-label='New Terminal'].visited div span:last-of-type {
    left: auto !important;
  }

  &[aria-label='New Terminal'] div span:last-of-type {
    left: ${!isMac && '0.5rem'};
  }

  &[aria-label='New Terminal'] div span:last-of-type,
  &[aria-label='Settings'] div span:last-of-type {
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  }
`;
