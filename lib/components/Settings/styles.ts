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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.div`
  display: inline-flex;
  flex: 1 0 1%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Description = styled.span`
  margin-top: 0.125rem;
  font-size: 0.75rem;
  color: ${props => props.theme.disabled};

  @media screen and (max-width: 37.5rem) {
    display: none;
  }
`;

export const Badges = styled.div`
  margin-left: 0.375rem;
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

export const Entry = styled.div<{ $flex?: boolean }>`
  position: relative;

  ${props =>
    props.$flex &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}

  &:hover [type="number"] svg {
    color: ${props => props.theme.foreground};
  }
`;

export const Input = styled.input<{ $width?: string }>`
  height: 1.75rem;
  font-size: 0.8125rem;
  text-align: end;
  text-overflow: ellipsis;
  color: ${props => props.theme.disabled};
  background: ${props => props.theme.transparent};
  border: none;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};

    & ~ div svg {
      color: ${props => props.theme.foreground};
    }
  }

  ${({ type, $width }) =>
    type === 'number'
      ? css`
          width: calc(5ch + 0.75rem);
          padding-right: 0.75rem;

          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            -webkit-appearance: none;
          }
        `
      : css`
          width: ${$width || 'calc(15ch + 0.125rem)'};
          padding-right: 0.125rem;
          z-index: 1;

          &:hover ~ div {
            color: ${props => props.theme.foreground};
          }

          &:focus ~ div {
            opacity: 0;
          }
        `}
`;

export const Selector = styled.select`
  position: relative;
  width: fit-content;
  max-width: 9.875rem;
  height: 1.75rem;
  padding-right: 0.75rem;
  font:
    400 0.8125rem 'Inter',
    sans-serif;
  z-index: 1;
  text-align: end;
  text-overflow: ellipsis;
  outline: none;
  appearance: none;
  color: ${props => props.theme.disabled};
  background: ${props => props.theme.transparent};
  border: none;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${props => props.theme.foreground};

    & ~ div svg {
      color: ${props => props.theme.foreground};
    }
  }

  & option {
    background: ${props => props.theme.background};
  }
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

export const Spinner = styled.div<{ $input: string }>`
  position: absolute;
  top: ${props => (props.$input === 'text' ? '0.0625rem' : '0.125rem')};
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover svg {
    color: ${props => props.theme.foreground};
  }

  ${props =>
    props.$input === 'text'
      ? css`
          z-index: 2;
          top: 0.0625rem;

          & svg path {
            pointer-events: all;
          }
        `
      : css`
          z-index: 0;
          top: -0.0625rem;
        `}

  & svg {
    color: ${props => props.theme.icon};
    transition: color 0.2s ease 0s;
  }
`;
