import styled, { css, keyframes } from 'styled-components';

export const Group = styled.div`
  height: 100%;
  flex: 0 1 auto;
  display: flex;
  overflow: hidden;
`;

export const Container = styled.div<{
  $isCurrent: boolean;
  $transition: boolean;
  $tabWidth: 'auto' | 'fixed' | undefined;
}>`
  position: relative;
  width: 12.5rem;
  z-index: 100;
  padding: 0 1rem;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: width, color, opacity;
  animation: ${keyframes`
    0% {
      width: 0;
      padding: 0;
    }
  `} 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;

  &:hover {
    & span:first-of-type {
      -webkit-mask-size:
        calc(100% - 60px) auto,
        60px auto;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: left, right;
      -webkit-mask-image:
        linear-gradient(#000 0 0),
        linear-gradient(to left, transparent 0%, #000 100%);
    }

    & div:last-of-type {
      opacity: 1;
      transition: all 0.2s ease 0s;
    }
  }

  ${props =>
    props.$isCurrent &&
    css`
      cursor: default;
      color: ${props => props.theme.foreground};
    `}

  ${({ $transition }) =>
    !$transition &&
    css`
      width: 0 !important;
      padding: 0;
      opacity: 0;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  animation: ${keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `} 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
`;

export const Close = styled.div`
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
    width: 0.75rem;
    height: 0.75rem;
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
