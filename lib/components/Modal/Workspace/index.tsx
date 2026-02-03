import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { setSettings } from 'app/settings';

import {
  Description,
  Entry,
  Label,
  Option,
  Content as OptionContent,
  Selector,
  Separator,
  Spinner,
  Switch,
  SwitchSlider,
} from 'components/Settings/styles';
import { SpinnerDownIcon } from 'components/Icons';
import {
  Container,
  Content,
  Search,
  SearchInput,
  Tag,
  Tags,
  Wrapper,
} from '../styles';
import schema from './schema';

const Workspace: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    workspace: { id, name, tabs },
    options: { workspaces = [{ id, name, tabs }] },
  } = props.store;

  const [tab, setTab] = useState<IWorkspaceTab>(tabs[tabIndex]);

  const handleOption = (key: string, type: string, { currentTarget }) => {
    let { value, classList } = currentTarget;

    if (type === 'checkbox') {
      value = classList.toggle('checked');
    } else if (!value) return;

    setTab(tab => {
      tab[key] = value;

      return tab;
    });
  };

  const handleSave = (del: boolean) => {
    const _workspaces = [...workspaces];

    const index = _workspaces.findIndex(w => w.id === id);

    if (index !== -1) {
      if (del) {
        global.dialog = {
          source: 'Workspaces',
          target: tabs[tabIndex].title,
          from: name,
          data: [index],
        };

        return props.handleModal(undefined, 'Dialog');
      }

      _workspaces[index].tabs[tabIndex] = tab;

      setSettings('workspaces', _workspaces);
    }

    props.handleModal();
  };

  const { t } = useTranslation();

  return (
    <Container $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>{`${t('Workspaces')}: ${name}`}</Tag>
        <Tag onClick={props.handleModal}>{t('Cancel')}</Tag>
        <Tag onClick={() => handleSave(false)}>{t('Save')}</Tag>
        <Tag onClick={() => handleSave(true)}>{t('Delete')}</Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput
            value={tab.title}
            placeholder={tab.title}
            onChange={event => handleOption('title', 'text', event)}
          />
        </Search>
        <Wrapper
          style={{
            paddingInline: '1rem',
            paddingBottom: '1rem',
            alignItems: 'unset',
            justifyContent: 'center',
          }}
        >
          {Object.entries(schema).map(([key, option], index) => {
            const { name, label, input, options } = option;

            const onChange = handleOption.bind(null, key, input);

            return (
              <Option key={index}>
                <Separator
                  style={{ margin: index === 0 ? '0.125rem 0' : '0.75rem 0' }}
                />
                <OptionContent>
                  <Label>{t(name)}</Label>
                  {input === 'checkbox' ? (
                    <Switch
                      className={tab[key] ? 'checked' : undefined}
                      onClick={onChange}
                    >
                      <SwitchSlider />
                    </Switch>
                  ) : (
                    <Entry $flex>
                      <Selector onChange={onChange}>
                        {options.map((option, index) => (
                          <option
                            key={index}
                            value={option.id}
                            selected={option.id === tab.profile}
                          >
                            {option.name}
                          </option>
                        ))}
                      </Selector>
                      <Spinner $input={input}>
                        <SpinnerDownIcon />
                      </Spinner>
                    </Entry>
                  )}
                </OptionContent>
                <Description>{t(label)}</Description>
              </Option>
            );
          })}
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Workspace);
