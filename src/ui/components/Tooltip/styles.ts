import { styled } from '@linaria/react';

export const Container = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
`;

export const Arrow = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  transition: opacity 0.2s ease 0s;

  &.top {
    top: -0.75rem;
    border-bottom-color: var(--border);

    &::before {
      top: -5px;
      border-bottom-color: var(--background);
    }
  }

  &.bottom {
    top: 1.4375rem;
    border-top-color: var(--border);

    &::before {
      top: -9px;
      border-top-color: var(--background);
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 7px solid transparent;
  }
`;

export const Content = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease 0s;

  &.v {
    opacity: 1;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: max-content;
  min-height: 1.875rem;
  padding: 0.25rem 0.5rem;
  background: var(--tooltip);
  border: 1px solid var(--border);
  border-radius: 3px;
  box-shadow: 0 2px 10px var(--box-shadow);

  &.k {
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  }
`;

export const Label = styled.span`
  flex: 1;
  overflow: hidden;
  min-width: 0;
  font-size: 0.75rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--foreground);
`;

export const Keys = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
`;

export const Key = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  font-size: 0.688rem;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--code);
  border: 1px solid var(--border);
  border-radius: 3px;
`;
