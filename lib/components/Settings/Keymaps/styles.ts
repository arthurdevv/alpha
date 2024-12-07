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
  background: ${props => props.theme.transparent};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: border 0.2s ease 0s;
`;

export const Key = styled.div`
  height: 1.25rem;
  min-width: 1.25rem;
  font-size: 0.688rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};

  & span {
    padding: 0 0.25rem;
    transition: color 0.2s ease 0s;
  }

  &:hover span {
    color: ${props => props.theme.foreground};
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
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
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

export const PreviewKey = styled.span`
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.popoverForeground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
`;
