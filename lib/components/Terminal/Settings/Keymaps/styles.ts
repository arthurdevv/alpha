import styled, { keyframes } from 'styled-components';

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
  margin: 0.5rem 0;
  border: none;
  outline: none;
`;

export const Label = styled.span`
  line-height: 1.625rem;
  font-size: 0.8125rem;
`;

export const Keys = styled.div`
  margin-left: auto;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: border 0.2s ease 0s;
`;

export const KeyItem = styled.div`
  height: 1.25rem;
  min-width: 1.25rem;
  font-size: 0.688rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.disabled};

  & span {
    padding: 0 0.25rem;
    transition: color 0.2s ease 0s;
  }

  &:hover span {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const Reset = styled.div`
  height: 100%;
  padding: 0 0.375rem;
  padding-right: 0.1875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.disabled};
  transition: color 0.2s ease 0s;

  & svg {
    width: 0.875rem;
    height: 0.875rem;
  }

  &:hover {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const Preview = styled.div`
  position: absolute;
  padding: 1rem 2rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  transform: scale(0.99);
  box-shadow:
    0px 2px 7px rgba(0, 0, 0, 0.15),
    0px -2px 7px rgba(0, 0, 0, 0.15),
    0px 5px 17px rgba(0, 0, 0, 0.3);
  animation: ${keyframes`
    100% {
      opacity: 1;
      transform: scale(1);
    }
  `} 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s forwards;
`;

export const PreviewTitle = styled.div`
  margin-bottom: 1rem;
  gap: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  display: flex;
`;

export const PreviewKeys = styled.div`
  height: 1.25rem;
  padding: 0.25rem;
  gap: 0.25rem;
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
