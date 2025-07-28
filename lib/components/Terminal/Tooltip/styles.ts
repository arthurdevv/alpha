import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: absolute;
  z-index: 10;
  right: 1rem;
  bottom: 1rem;
  display: flex;
`;

export const Wrapper = styled.div<{
  $visible?: boolean;
  $text?: boolean;
  $hovered?: boolean;
}>`
  position: absolute;
  width: 1.875rem;
  height: 1.875rem;
  z-index: 10;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-property: opacity, right;
  border-radius: 4px;

  & svg {
    width: 1rem;
    height: 1rem;
  }

  ${({ $visible, $text }) =>
    !$text &&
    ($visible
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `)}

  ${({ $text }) =>
    $text &&
    css`
      width: fit-content;
      padding: 0.25rem 0.25rem 0.25rem 0.5rem;
      font-size: 0.75rem;
      opacity: 0;
      cursor: text;
      pointer-events: none;
      transition-delay: 0s, 0.1s;
    `}

  ${({ $hovered }) =>
    $hovered &&
    css`
      opacity: 1;
      transition-delay: 0.3s, 0.1s;
    `}
`;

export const Badges = styled.div`
  margin-left: 0.375rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
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
  transition: border-color 0.2s ease 0s;
`;
