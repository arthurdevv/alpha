import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const List = styled.div`
  padding: 0.875rem 1rem;
`;

export const Info = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  & span {
    cursor: text;
    user-select: text;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Copied = styled.div<{ $hasCopied: boolean }>`
  position: fixed;
  width: max-content;
  height: 1.875rem;
  padding: 0.25rem 0.5rem;
  top: 75vh;
  left: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${({ theme }) => theme.foreground};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transform: translate(-50%);
  transition: opacity 0.2s ease 0s;
  opacity: ${({ $hasCopied }) => ($hasCopied ? 1 : 0)};
`;
