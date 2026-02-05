import { Fragment } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import storage from 'app/utils/local-storage';
import { useKeyboardIndex } from 'lib/utils/hooks';

import styles from '../styles.module.css';
import {
  Actions,
  ActionBtn,
  Button,
  Command,
  Form,
  FormActions,
  Input,
  Item,
  List,
  Name,
  SnippetInfo,
  Warning,
  Wrapper,
} from './styles';

interface ISnippet {
  id: string;
  name: string;
  command: string;
  createdAt: string;
}

const Snippets: React.FC<ModalProps> = ({ store, isVisible, handleModal }) => {
  const [snippets, setSnippets] = useState<ISnippet[]>(() => {
    const stored = storage.parseItem('snippets');
    return Array.isArray(stored) ? stored : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCommand, setNewCommand] = useState('');

  const [selectedIndex, setSelectedIndex] = useKeyboardIndex(snippets.length);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const { t } = useTranslation();

  const handleAdd = () => {
    if (!newName.trim() || !newCommand.trim()) return;

    const snippet: ISnippet = {
      id: Date.now().toString(),
      name: newName.trim(),
      command: newCommand.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [snippet, ...snippets];
    setSnippets(updated);
    storage.updateItem('snippets', updated);

    setNewName('');
    setNewCommand('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    storage.updateItem('snippets', updated);
  };

  const handleRun = (command: string) => {
    store.onData(command);
    handleModal();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewName('');
    setNewCommand('');
  };

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedIndex !== -1 && !isAdding) {
        handleRun(snippets[selectedIndex].command);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, snippets, isAdding]);

  useEffect(() => {
    const element = listRef.current?.children[selectedIndex] as HTMLElement;
    if (element) {
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.containerVisible : styles.containerHidden}`}
      style={{ maxWidth: '22rem' }}
    >
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>
          {t('Snippets')}
        </div>
        {!isAdding && (
          <div className={styles.tag} onClick={() => setIsAdding(true)}>
            + {t('Add')}
          </div>
        )}
      </div>
      <div className={styles.content}>
        <Wrapper>
          {isAdding && (
            <Form>
              <Input
                ref={inputRef}
                placeholder={t('Snippet name')}
                value={newName}
                onChange={e => setNewName((e.target as HTMLInputElement).value)}
                onKeyDown={e => e.key === 'Escape' && handleCancel()}
              />
              <Input
                placeholder={t('Command')}
                value={newCommand}
                onChange={e => setNewCommand((e.target as HTMLInputElement).value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <FormActions>
                <Button onClick={handleCancel}>{t('Cancel')}</Button>
                <Button
                  $primary
                  disabled={!newName.trim() || !newCommand.trim()}
                  onClick={handleAdd}
                >
                  {t('Save')}
                </Button>
              </FormActions>
            </Form>
          )}

          {snippets.length > 0 ? (
            <List ref={listRef}>
              {snippets.map((snippet, index) => (
                <Item
                  key={snippet.id}
                  $selected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleRun(snippet.command)}
                >
                  <SnippetInfo>
                    <Name>{snippet.name}</Name>
                    <Command>{snippet.command}</Command>
                  </SnippetInfo>
                  <Actions>
                    <ActionBtn
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(snippet.id);
                      }}
                    >
                      {t('Delete')}
                    </ActionBtn>
                  </Actions>
                </Item>
              ))}
            </List>
          ) : (
            !isAdding && <Warning>{t('No snippets yet')}</Warning>
          )}
        </Wrapper>
      </div>
    </div>
  );
};

export default memo(Snippets);
