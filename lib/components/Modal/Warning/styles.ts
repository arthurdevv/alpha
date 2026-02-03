import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0.875rem 1rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  margin-bottom: 0.875rem;
  font-size: 0.8125rem;
  text-align: center;

  @media screen and (max-width: 35rem) {
    text-align: justify;
  }
`;

export const Preview = styled.div`
  position: relative;
  padding: 0.625rem;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 0.8125rem;
  background: ${props => props.theme.code};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
`;
