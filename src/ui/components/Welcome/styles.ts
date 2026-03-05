import styled, { css, keyframes } from 'styled-components';

export const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Logo = styled.div`
  position: relative;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(175%);
  animation: ${keyframes`
      0% {
        transform: translateY(175%);
      }

      100% {
        transform: translateY(0);
      }
    `} 1s ease 3.8s forwards;

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
  width: 100%;
  gap: 1.5rem;
  margin: 2rem auto 0 auto;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 0.8125rem;
  opacity: 0;
  animation: ${keyframes`
      0% {
        opacity: 0;
        pointer-events: none;
      }

      100% {
        opacity: 1;
        pointer-events: all;
      }
    `} 1.25s ease 4.6s forwards;
`;

export const Texts = styled.div`
  gap: 0.375rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.span`
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
`;

export const Subtitle = styled.span`
  font-size: 0.75rem;
  font-style: italic;
  color: ${props => props.theme.disabled};
`;

export const Options = styled.div`
  width: 100%;
  max-width: 70%;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  background: ${props => props.theme.badge};
  color: ${props => props.theme.popoverForeground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
`;

export const Footer = styled.footer`
  position: relative;
  width: 100%;
  padding: 0 1.5625rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  font-size: 0.8125rem;
  color: ${props => props.theme.foreground};
  animation: ${keyframes`
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    `} 1.25s ease 4.6s forwards;
`;

export const Version = styled.div`
  position: absolute;
  right: 2rem;
  opacity: 0;
  font-size: 0.8125rem;
  cursor: pointer;
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
  `} 1s ease 4.6s forwards;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Container = styled.div<{ $showWelcome: boolean }>`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.foreground};

  ${({ $showWelcome }) =>
    !$showWelcome &&
    css`
      ${Footer} {
        animation: none;
      }

      & * {
        opacity: 0;
        transition: opacity 1s ease 0s;
      }
    `}
`;
