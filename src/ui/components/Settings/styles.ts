import { styled } from '@linaria/react';

export const Container = styled.div`
  position: absolute;
  z-index: 1;
  flex: 1 0 0;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
  animation: fade-in 0.8s ease 0s forwards;
`;

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  padding: 1rem 1.5rem 1.5rem 0.625rem;
  transition: opacity 0.1s linear 0s;
  animation: fade-in 0.2s ease-in-out;
`;

export const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-width: 11.75rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
`;

export const NavigationItem = styled.button`
  min-height: 2.0625rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--muted);
  transition: 0.2s ease 0s;

  &:hover,
  &.selected {
    color: var(--foreground);
  }
`;

export const Title = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0.875rem 0 0.875rem 0;
  font-size: 1.25rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const Action = styled.button`
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--foreground);
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:active {
    opacity: 0.5;

    &::after {
      opacity: 1;
    }
  }
`;

export const Form = styled.form`
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 1.625rem;
  margin-left: auto;
  border: 1px solid var(--border);
  border-radius: 4px;
`;

export const FormItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--muted);
  transition: width 0.2s ease 0s;

  input {
    min-width: 100%;
    min-height: 100%;
    padding: 0 0.5rem 0 1.75rem;
    text-transform: inherit;

    & ~ svg {
      position: absolute;
      cursor: text;
      width: 0.875rem;
      height: 0.875rem;
      left: 0.5rem;
      color: var(--muted);
      transition: color 0.2s ease 0s;
    }

    &:focus ~ svg {
      color: var(--foreground);
    }

    &::placeholder {
      color: var(--muted);
    }
  }

  button {
    padding: 0 0.5rem;
    color: var(--muted);
    cursor: pointer;
    text-transform: inherit;
    transition: color 0.2s ease 0s;
  }

  &:hover {
    input, button {
      color: var(--foreground);
    }
  }

  &:has(> input:placeholder-shown) {
    width: 5.3125rem;
  }

  &:has(> input:focus),
  &:has(> input:not(:placeholder-shown)) {
    width: 12.5rem;
  }

  &:has(button) {
    border-left: 1px solid var(--border);
  }
`;

export const NoResults = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: normal;
  text-align: center;
  text-overflow: ellipsis;
  color: var(--muted);
  animation: fade-in 0.3s ease-in-out 0s;

  & svg {
    width: 1.625rem;
    height: 1.625rem;
    margin-bottom: 0.375rem;
  }

  & span:first-of-type {
    font-weight: 600;
  }

  & span:last-of-type {
    margin-top: 0.125rem;
    font-weight: 400;
  }
`;
