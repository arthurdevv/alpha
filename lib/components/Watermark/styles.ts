import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
    z-index: 10;
    background: ${({ theme }) => theme.background};
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
  display: flex;
  align-items: center;
  vertical-align: middle;
  font-size: 0.8125rem;
  text-align: right;
  letter-spacing: 0.04em;
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

export const Footer = styled.footer`
  position: absolute;
  width: 100%;
  padding: 1.25rem 1.5625rem;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Version = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.disabled};
  opacity: 0;

  animation: ${keyframes`
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    `} 1s ease 2.3s forwards;
`;
