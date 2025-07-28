import styled, { css } from 'styled-components';

export const Code = styled.textarea<{ $fontFamily: string }>`
  height: 100%;
  flex: 1 0 1%;
  margin-bottom: 1rem;
  font: 400 0.8125rem / 1.8
    ${({
      $fontFamily,
    }) => `${$fontFamily.length > 1 ? `${$fontFamily},` : $fontFamily} 'Fira Code',
    Consolas,
    sans-serif`};
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;
  background: transparent;
  outline: none;
  border: none;
  resize: none;

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
`;

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
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
