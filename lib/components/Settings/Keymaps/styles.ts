import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div``;

export const List = styled.div`
  display: block;
`;

export const ListItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &:first-of-type hr {
    margin: 0.125rem 0;
  }
`;

export const Separator = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0.5rem 0px;
  border: none;
  outline: none;
`;

export const Label = styled.span`
  margin-right: auto;
  line-height: 1.625rem;
  font-size: 0.8125rem;
`;

export const Keys = styled.div`
  padding: 4px 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: border 0.2s ease 0s;

  &:hover {
    border: 1px solid ${({ theme }) => theme.scrollbarHover};

    & span {
      color: ${({ theme }) => theme.foreground};
    }
  }
`;

export const KeyItem = styled.span`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.popoverForeground};
  transition: color 0.2s ease 0s;
`;

export const Title = styled.span`
  margin-bottom: 1rem;
  font-size: 13px;
  text-align: center;
`;

export const Preview = styled.div`
  position: absolute;
  padding: 1rem 2rem;
  top: 10vh;
  left: 50%;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  transform: translateX(-50%) scale(0.99);
  box-shadow:
    0px 2px 7px rgba(0, 0, 0, 0.15),
    0px -2px 7px rgba(0, 0, 0, 0.15),
    0px 5px 17px rgba(0, 0, 0, 0.3);
  animation: ${keyframes`
    100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  `} 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s forwards;
`;

export const PreviewKeys = styled.div`
  height: 1.25rem;
  padding: 4px 0.25rem;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PreviewKeyItem = styled.span`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.popoverForeground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
`;
