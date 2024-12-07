import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  margin-bottom: 0.875rem;
  font-size: 0.8125rem;
  text-align: justify;
`;

export const Preview = styled.pre`
  max-height: 150px;
  overflow: auto;
  white-space: break-spaces;
  font: 13px/1.6 'Fira Code';
`;
