import styled from 'styled-components';

export const Title = styled.div`
  padding: 1rem 2rem;
  font-size: 0.8125rem;
  text-align: center;

  & span {
    padding: 0.1875rem 0.25rem;
    font-size: 0.75rem;
    color: ${props => props.theme.popoverForeground};
    background: ${props => props.theme.code};
    border: 1px solid ${props => props.theme.border};
    border-radius: 3px;
    user-select: text;
  }
`;
