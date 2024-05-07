import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity 0.2s ease 0s;
`;

export const Logo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    position: relative;
    width: 3rem;
    height: 3rem;
    z-index: 1;
    background: ${({ theme }) => theme.transparent};
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
  line-height: 1.6;
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

export const Shortcuts = styled.div`
  display: block;
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

export const ShortcutItem = styled.div`
  margin: 1rem 0;
  display: flex;
  white-space: normal;
  align-items: center;
  justify-content: flex-end;
`;

export const ShortcutLabel = styled.div`
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-align: right;
  display: flex;
  align-items: center;
  vertical-align: middle;
`;

export const ShortcutKeys = styled.span`
  margin: 0 0.375rem;
  padding: 0.25rem 0.375rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
`;

export const Footer = styled.footer<{ $isVisible: boolean }>`
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
  color: ${({ theme }) => theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${({ theme }) => theme.foreground};
  }

  animation: ${keyframes`
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  `} 1s ease 2.3s forwards;
`;
