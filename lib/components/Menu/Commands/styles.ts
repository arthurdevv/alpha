import styled from 'styled-components';

export const Keys = styled.div`
  margin-left: 0.5rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
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
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: border-color 0.2s ease 0s;
`;
