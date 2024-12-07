import styled, { css } from 'styled-components';

export const Container = styled.div<{ $origin: string | null }>`
  position: absolute;
  width: 100%;
  height: 100%;
  flex: 1 0 0;
  z-index: 1;
  display: ${({ $origin }) => ($origin === 'Settings' ? 'flex' : 'none')};
  overflow: hidden;
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
  font-size: 0.8125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;

  &:hover,
  &.selected {
    color: ${props => props.theme.foreground};
  }
`;

export const Section = styled.section<{
  $transition: boolean;
  $section?: string;
}>`
  position: relative;
  width: 100%;
  height: calc(100vh - 2.5rem);
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $section }) =>
    $section === 'Application' ? 'space-evenly' : 'normal'};
  transition: opacity 0.1s linear 0s;

  ${({ $transition }) =>
    $transition
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  &:first-of-type > :first-child {
    margin: 0 0 1rem 0;
  }
`;

export const Title = styled.span`
  margin: 2rem 0 1rem 0;
  font-size: 1.125rem;
`;

export const Separator = styled.hr`
  height: 1px;
  margin: 0.75rem 0px;
  border: none;
  outline: none;
`;

export const Option = styled.div`
  font-size: 0.8125rem;
  display: flex;
  flex-direction: column;

  &:first-of-type hr {
    margin: 0.125rem 0;
  }
`;

export const Content = styled.div`
  height: 1.75rem;
  line-height: 1.625rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.div`
  display: inline-flex;
`;

export const Description = styled.span`
  margin-top: 0.125rem;
  font-size: 0.75rem;
  color: ${props => props.theme.disabled};
`;

export const Badges = styled.div`
  margin-left: 0.5rem;
  gap: 0.25rem;
  opacity: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: 0.2s ease 0s;
  transition-property: opacity, scale;
  transform: scale(0.99);

  &.visible {
    opacity: 1;
    transform: scale(1);
  }
`;

export const BadgeItem = styled.span`
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

export const Input = styled.input<{ $name?: string; type?: string }>`
  width: 12rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
  background: ${props => props.theme.transparent};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};
  }

  ${({ type }) =>
    type === 'number' &&
    css`
      width: 4rem;
    `}

  ${props =>
    props.$name === 'Scrollback' &&
    css`
      width: 5rem;
    `}
`;

export const Switch = styled.div`
  position: relative;
  width: 1.875rem;
  height: 1.125rem;
  padding-block: 0.125rem;
  cursor: pointer;
  background: ${props => props.theme.border};
  transition: background 0s ease 0.1s;
  border-radius: 100px;

  &.checked {
    background: ${props => props.theme.foreground};

    & span {
      transform: translateX(13px);
      background: ${props => props.theme.background};
    }
  }
`;

export const SwitchSlider = styled.span`
  width: 0.875rem;
  height: 0.875rem;
  display: block;
  background: ${props => props.theme.disabled};
  transition: 0.1s ease 0.1s;
  transition-property: transform, background;
  transform: translateX(2px);
  will-change: transform;
  border-radius: 100px;
`;

export const Selector = styled.select<{ $name: string }>`
  width: 4rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  font:
    400 0.8125rem 'Inter',
    sans-serif;
  line-height: 1rem;
  outline: none;
  appearance: none;
  color: ${props => props.theme.disabled};
  background: 85% center no-repeat
    url("data:image/svg+xml,%3Csvg width='0.5rem' height='1.5rem' viewBox='0 0 8 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 7L7 11H1L4 7Z' fill='%23404040' /%3E%3Cpath d='M4 17L1 13L7 13L4 17Z' fill='%23404040' /%3E%3C/svg%3E");
  background-color: ${props => props.theme.transparent};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};
  }

  & option {
    background: ${props => props.theme.background};
  }

  ${({ $name }) =>
    $name === 'Language'
      ? css`
          width: 6.875rem;
          background-position: 92%;
        `
      : $name === 'Renderer' || $name === 'Link modifier'
        ? css`
            width: 5rem;
            background-position: 90%;
          `
        : $name === 'Default profile'
          ? css`
              width: 9rem;
              background-position: 94%;
            `
          : $name === 'Right click' &&
            css`
              width: 7.625rem;
              background-position: 93%;
            `}
`;
