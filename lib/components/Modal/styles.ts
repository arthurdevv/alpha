import styled, { css } from 'styled-components';

export const Overlay = styled.div<{ $modal?: string; $isVisible: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 10vh 1rem 1rem;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background: ${props => props.theme.overlay};
  transition: opacity 0.1s linear 0.1s;

  ${({ $isVisible }) =>
    $isVisible
      ? css`
          opacity: 1;
          transition-delay: 0s;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

export const Container = styled.div<{ $isVisible: boolean; $width?: number }>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width || '31.25'}rem;
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
  max-height: calc(100% - 3rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;

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

export const Tag = styled.div<{ $isTitle?: boolean }>`
  max-width: 100%;
  height: 1.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};
  background: ${props => props.theme.background};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }

  & svg {
    width: 0.8125rem;
    height: 0.8125rem;
    margin-right: 0.25rem;
    color: ${props => props.theme.popoverForeground};
  }

  ${({ $isTitle }) =>
    $isTitle &&
    css`
      cursor: default;
      text-transform: none;
      color: ${props => props.theme.foreground};
    `}
`;

export const Search = styled.div<{ $fade?: boolean }>`
  width: calc(100% - 0.125rem);
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: opacity 0.15s linear 0s;

  ${({ $fade }) =>
    $fade
      ? css`
          opacity: 0;
        `
      : css`
          opacity: 1;
        `}
`;

export const SearchInput = styled.input`
  height: 3rem;
  flex: 1;
  font: inherit;
  line-height: 1;
  letter-spacing: -0.011em;
  color: ${props => props.theme.foreground};
`;

export const Wrapper = styled.div`
  overflow: auto;
  display: flex;
  align-items: center;
  flex-direction: column;

  &.hidden {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 0.25rem;
    display: block;
  }

  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.scrollbarThumb};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.scrollbarHover};
    }
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
  color: ${props => props.theme.disabled};
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
    background: ${props => props.theme.divider};
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
  color: ${props => props.theme.popoverForeground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: border-color 0.2s ease 0s;
`;
