import styled, { css } from 'styled-components';

export const Wrapper = styled.div<{ $section: string; $fade?: boolean }>`
  display: flex;
  overflow: auto;
  flex-direction: column;
  padding: 1rem;
  transition: opacity 0.1s linear 0s;

  ${props =>
    props.$section === 'advanced'
      ? css`
          padding: 0.5rem 1rem 1rem;
        `
      : props.$section === 'general' &&
        css`
          padding: 0rem 1rem 1rem;
        `}

  ${({ $fade }) =>
    $fade
      ? css`
          opacity: 0;
        `
      : css`
          opacity: 1;
        `}

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

export const PropertyForm = styled.div`
  flex: 1;
  display: flex;
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;

  &:has(select) div:first-child {
    padding: 0 0.5rem;

    & select {
      width: 100%;
      z-index: 10;
      text-align: left;
    }

    & select ~ div {
      right: 0.5rem;
    }

    border-right: 1px solid ${props => props.theme.border};
  }
`;

export const PropertyInput = styled.input`
  min-width: 8ch;
  padding: 0 0.5rem;
  flex: 1;
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:not(:first-of-type) {
    border-left: 1px solid ${props => props.theme.border};
  }

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};
  }

  &[type='number'] {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
`;

export const PropertyAdd = styled.div`
  height: 1.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: color, opacity;
  border-left: 1px solid ${props => props.theme.border};

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const PropertyList = styled.div`
  margin-top: 1.125rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Property = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover span {
    opacity: 1;
  }
`;

export const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  user-select: text;
`;

export const PropertyName = styled.span`
  margin-right: auto;
  margin-bottom: 0.625rem;
  font-size: 0.8125rem;
  color: ${props => props.theme.foreground};

  & span {
    margin: 0 0.5rem;
    font-size: 0.9375rem;
    line-height: 1;
    color: ${props => props.theme.disabled};
    cursor: default;
    user-select: none;
  }
`;

export const PropertyValues = styled.div<{ $capitalize?: boolean }>`
  position: relative;
  gap: 0.25rem;
  display: inline-flex;
  align-items: center;

  & span::first-letter {
    text-transform: ${({ $capitalize }) =>
      $capitalize ? 'uppercase' : 'none'};
  }
`;

export const PropertyValue = styled.span<{ $select?: boolean }>`
  width: fit-content;
  max-width: 32ch;
  padding: 0.1875rem 0.375rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  color: ${props => props.theme.popoverForeground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;

  ${props =>
    props.$select
      ? css`
          cursor: text;
          user-select: text;
        `
      : css`
          cursor: default;
          user-select: none;
        `}

  & span {
    text-transform: lowercase;
  }

  &:hover ~ div {
    opacity: 1;
    transition-delay: 0.6s;
  }
`;

export const PropertyButton = styled.div`
  padding: 0.25rem;
  cursor: pointer;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease 0s;
  color: ${props => props.theme.disabled};

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const PropertyAction = styled.span`
  font-size: 0.8125rem;
  cursor: pointer;
  opacity: 0;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const PropertyTooltip = styled.div`
  position: absolute;
  width: max-content;
  height: 1.625rem;
  padding: 0.25rem 0.5rem;
  right: -4.5625rem;
  z-index: 100;
  opacity: 0;
  text-transform: none;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  transition: opacity 0.2s ease 0s;

  & span {
    font-size: 0.75rem;
    color: ${props => props.theme.foreground};
  }

  & div {
    position: absolute;
    left: -0.75rem;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 6px solid transparent;
    border-right-color: ${props => props.theme.border};
    transition: opacity 0.2s ease 0s;

    &::before {
      content: '';
      position: absolute;
      left: -0.3125rem;
      border: 7px solid transparent;
      border-right-color: ${props => props.theme.background};
    }
  }
`;

export const Warning = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
  justify-content: center;
  transform: translate(-50%, -50%);
`;

export const Copied = styled.div<{ $hasCopied: boolean }>`
  position: fixed;
  width: max-content;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  top: 75vh;
  left: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${props => props.theme.foreground};
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transform: translate(-50%);
  transition: opacity 0.2s ease 0s;
  opacity: ${({ $hasCopied }) => ($hasCopied ? 1 : 0)};
`;

export const Dialog = styled.span`
  margin-left: auto;
  font-size: 0.8125rem;
  max-width: 40ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: text;
  cursor: pointer;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export { Container, Content, Tags, Tag } from '../../styles';

export {
  Option,
  Content as OptionContent,
  Description,
  Input,
  Entry,
  Spinner,
  Separator,
  Selector,
  Switch,
  SwitchSlider,
} from 'lib/components/Settings/styles';
