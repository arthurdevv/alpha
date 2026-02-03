import styled, { css } from 'styled-components';

export const Theme = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Colors = styled.div<{ $visible: boolean }>`
  gap: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;

  ${({ $visible }) =>
    $visible
      ? css`
          transition: margin 0.2s ease 0s;

          & > div {
            opacity: 1;
            transition:
              opacity 0.2s ease 0.15s,
              height 0.2s ease 0s,
              margin 0.2s ease 0s,
              width 0.2s ease 0s;
          }
        `
      : css`
          margin: 0;
          transition: margin 0.2s ease 0.15s;

          & > div {
            opacity: 0;
            height: 0;
            width: 0;

            transition:
              opacity 0.2s ease 0s,
              height 0.2s ease 0.15s,
              width 0.2s ease 0.15s;
          }
        `}

  & > :first-child :last-child {
    left: 0;

    div {
      left: 3px;
    }
  }
`;

export const AnsiColor = styled.div`
  position: relative;
  width: 1.4375rem;
  height: 1.4375rem;
  flex-shrink: 0;
  font-size: 0.5625rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  text-shadow: 0px 1px 3px #000000;

  &:hover :last-child {
    opacity: 1;
    transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s;
  }
`;

export const Preview = styled.div<{ $code?: boolean }>`
  position: relative;
  padding: 0.625rem;
  overflow: hidden;
  line-height: 1.5;
  font-size: 0.8125rem;
  cursor: text;
  user-select: text;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  transition: background 0.2s ease 0s;
  font-variant-ligatures: common-ligatures discretionary-ligatures;

  & pre {
    font-family: inherit;
    color: inherit;
    cursor: text;
  }

  ${({ $code }) =>
    $code &&
    css`
      color: ${props => props.theme.foreground};
      cursor: inherit;
      outline: none;
      border: none;
    `}
`;

export const Toggle = styled.div`
  position: absolute;
  width: fit-content;
  top: 0.625rem;
  right: 0.75rem;
  gap: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font:
    400 11px 'Inter',
    sans-serif;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Cursor = styled.span`
  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  animation: blink 1.1s step-start infinite;

  &.cursor {
    height: 1rem;
  }

  &.hidden {
    display: none;
  }
`;

export const Flex = styled.div<{ $column?: boolean; $isCode?: boolean }>`
  width: fit-content;
  display: flex;

  ${({ $column }) =>
    $column
      ? css`
          flex-direction: column;
          justify-content: center;
        `
      : css`
          flex-direction: row;
          align-items: center;
        `}

  ${({ $isCode }) =>
    $isCode &&
    css`
      width: 100%;
      cursor: text;
    `}
`;
