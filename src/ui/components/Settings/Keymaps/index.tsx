import { cx } from '@linaria/core';
import { useTranslation } from 'react-i18next';

import { useSearch } from 'ui/hooks/useSearch';
import { useAppStore } from 'ui/store/app/store';

import { KeyboardOffIcon, SearchIcon } from 'components/Icons';
import { Form, FormItem, NoResults, Title } from 'components/Settings/styles';

import schema from './schema';
import { AddKeys, Content, Item, Key, Keys, Label, Wrapper } from './styles';

export default function Keymaps() {
  const keymaps = useAppStore(s => s.keymaps);

  const { query, setQuery, filtered, isEmpty } = useSearch(schema);
  const { t } = useTranslation();

  return (
    <>
      <Title>
        {t('Keymaps')}
        <Form>
          <FormItem>
            <input
              placeholder={t('Search')}
              value={query}
              onInput={e => setQuery(e.currentTarget.value)}
            />
            <SearchIcon />
          </FormItem>
          <FormItem>
            <button type="button">{t('Record keys')}</button>
          </FormItem>
        </Form>
      </Title>
      <Content className={cx(isEmpty && 'empty')}>
        {isEmpty ? (
          <NoResults>
            <KeyboardOffIcon />
            <span>{t('No commands found')}</span>
            <span>{t('Try a different search')}</span>
          </NoResults>
        ) : (
          filtered.map(([key, label]) => {
            const keys = keymaps[key];

            return (
              <Item key={key}>
                <Label>{t(label)}</Label>
                <Wrapper>
                  <AddKeys>{t('Add keys...')}</AddKeys>
                  {keys?.map(keys => (
                    <Keys key={keys}>
                      {keys.split('+').map((key, index) => (
                        <Key key={index}>{key}</Key>
                      ))}
                    </Keys>
                  ))}
                </Wrapper>
              </Item>
            );
          })
        )}
      </Content>
    </>
  );
}
