import styled, { css, keyframes } from 'styled-components';
import { Wrapper as _W, BadgeItem, Badges, Warning } from '../styles';

export const List = styled.ul`
  position: relative;
  max-height: 13rem;
  width: 100%;
  gap: 1.25rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  list-style-type: none;

  &.empty {
    margin-bottom: 0.25rem;
    display: flex !important;

    ${Warning} {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const Command = styled.li`
  flex: 1;
  display: flex;
  border: 1px solid ${props => props.theme.border};
  border-bottom: none;

  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }
`;

export const Input = styled.input`
  min-width: 8ch;
  padding: 0 0.5rem;
  flex: 1;
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};
  }
`;

export const Delete = styled.div`
  height: 1.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};
  border-left: 1px solid ${props => props.theme.border};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Button = styled.div<{ $length: number }>`
  height: 1.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: color, opacity;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;

  ${({ $length }) =>
    $length > 0 &&
    css`
      border-radius: 0px 0px 4px 4px;
    `}

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Meta = styled.span<{ $empty?: boolean }>`
  max-width: 36ch;
  line-height: 1.6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: opacity 0.2s ease 0.1s;

  ${({ $empty }) =>
    $empty
      ? css`
          position: relative;
          opacity: 1;
        `
      : css`
          position: absolute;
          opacity: 0;
        `}
`;

export const Badge = styled(BadgeItem)`
  max-width: 30ch;
  height: fit-content;
  overflow: hidden;
  line-height: 1.6;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Dot = styled.div`
  position: relative;
  height: 0.5rem;
  width: 0.5rem;
  left: 0.125rem;
  margin-right: 0.875rem;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.disabled};
  border-radius: 1px;
  transition: background 0.2s ease 0s;
  transform: rotate(45deg);
`;

export const Info = styled.div`
  display: flex;
  font-size: 0.6875rem;
  color: ${props => props.theme.disabled};

  & > span:first-of-type {
    transition: opacity 0.2s ease 0.2s;
  }
`;

export const Action = styled.div`
  margin-left: auto;
  opacity: 0;
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: opacity, color;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Snippet = styled.div`
  max-width: fit-content;
  gap: 0.375rem;
  font-size: 0.8125rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const fadeInOut = keyframes`
  0%, 45% {
    opacity: 1;
  }
  50%, 95% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Title = styled.div`
  max-width: 28ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Item = styled.li<{ $selected: boolean | null }>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;

  ${({ $selected }) =>
    $selected &&
    css`
      ${Info} {
        & ${Badges}, & ${Meta}:first-of-type {
          animation: ${fadeInOut} 4s infinite;
        }

        & ${Meta}:last-of-type {
          animation: ${fadeInOut} 4s infinite;
          animation-delay: 2s;
        }
      }

      ${Action} {
        opacity: 1;
      }

      ${Dot} {
        background: ${props => props.theme.foreground};
        border-color: ${props => props.theme.foreground};
      }
    `}
`;

export const Wrapper = styled(_W)`
  &.blank {
    margin-top: 0;
    padding-bottom: 0 !important;

    & ${List} {
      margin-bottom: 0;
    }
  }
`;
