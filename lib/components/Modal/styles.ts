import styled, { css } from 'styled-components';

export const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 10vh 1rem 1rem;
  inset: 0;
  z-index: 100;
  overflow: auto;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.overlay};
  transition: opacity 0.1s linear 0.1s;

  ${({ $isVisible }) =>
    $isVisible
      ? css`
          opacity: 1;
          transition-delay: 0s;
        `
      : css`
          opacity: 0;
        `}
`;

export const Container = styled.div<{ $isVisible: boolean; $width?: number }>`
  position: relative;
  width: 100%;
  height: max-content;
  max-width: ${({ $width }) => $width || '31.25'}rem;
  /* max-height: 70vh; */
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

export const Content = styled.div<{ $maxHeight?: number }>`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  box-shadow:
    0px 2px 7px rgba(0, 0, 0, 0.15),
    0px -2px 7px rgba(0, 0, 0, 0.15),
    0px 5px 17px rgba(0, 0, 0, 0.3);

  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      height: ${$maxHeight}rem;
      max-height: ${$maxHeight}rem;
    `}
`;

export const Tags = styled.div`
  display: flex;
  gap: 0.375rem;

  & > :first-child {
    margin-right: auto;
  }
`;

export const Tag = styled.div<{ $isAction: boolean }>`
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

  ${({ $isAction }) =>
    $isAction &&
    css`
      cursor: pointer;
      text-transform: uppercase;
      color: ${({ theme }) => theme.disabled};
      transition: color 0.2s ease 0s;

      &:hover {
        color: ${({ theme }) => theme.foreground};
      }
    `}
`;

export const Search = styled.div`
  height: 3rem;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;

export const SearchInput = styled.input`
  flex: 1;
  font: inherit;
  line-height: 1;
  letter-spacing: -0.011em;
  color: ${({ theme }) => theme.foreground};
`;

export const Wrapper = styled.div`
  max-height: 25rem;
  overflow: auto;
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

export const Name = styled.div`
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

export const Badges = styled.div`
  margin-left: 0.5rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
`;

export const BadgeItem = styled.span`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.popoverForeground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: border-color 0.2s ease 0s;
`;
