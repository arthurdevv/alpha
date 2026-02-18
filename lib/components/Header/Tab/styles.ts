import styled, { css, keyframes } from 'styled-components';

export const Group = styled.div`
  height: 100%;
  flex: 0 1 auto;
  display: flex;
  overflow: hidden;
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
    var(--header, ${props => props.theme.background}),
    var(--header, ${props => props.theme.background})
  );
  transition: 0.2s ease 0s;
  pointer-events: none;
`;

export const Container = styled.div<{
  $isCurrent: boolean;
  $isClosing: boolean;
  $tabWidth: 'auto' | 'fixed' | undefined;
}>`
  position: relative;
  width: 12.5rem;
  padding: 0 1rem;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--foreground, ${props => props.theme.disabled});
  background: var(--header, transparent);
  transition:
    color 0.2s linear,
    opacity 0.2s linear,
    width 0.2s linear,
    padding 0.2s linear;

  &:hover {
    ${Mask} {
      opacity: 1;
    }

    & div {
      opacity: 1;
      transition: all 0.2s ease 0s;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.25rem;
    top: 0;
    background: var(--indicator, transparent);
    transition: opacity 0.2s ease 0s;
  }

  ${({ $isClosing }) =>
    !$isClosing &&
    css`
      animation: ${keyframes`
        from {
          width: 0;
          padding: 0;
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      `} 0.28s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    `}

  ${({ $isCurrent }) =>
    $isCurrent &&
    css`
      cursor: default;
      color: var(--foreground, ${p => p.theme.foreground});
      background: var(--acrylic, var(--background, transparent));
    `}

  ${({ $isClosing }) =>
    $isClosing &&
    css`
      width: 0 !important;
      padding: 0;
      opacity: 0;
      pointer-events: none;
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

export const Title = styled.span`
  font-size: 0.8125rem;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0;
  transform: translateY(1px);
  animation: ${keyframes`
    to { opacity: 1; transform: translateY(0); }
  `} 0.22s ease forwards;
`;

export const Action = styled.div`
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

    & div span {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.6s;
    }
  }
`;
