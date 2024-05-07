import styled, { css } from 'styled-components';

export const Container = styled.div<{ $hidden: boolean; $width?: number }>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width || 31.25}rem;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;

  ${({ $hidden }) =>
    $hidden
      ? css`
          opacity: 0;
          transform: scale(0.98);
        `
      : css`
          opacity: 1;
          transform: scale(1);
        `}
`;

export const Content = styled.div<{ $maxHeight?: number }>`
  overflow: hidden;
  background: ${props => props.theme.background};
  box-shadow:
    0px 2px 7px rgba(0, 0, 0, 0.15),
    0px -2px 7px rgba(0, 0, 0, 0.15),
    0px 5px 17px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;

  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      height: ${$maxHeight}rem;
      max-height: ${$maxHeight}rem;
    `}
`;

export const Column = styled.div`
  margin-top: 1.5rem;
`;

export const Group = styled.div`
  margin-top: 1.25rem;

  &:first-of-type {
    margin: 0;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  gap: 0.5rem;
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

export const Tag = styled.div`
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
`;

export const List = styled.ul`
  position: relative;
  width: 100%;
  margin-top: 0.625rem;
  padding-left: 0.625rem;
`;

export const Item = styled.li`
  padding: 0.375rem 0;
  font-size: 0.8125rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover > :last-child {
    opacity: 1;
  }
`;

export const Info = styled.div`
  line-height: 1.525rem;
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  color: ${({ theme }) => theme.foreground};

  & > span:first-child {
    height: 1.75rem;
    font-size: 0.8125rem;
    line-height: 1.625rem;
  }
`;

export const Shell = styled.span`
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
`;

export const Actions = styled.div`
  gap: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease 0s;
`;

export const Action = styled.div`
  font-size: 0.8125rem;
  cursor: pointer;
  color: ${({ theme }) => theme.disabled};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${({ theme }) => theme.foreground};
  }
`;
