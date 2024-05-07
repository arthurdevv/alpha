import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 2.375rem;
  z-index: 100;
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
  min-width: 3.125rem;
  height: calc(100% - 0.125rem);
  margin-top: 0.125rem;
  flex: 1 0 1%;
  -webkit-app-region: drag;
`;

export const Actions = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

export const ActionItem = styled.div`
  height: 2.375rem;
  padding: 0 0.75rem;
  overflow: hidden;
  flex: 0 0 auto;
  cursor: pointer;
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
    }

    & div span {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s;
    }
  }
`;
