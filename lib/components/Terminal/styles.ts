import styled from 'styled-components';

export const Group = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100;
  flex: auto;
  display: flex;
`;

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -9999em;
  flex: auto;
  display: flex;
  overflow: hidden;
  background: ${({ theme }) => theme.background};

  &.current {
    left: 0;
  }
`;

export const Content = styled.div`
  position: relative;
  margin: 0.875rem;
  flex: auto;
  display: block;
  overflow: hidden;
`;
