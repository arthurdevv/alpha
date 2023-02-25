import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 10vh 1rem 1rem;
  inset: 0;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 31.25rem;
  max-height: 70vh;
  opacity: 0;
  overflow-y: auto;
  overflow-x: hidden;
  pointer-events: auto;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0px 2px 7px ${props => props.theme.boxShadow},
    0px -2px 7px ${props => props.theme.boxShadow},
    0px 5px 17px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  transform: scale(0.99);
  animation: modal-on-show 0.2s forwards 0.1s;

  @keyframes modal-on-show {
    0% {
      opacity: 0;
      transform: scale(0.99);
    }

    50% {
      transform: scale(1.02);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const Search = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;

export const SearchInput = styled.input`
  width: 100%;
  line-height: 1;
  letter-spacing: -0.011em;
  font: 400 16px 'Inter', sans-serif;
  color: ${props => props.theme.foreground};
  background: transparent;
  border: none;
  outline: none;

  &::selection {
    color: ${props => props.theme.selection.foreground};
    background: ${props => props.theme.selection.background};
  }
`;

export const Separator = styled.hr`
  width: 100%;
  height: 1px;
  margin-bottom: 0.5rem;
  background: ${props => props.theme.separator};
  border: none;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  &.hidden {
    display: none;
  }
`;

export const Label = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: ${props => props.theme.disabled};
`;

export const Group = styled.ul`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const Container = styled.li`
  height: 2.25rem;
  padding: 0 1.5rem;
  font-size: 0.813rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: background 0.2s ease 0s;

  &:hover {
    background: ${props => props.theme.separator};
  }
`;

export const Info = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  margin-right: 0.75rem;
  white-space: nowrap;
`;

export const Shell = styled.div`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${props => props.theme.disabled};
`;
