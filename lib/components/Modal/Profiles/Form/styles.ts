import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
`;

export const EnvList = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 16.75rem;
  margin-top: 1rem;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const EnvForm = styled.div`
  margin-top: 1rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const EnvInput = styled.input`
  height: 1.75rem;
  padding: 0 0.5rem;
  flex: 1 1 0%;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.disabled};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const EnvAdd = styled.div`
  height: 1.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.disabled};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:hover {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const EnvItem = styled.div`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover span {
    opacity: 1;
  }
`;

export const EnvInfo = styled.div`
  display: flex;
  flex-direction: column;
  user-select: text;
`;

export const EnvName = styled.span`
  height: 1.75rem;
  margin-right: auto;
  font-size: 0.8125rem;
  line-height: 1.625rem;
  color: ${({ theme }) => theme.foreground};
`;

export const EnvValue = styled.span`
  padding: 0.1875rem 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.popoverForeground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
`;

export const EnvAction = styled.span`
  font-size: 0.8125rem;
  cursor: pointer;
  opacity: 0;
  color: ${({ theme }) => theme.disabled};
  transition: 0.2s ease 0s;
  transition-property: color, opacity;

  &:hover {
    color: ${({ theme }) => theme.foreground};
  }
`;

export const EnvWarning = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.disabled};
  justify-content: center;
  transform: translate(-50%, -50%);
`;

export {
  Container,
  Content,
  Tags,
  Tag,
  Search,
  SearchInput,
} from '../../styles';

export {
  Option,
  Content as OptionContent,
  Label,
  Input,
  Separator,
  Switch,
  SwitchSlider,
} from 'lib/components/Terminal/Settings/styles';
