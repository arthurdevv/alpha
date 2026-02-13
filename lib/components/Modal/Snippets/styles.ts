import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
`;

export const Actions = styled.div`
  margin-left: auto;
  gap: 0.375rem;
  opacity: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease 0s;
`;

export const ActionBtn = styled.span`
  cursor: pointer;
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  color: ${props => props.theme.disabled};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: all 0.2s ease 0s;

  &:hover {
    color: ${props => props.theme.foreground};
    border-color: ${props => props.theme.icon};
  }
`;

export const SnippetInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Name = styled.div`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${props => props.theme.foreground};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Command = styled.div`
  font-size: 0.6875rem;
  color: ${props => props.theme.disabled};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.icon};
  background: ${props => props.theme.divider};
  border-radius: 6px;
  transition: all 0.2s ease 0s;
`;

const selectedCss = css`
  background: ${props => props.theme.divider};

  ${Actions} {
    opacity: 1;
  }

  ${Icon} {
    color: ${props => props.theme.background};
    background: ${props => props.theme.foreground};
  }
`;

export const Warning = styled.span`
  padding: 1rem 0;
  font-size: 0.8125rem;
  text-align: center;
  color: ${props => props.theme.disabled};
`;

export const List = styled.ul`
  max-height: 14rem;
  gap: 0.25rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  list-style-type: none;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.scrollbar};
    border-radius: 4px;
  }
`;

export const Item = styled.li<{ $selected: boolean }>`
  padding: 0.625rem 0.75rem;
  gap: 0.75rem;
  display: flex;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease 0s;

  ${({ $selected }) => $selected && selectedCss}
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 0.875rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

export const Input = styled.input`
  width: 100%;
  height: 2.25rem;
  padding: 0 0.75rem;
  font: inherit;
  font-size: 0.8125rem;
  color: ${props => props.theme.foreground};
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s ease 0s;

  &:focus {
    border-color: ${props => props.theme.icon};
  }

  &::placeholder {
    color: ${props => props.theme.disabled};
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.25rem;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  height: 2rem;
  padding: 0 1rem;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  color: ${props => (props.$primary ? props.theme.background : props.theme.foreground)};
  background: ${props => (props.$primary ? props.theme.foreground : 'transparent')};
  border: 1px solid ${props => (props.$primary ? 'transparent' : props.theme.border)};
  border-radius: 6px;
  transition: all 0.2s ease 0s;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
