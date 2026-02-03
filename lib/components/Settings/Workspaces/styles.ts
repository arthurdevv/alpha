import styled, { css, keyframes } from 'styled-components';
import {
  Arrow as _Arrow,
  Label as _Label,
} from 'components/Modal/Search/styles';
import { Placeholder } from '../styles';

export const Name = styled.input`
  font-size: 0.875rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  color: ${props => props.theme.foreground};
`;

export const Window = styled.div`
  position: relative;
  width: 90%;
  border-top: 1px solid ${props => props.theme.borderWindow};
  border-left: 1px solid ${props => props.theme.borderWindow};
  border-radius: 8px 0 0 0;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 1.25rem;
    left: -1px;
    z-index: 999;
    background: linear-gradient(0deg, rgb(7 7 7 / 85%), transparent 50%);
  }

  &::after {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    top: -1px;
    right: -4px;
    z-index: 999;
    background: linear-gradient(90deg, transparent 80%, rgb(7 7 7 / 85%));
  }
`;

export const Mask = styled.div`
  position: absolute;
  width: 6.25rem;
  height: 100%;
  right: 0;
  bottom: 0;
  opacity: 0;
  z-index: 1;
  background: linear-gradient(
    to right,
    transparent,
    ${props => props.theme.background},
    ${props => props.theme.background}
  );
  transition: 0.2s ease 0s;
  pointer-events: none;
`;

export const Title = styled.span`
  font-size: 0.8125rem;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Button = styled.div`
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  right: 0.375rem;
  z-index: 10;
  opacity: 0;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.foreground};
  border-radius: 3px;
  transition: all 0.2s ease 0s;

  & svg {
    width: 0.875rem;
    height: 0.875rem;
    pointer-events: none;
  }

  &:hover {
    cursor: pointer;

    & div {
      opacity: 1 !important;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s !important;
    }
  }
`;

export const Label = styled(_Label)`
  top: 4.375rem;
`;

export const Arrow = styled(_Arrow)`
  position: absolute;
  top: -0.75rem;
`;

export const Action = styled.div`
  position: relative;
  width: 2.5rem;
  height: 2.375rem;
  flex: 0 0 auto;
  opacity: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease 0s;

  & svg {
    color: ${props => props.theme.disabled};
    transition: color 0.2s ease 0s;
  }

  &:hover {
    & svg {
      color: ${props => props.theme.foreground};
    }

    & ${Label} {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s;
    }
  }
`;

export const Header = styled.header`
  width: 100%;
  height: 2.375rem;
  z-index: 100;
  display: flex;
  overflow: hidden;
`;

export const Tabs = styled.div`
  height: 100%;
  flex: 0 1 auto;
  display: flex;
  overflow: hidden;
`;

export const List = styled.ul`
  gap: 1.5625rem;
  list-style-type: none;
  display: flex;
  flex-direction: column;
`;

export const Tab = styled.div<{ $isCurrent: boolean; $tabWidth?: string }>`
  position: relative;
  width: 12.5rem;
  padding: 0 1rem;
  z-index: 100;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    ${Button} {
      opacity: 1;
    }

    ${Mask} {
      opacity: 1;
    }
  }

  ${props =>
    props.$isCurrent &&
    css`
      cursor: default;
      color: ${props => props.theme.foreground};
    `}

  ${({ $tabWidth }) =>
    $tabWidth === 'fixed'
      ? css`
          width: 12.5rem;
        `
      : css`
          width: fit-content;

          & div {
            right: 0;
          }
        `}
`;

export const Wrapper = styled.div`
  gap: 0.25rem;
  margin-top: 1.5625rem;
  display: flex;
  flex-direction: column;

  &.hidden {
    display: none;
  }

  &.blank {
    margin-top: 0;
    height: 100%;
    gap: 0;
    align-items: center;
    justify-content: center;

    ${Placeholder}:first-of-type {
      display: flex !important;
    }
  }
`;

export const Workspace = styled.li<{ $isExample?: boolean }>`
  gap: 0.625rem;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: ${keyframes`
    0% {
      opacity: 0;
      scale: 0.98;
      transform: translateY(-10px);
    }

    95% {
      opacity: 1;
    }

    100% {
      opacity: 1;
      scale: 1;
      transform: translateY(0);
    }
  `} 0.35s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards 0s;

  &:hover ${Window} ${Header} > ${Action} {
    opacity: 1;
  }

  ${({ $isExample }) =>
    $isExample &&
    css`
      width: 50%;
      height: 5rem;
      pointer-events: none;

      & ${Window} {
        width: 100%;
        height: 100%;
      }
    `}
`;
