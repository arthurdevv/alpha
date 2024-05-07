import { h } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';

import { findResult, clearResult, onChangeResult } from 'app/common/addons';
import storage from 'app/utils/local-storage';

import { SearchInput } from '../styles';
import {
  Container,
  Content,
  Count,
  Controls,
  Control,
  Label,
  Arrow,
} from './styles';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CaseSensitivyIcon,
  RegexIcon,
  WholeWordIcon,
  CloseMenuIcon,
} from 'lib/components/Icons';

const Search: React.FC<SearchProps> = ({ isVisible, onClose }) => {
  const [result, setResult] = useState<any>();

  const [count, setCount] = useState<number[]>([0, 0]);

  const input = useRef<HTMLInputElement>();

  const handleSearch = ({ currentTarget }) => {
    const { value } = currentTarget;

    setResult(value);

    findResult('findNext', value);
  };

  const handleControl = ({ currentTarget }) => {
    const { classList, ariaLabel: key } = currentTarget;

    classList.toggle('actived');

    const controls = storage.parseItem('controls');

    storage.updateItem('controls', { [key]: !controls[key] }, true);
  };

  const handleFocus = ({ currentTarget }, focused: boolean) => {
    const { classList } = currentTarget;

    classList[focused ? 'add' : 'remove']('focused');

    const input = currentTarget.getElementsByTagName('input')[0];

    input.focus();
  };

  useEffect(() => {
    const { dispose } = onChangeResult(setCount);

    storage.createItem('controls');

    const { current } = input;

    if (current) {
      current.focus();
    }

    return () => {
      clearResult();

      dispose();
    };
  }, [isVisible]);

  const schema = {
    caseSensitive: {
      label: 'Case Sensitive',
      icon: <CaseSensitivyIcon />,
    },
    regex: {
      label: 'Regular Expression',
      icon: <RegexIcon />,
    },
    wholeWord: {
      label: 'Whole Word',
      icon: <WholeWordIcon />,
    },
  };

  return (
    <Container
      className="focused"
      $isVisible={isVisible}
      onClick={(event: any) => handleFocus(event, true)}
      onMouseEnter={(event: any) => handleFocus(event, true)}
      onMouseLeave={(event: any) => handleFocus(event, false)}
    >
      <Content>
        <SearchInput placeholder="Search" onChange={handleSearch} ref={input} />
        <Controls>
          <Count>{count.join('/')}</Count>
          <Control
            aria-label="up"
            onClick={() => findResult('findPrevious', result)}
          >
            <ArrowUpIcon />
            <Label>
              <Arrow />
              <span>Previous Match</span>
            </Label>
          </Control>
          <Control
            aria-label="down"
            onClick={() => findResult('findNext', result)}
          >
            <ArrowDownIcon />
            <Label>
              <Arrow />
              <span>Next Match</span>
            </Label>
          </Control>
          {Object.keys(schema).map((control, index) => {
            const { label, icon } = schema[control];

            const controls = storage.parseItem('controls');

            return (
              <Control
                key={index}
                aria-label={control}
                className={controls[control] && 'actived'}
                onClick={handleControl}
              >
                {icon}
                <Label>
                  <Arrow />
                  <span>{label}</span>
                </Label>
              </Control>
            );
          })}
          <Control onClick={onClose}>
            <CloseMenuIcon />
          </Control>
        </Controls>
      </Content>
    </Container>
  );
};

export default memo(Search);
