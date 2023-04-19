import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & svg {
    width: 3rem;
    height: 3rem;
  }
`;

export const Logo = styled.div`
  font-size: 4.0625rem;
  font-weight: 700;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Shortcuts = styled.div`
  display: block;
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
`;
