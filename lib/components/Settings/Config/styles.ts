import styled, { css } from 'styled-components';

export const Code = styled.textarea<{
  $fontFamily: string;
  $transition: boolean;
  $defaults: boolean;
}>`
  height: 100%;
  flex: 1 0 1%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  font: 400 0.8125rem / 1.8
    ${({
      $fontFamily,
    }) => `${$fontFamily.length > 1 ? `${$fontFamily},` : $fontFamily} 'Fira Code',
    Consolas,
    sans-serif`};
  color: ${props => props.theme.disabled};
  background: ${props => props.theme.codeAcrylic};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  outline: none;
  resize: none;
  transition-property: color, opacity;
  transition-duration: 0.2s, 0.1s;
  transition-timing-function: ease, linear;

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};
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

  ${({ $transition }) =>
    $transition
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}

  ${({ $defaults }) =>
    $defaults &&
    css`
      user-select: none;
      cursor: default;
    `}
`;

export const Wrapper = styled.div<{ $element?: string }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  ${({ $element }) =>
    $element === 'Keymaps'
      ? css`
          @media screen and (max-width: 40.625rem) {
            display: none;
          }
        `
      : $element === 'Config'
        ? css`
            @media screen and (max-width: 34.0625rem) {
              display: none;
            }
          `
        : undefined}
`;

export const Action = styled.div`
  font-size: 0.8125rem;
  cursor: pointer;
  transition: opacity 0.2s ease 1s;

  &:active {
    opacity: 0.5;
    transition: opacity 0.2s ease 0s;
  }
`;

export const Label = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
`;

export const Warning = styled.span<{ $visible: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  margin: 0.375rem;
  display: block;
  opacity: 0;
  background: ${props => props.theme.foreground};
  border-radius: 100%;
  transition: opacity 0.2s ease 0s;

  ${props =>
    props.$visible &&
    css`
      opacity: 1;
    `}
`;

export const Selectors = styled.div`
  width: fit-content;
  height: 1.5rem;
  margin-left: auto;
  padding: 0 0.5rem;
  display: inline-flex;
  align-items: center;
  background: ${props => props.theme.badge};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
`;

export const Selector = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }

  &:first-of-type {
    padding-right: 0.5rem;
    border-right: 1px solid ${props => props.theme.border};
  }

  &:last-of-type {
    padding-left: 0.5rem;
  }

  &.selected {
    color: ${props => props.theme.foreground};
  }
`;
