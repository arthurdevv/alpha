import styled, { css } from 'styled-components';
import { Placeholder, Separator } from '../styles';

export const Container = styled.div<{ $hidden: boolean; $width?: number }>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width || 31.25}rem;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;

  ${({ $hidden }) =>
    $hidden
      ? css`
          opacity: 0;
          transform: scale(0.98);
        `
      : css`
          opacity: 1;
          transform: scale(1);
        `}
`;

export const Content = styled.div<{ $maxHeight?: number }>`
  overflow: hidden;
  background: ${props => props.theme.background};
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;

  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      height: ${$maxHeight}rem;
      max-height: ${$maxHeight}rem;
    `}
`;

export const Name = styled.div`
  font-size: 0.875rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & span {
    position: relative;
    top: 0.1875rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease 0s;

    & svg {
      color: ${props => props.theme.disabled};
      transition: color 0.2s ease 0s;

      &:hover {
        color: ${props => props.theme.foreground};
      }
    }
  }
`;

export const Group = styled.div`
  &:hover ${Name} span {
    opacity: 1;
  }

  &:has(ul.empty) {
    display: none;
  }

  &:has(ul.visible) {
    margin-top: 0 !important;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  gap: 0.5rem;
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

export const List = styled.ul`
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
  padding-left: 0.625rem;
`;

export const Info = styled.div`
  line-height: 1.525rem;
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  color: ${props => props.theme.foreground};

  & > span:first-child {
    height: 1.75rem;
    font-size: 0.8125rem;
    line-height: 1.625rem;
  }

  & span {
    gap: 0.375rem;
    display: flex;
    align-items: center;
  }
`;

export const Icon = styled.div`
  position: relative;
  margin-left: 0.125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${props => props.theme.disabled};
  opacity: 0;
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:hover {
    opacity: 1;
    color: ${props => props.theme.foreground};
  }
`;

export const Item = styled.li`
  padding: 0.375rem 0;
  font-size: 0.8125rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover > :last-child {
    opacity: 1;
  }

  &:hover ${Icon} {
    opacity: 1 !important;
  }
`;

export const Badges = styled.div`
  gap: 0.25rem;
  display: flex;
  align-items: center;
`;

export const BadgeItem = styled.span`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  gap: 0.375rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.popoverForeground};
  background: ${props => props.theme.badge};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
`;

export const Actions = styled.div`
  gap: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease 0s;
`;

export const Action = styled.div`
  font-size: 0.8125rem;
  cursor: pointer;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Groups = styled.div`
  flex: 1 0 1%;
  display: flex;
  flex-direction: column;

  &.hidden {
    display: none;
  }

  &.blank {
    align-items: center;
    justify-content: center;

    & > [role='group'],
    ${Separator} {
      display: none;
    }

    ${Placeholder} {
      display: flex !important;
    }
  }
`;
