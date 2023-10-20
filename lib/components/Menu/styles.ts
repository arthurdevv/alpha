import styled, { css } from 'styled-components';

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

export const Container = styled.div<{ $isVisible: boolean }>`
  position: relative;
  width: 100%;
  max-width: 31.25rem;
  max-height: 70vh;
  transform: scale(0.99);
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  transition-property: transform, opacity;

  ${({ $isVisible }) =>
    $isVisible
      ? css`
          opacity: 1;
          transform: scale(1);
        `
      : css`
          opacity: 0;
          transform: scale(0.98);
        `}
`;

export const Content = styled.div`
  overflow: hidden;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  box-shadow:
    0px 2px 7px rgba(0, 0, 0, 0.15),
    0px -2px 7px rgba(0, 0, 0, 0.15),
    0px 5px 17px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

export const Tag = styled.div`
  max-width: 100%;
  height: 1.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.foreground};
  background: ${({ theme }) => theme.background};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};

  & svg {
    width: 0.8125rem;
    height: 0.8125rem;
    margin-right: 0.25rem;
    color: ${({ theme }) => theme.popoverForeground};
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
  flex: 1;
  line-height: 1;
  letter-spacing: -0.011em;
  font: inherit;
  color: ${({ theme }) => theme.foreground};
  background: transparent;
  border: none;
  outline: none;

  &::selection {
    color: ${({ theme }) => theme.selectionForeground};
    background: ${({ theme }) => theme.selectionBackground};
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  &.hidden {
    display: none;
  }
`;

export const Separator = styled.hr`
  width: 100%;
  height: 1px;
  margin-bottom: 0.25rem;
  border: none;
`;

export const Label = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.disabled};
`;

export const Title = styled.div`
  margin-right: 0.75rem;
  white-space: nowrap;
`;

export const List = styled.ul`
  position: relative;
  width: 100%;
`;

export const ListItem = styled.li`
  height: 2.25rem;
  padding: 0 1.5rem;
  font-size: 0.813rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease 0s;

  &:hover {
    background: ${({ theme }) => theme.divider};
  }
`;
