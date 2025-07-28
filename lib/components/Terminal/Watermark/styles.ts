import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div<{ $hidden: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity 1s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;

  ${props =>
    props.$hidden &&
    css`
      opacity: 0;
      pointer-events: none;
      transition: none;
    `}
`;

export const Logo = styled.div`
  position: relative;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    position: relative;
    width: 3rem;
    height: 3rem;
    z-index: 1;
    background: ${props => props.theme.transparent};
    transform: translateX(180%);
    animation: ${keyframes`
      0% {
        transform: translateX(180%);
      }

      100% {
        transform: translateX(0);
      }
    `} 1s ease 2s forwards;

    & path {
      animation: ${keyframes`
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
    `} 3.6s ease forwards;
    }
  }
`;

export const LogoName = styled.div`
  position: relative;
  font-size: 4.0625rem;
  font-weight: 700;
  line-height: 1;
  opacity: 0;
  animation: ${keyframes`
      0% {
        transform: translateX(-3.3rem);
        opacity: 0;
      }

      100% {
        transform: translateX(0);
        opacity: 1;
      }
    `} 1s ease 2.85s forwards;
`;

export const Wrapper = styled.div`
  position: absolute;
  top: calc(50% + 3.5rem);
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  opacity: 0;
  animation: ${keyframes`
      0% {
        transform: translateY(2rem);
        opacity: 0;
      }

      100% {
        transform: translateY(0);
        opacity: 1;
      }
    `} 1s ease 2.85s forwards;
`;

export const Keys = styled.div`
  margin: 0 0.3125rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
`;

export const KeyItem = styled.div`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background: ${props => props.theme.background};
  color: ${props => props.theme.popoverForeground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
`;

export const Footer = styled.footer<{ $isVisible?: boolean }>`
  position: absolute;
  width: 100%;
  padding: 1.25rem 1.5625rem;
  bottom: 0;
  z-index: ${({ $isVisible }) => $isVisible && 20};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Version = styled.div`
  font-size: 0.8125rem;
  opacity: 0;
  cursor: pointer;
  pointer-events: none;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
      pointer-events: all;
    }
  `} 1s ease 2.3s forwards;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;
