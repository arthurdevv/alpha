import styled, { css } from 'styled-components';

export const List = styled.div`
  display: block;
`;

export const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  &:first-of-type hr {
    margin: 0.125rem 0;
  }

  &:hover > div > span {
    opacity: 1;
  }

  & > div:not(:has(:nth-child(2))) > span {
    opacity: 1;
  }
`;

export const Separator = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0.5rem 0;
  border: none;
  outline: none;
`;

export const Label = styled.span`
  line-height: 1.875rem;
  font-size: 0.8125rem;
`;

export const Action = styled.span`
  margin-right: 4px;
  font-size: 0.8125rem;
  cursor: pointer;
  opacity: 0;
  color: ${props => props.theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const Wrapper = styled.div`
  gap: 0.375rem;
  display: inline-flex;
  align-items: center;
`;

export const Keys = styled.div`
  margin-left: auto;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  background: ${props => props.theme.transparent};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: border 0.2s ease 0s;
`;

export const Key = styled.div`
  height: 1.25rem;
  min-width: 1.25rem;
  font-size: 0.688rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};

  & span {
    padding: 0 0.25rem;
    transition: color 0.2s ease 0s;
  }

  &:hover span {
    color: ${props => props.theme.foreground};
  }
`;

export const Editor = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  transition-property: transform, opacity;

  ${({ $isVisible }) =>
    $isVisible
      ? css`
          opacity: 1;
          transform: scale(1);
        `
      : css`
          opacity: 0;
          transform: scale(0.98);
        `}
`;

export const EditorTags = styled.div`
  display: flex;
  gap: 0.375rem;

  & > :first-child {
    margin-left: auto;
  }
`;

export const EditorTag = styled.div`
  max-width: 100%;
  height: 1.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: ${props => props.theme.disabled};
  background: ${props => props.theme.background};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  transition: color 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
  }
`;

export const EditorContent = styled.div`
  padding: 1rem 2rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
`;

export const EditorTitle = styled.div`
  margin-bottom: 1rem;
  gap: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  display: flex;
`;

export const EditorKeys = styled.div`
  height: 1.25rem;
  padding: 0.25rem;
  gap: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EditorKey = styled.span`
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
