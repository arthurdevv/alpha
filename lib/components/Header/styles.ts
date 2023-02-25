import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 2.375rem;
  display: flex;
`;

export const DragRegion = styled.div`
  min-width: ${`${global.isMac ? '4.5' : '3.125'}rem`};
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
    padding: ${global.isMac && '0 0.5rem'};
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
    color: ${props => props.theme.disabled};
    transition: color 0.2s ease 0s;
  }

  &:hover {
    & svg {
      color: ${props => props.theme.foreground};
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
    right: ${global.isMac && '0.5rem'};
  }

  &[aria-label='New Terminal'].visited div span:last-of-type {
    left: auto !important;
  }

  &[aria-label='New Terminal'] div span:last-of-type {
    left: ${!global.isMac && '0.5rem'};
  }

  &[aria-label='Profiles'] div span:last-of-type,
  &[aria-label='Maximize'] div span:last-of-type,
  &[aria-label='Restore'] div span:last-of-type {
    padding: 0.25rem 0.5rem;
  }
`;

export const MacWindowControl = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  margin: 0 0.25rem;
  cursor: pointer;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.border};
  border-radius: 50%;

  &:hover div span {
    opacity: 1;
    transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.55s;
  }

  &[aria-label] div span:first-of-type {
    left: auto !important;
    right: auto !important;
  }

  &[aria-label='Close'] div span:last-of-type {
    left: 0.5rem;
  }

  &[aria-label='Minimize'] div span:last-of-type {
    left: 1.75rem;
  }

  &[aria-label='Profiles'] div span:last-of-type,
  &[aria-label='Maximize'] div span:last-of-type,
  &[aria-label='Restore'] div span:last-of-type {
    padding: 0.25rem 0.5rem;
  }
`;
