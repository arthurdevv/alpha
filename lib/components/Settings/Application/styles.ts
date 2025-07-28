import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 3.125rem;
  margin-bottom: 2rem;
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
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
    background: ${props => props.theme.transparent};
  }
`;

export const LogoText = styled.div`
  position: relative;
  font-size: 4.0625rem;
  font-weight: 700;
  line-height: 1.6;
`;

export const Version = styled.div`
  position: absolute;
  right: -2.1875rem;
  bottom: 1.5rem;
  font-size: 0.8125rem;
  cursor: pointer;
  color: ${props => props.theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const CheckForUpdates = styled.div`
  font-size: 0.8125rem;
  cursor: pointer;
  transition: opacity 0.2s ease 1s;

  &::after {
    content: '...';
    opacity: 0;
    transition: opacity 0.2s ease 1s;
  }

  &:active {
    opacity: 0.5;
    transition: opacity 0.2s ease 0s;

    &::after {
      opacity: 1;
      transition: opacity 0.2s ease 0s;
    }
  }
`;
