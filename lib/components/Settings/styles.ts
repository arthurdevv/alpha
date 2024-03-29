import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  flex: 1 0 0;
  display: flex;
  overflow: hidden;
  background: ${({ theme }) => theme.background};
`;

export const Navigation = styled.nav`
  min-width: 11.75rem;
  height: 100%;
  padding: 1.25rem 0.625rem;
  display: flex;
  flex-direction: column;
`;

export const NavigationItem = styled.div`
  padding: 0.5rem 1rem;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.disabled};
  transition: 0.2s ease 0s;

  &:hover,
  &.selected {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const Section = styled.section<{ $section: Section }>`
  width: 100%;
  height: calc(100vh - 2.5rem);
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  ${({ $section }) =>
    $section === 'Application' &&
    css`
      justify-content: center;
    `}

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Title = styled.span`
  margin-bottom: 1rem;
  font-size: 1rem;
`;

export const Separator = styled.hr`
  height: 1px;
  margin: 0.875rem 0px;
  border: none;
  outline: none;
`;

export const Key = styled.div`
  font-size: 0.8125rem;
  display: flex;
  flex-direction: column;

  &:first-of-type hr {
    margin: 0.125rem 0;
  }
`;

export const KeyContent = styled.div`
  line-height: 1.625rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const KeyLabel = styled.span`
  margin-top: 0.125rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.disabled};
`;

export const Input = styled.input`
  height: 1.75rem;
  padding: 0 0.5rem;
  font:
    400 0.8125rem 'Inter',
    sans-serif;
  outline: none;
  appearance: none;
  color: ${({ theme }) => theme.disabled};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.foreground};
  }

  ${({ type }) =>
    type === 'text'
      ? css`
          width: 12.5rem;
        `
      : type === 'number'
      ? css`
          width: 3rem;
        `
      : css`
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        `}

  ${({ label }) =>
    label === 'Scrollback'
      ? css`
          width: 4.5rem;
        `
      : label === 'Opacity'
      ? css`
          width: 3.3rem;
        `
      : ''}
`;

export const Switch = styled.div`
  position: relative;
  width: 1.875rem;
  height: 1.125rem;
  cursor: pointer;
  background: ${({ theme }) => theme.border};
  border-radius: 10px;
  transition: background 0.2s ease 0s;

  &.checked {
    background: ${({ theme }) => theme.foreground};

    & span {
      left: 0.75rem;
      background: ${({ theme }) => theme.background};
    }
  }
`;

export const SwitchThumb = styled.span`
  position: absolute;
  width: 0.875rem;
  height: 0.875rem;
  margin: 0.125rem;
  left: 0;
  background: ${({ theme }) => theme.foreground};
  border-radius: 10px;
  transition:
    left 0.2s ease 0s,
    background ease 0s;
`;

export const Selector = styled.select`
  width: 4rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  font:
    400 0.8125rem 'Inter',
    sans-serif;
  line-height: 1rem;
  outline: none;
  appearance: none;
  color: ${({ theme }) => theme.disabled};
  background: 85% center no-repeat
    url("data:image/svg+xml,%3Csvg width='0.5rem' height='1.5rem' viewBox='0 0 8 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 7L7 11H1L4 7Z' fill='%23404040' /%3E%3Cpath d='M4 17L1 13L7 13L4 17Z' fill='%23404040' /%3E%3C/svg%3E");
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.foreground};
  }

  & option {
    background: ${({ theme }) => theme.background};
  }

  ${({ label }) =>
    label === 'Language'
      ? css`
          width: 6.875rem;
          background-position: 90%;
        `
      : label === 'Renderer'
      ? css`
          width: 4.5rem;
        `
      : label === 'Default Shell'
      ? css`
          width: 5.25rem;
          background-position: 90%;
        `
      : ''}
`;
