import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  padding: 0 1rem 0.875rem;
  display: flex;
  flex-direction: column;
`;

export const Action = styled.div`
  margin-left: auto;
  opacity: 0;
  font-size: 0.8125rem;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: opacity, color;
  transform: translateY(0.5rem);

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Command = styled.div`
  max-width: fit-content;
  gap: 0.375rem;
  display: flex;
  flex-direction: column;
  font-size: 0.8125rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Info = styled.div`
  display: flex;
  font-size: 0.6875rem;
  color: ${props => props.theme.disabled};

  & span:first-of-type {
    transition: opacity 0.2s ease 0.2s;
  }

  & span:last-of-type {
    position: absolute;
    opacity: 0;
    max-width: 10.3125rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: opacity 0.2s ease 0.1s;
  }
`;

export const Dot = styled.div<{
  $first: boolean;
  $last: boolean;
  $old: boolean;
}>`
  position: relative;
  width: 0.625rem;
  height: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.disabled};
  border: 1px solid ${props => props.theme.icon};
  border-radius: 100%;
  transform: translateY(4px);
  transition: all 0.2s ease 0s;

  &::after {
    content: '';
    width: 0.125rem;
    height: 0.125rem;
    border-radius: 100%;
    background: ${props => props.theme.icon};
    transition: all 0.2s ease 0s;
  }

  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 2.125rem;
    top: 0.875rem;
    background: ${props => props.theme.icon};
    transition: background 0.2s ease 0s;
  }

  ${({ $first }) =>
    $first &&
    css`
      &::before {
        content: '';
        width: 1px;
        height: 2.5rem;
        top: 0.5rem;
        background: ${props => props.theme.icon};
      }
    `}

  ${({ $last }) =>
    $last &&
    css`
      &::before {
        content: none !important;
      }
    `}

  ${({ $old }) =>
    $old &&
    css`
      &::before {
        content: '•\\A•\\A•\\A•';
        width: 0.3125rem;
        height: 2.25rem;
        top: 0.6875rem;
        line-height: 0.625rem;
        font-size: 0.625rem;
        font-weight: 200;
        white-space: pre;
        color: ${props => props.theme.icon};
        background: transparent;
      }
    `}
`;

const selectedCss = css`
  ${Info} {
    span:first-of-type {
      opacity: 0;
      transition-delay: 0.9s;
    }

    span:last-of-type {
      opacity: 1;
      transition-delay: 1s;
    }
  }

  ${Action} {
    opacity: 1;
  }

  ${Dot} {
    color: ${props => props.theme.foreground};
    background: ${props => props.theme.foreground};
    border-color: transparent;

    &::before {
      content: '';
      background: linear-gradient(
        ${props => props.theme.foreground},
        rgba(64, 64, 64, 1)
      );
      width: 1px;
    }

    &::after {
      width: 0.25rem;
      height: 0.25rem;
      border: none;
      background: ${props => props.theme.background};
    }
  }
`;

export const Warning = styled.span`
  font-size: 0.875rem;
  text-align: center;
  color: ${props => props.theme.disabled};
`;

export const List = styled.ul`
  max-height: 13rem;
  gap: 1.25rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  text-overflow: ellipsis;
  list-style-type: none;

  &.empty {
    margin-bottom: 0.25rem;
    display: flex !important;

    ${Warning} {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const Value = styled.li<{ $selected: boolean | null }>`
  position: relative;
  gap: 0.875rem;
  display: flex;
  align-items: flex-start;

  ${({ $selected }) => $selected && selectedCss}
`;
