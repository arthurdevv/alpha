import { styled } from '@linaria/react';

export const Group = styled.div`
  animation: fade-in 0.2s ease 0s;
`;

export const GroupLabel = styled.span`
  font-size: 0.875rem;
`;

export const List = styled.ul`
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
  padding-left: 0.625rem;
`;

export const Icon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 0.125rem;
  cursor: pointer;
  color: var(--muted);
  opacity: 0;
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:hover {
    opacity: 1;
    color: var(--foreground);
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  opacity: 0;
  transition: opacity 0.2s ease 0s;
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 0.375rem 0;

  &:hover {
    ${Icon}, ${Actions} {
      opacity: 1;
    }
  }
`;

export const Name = styled.span`
  gap: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.625rem;
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  line-height: 1.525rem;
  color: var(--foreground);

  ${Name} {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const Action = styled.button`
  font-size: 0.8125rem;
  cursor: pointer;
  color: var(--muted);
  transition: color 0.2s ease 0s;

  &:hover {
    color: var(--foreground);
  }
`;
