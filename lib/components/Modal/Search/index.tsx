import { h } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';

import { clearResult, findResult, onChangeResults } from 'app/common/addons';
import storage from 'app/utils/local-storage';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaseSensitivyIcon,
  CloseMenuIcon,
  RegexIcon,
  WholeWordIcon,
} from 'lib/components/Icons';
import {
  Arrow,
  Container,
  Content,
  Control,
  Controls,
  Count,
  Label,
} from './styles';
import { SearchInput } from '../styles';

const schema = {
  caseSensitive: {
    label: 'Case Sensitive',
    icon: <CaseSensitivyIcon />,
  },
  wholeWord: {
    label: 'Whole Word',
    icon: <WholeWordIcon />,
  },
  regex: {
    label: 'Regular Expression',
    icon: <RegexIcon />,
  },
};

const Search: React.FC<SearchProps> = (props: SearchProps) => {
  const [result, setResult] = useState<string>('');

  const [count, setCount] = useState<number[]>([0, 0]);

  const input = useRef<HTMLInputElement | null>(null);

  const handleSearch = ({ currentTarget }) => {
    const { value } = currentTarget;

    setResult(value);

    findResult(global.id!, value, 'findNext');
  };

  const handleControl = ({ currentTarget }) => {
    const { classList, ariaLabel: key } = currentTarget;

    classList.toggle('actived');

    const controls = storage.parseItem('controls');

    storage.updateItem('controls', { [key]: !controls[key] }, true);
  };

  const handleFocus = ({ currentTarget }, focused: boolean) => {
    if (!props.isVisible) return;

    const { classList } = currentTarget;

    classList[focused ? 'add' : 'remove']('focused');

    const input = currentTarget.getElementsByTagName('input')[0];

    input.focus();
  };

  useEffect(() => {
    const { dispose } = onChangeResults(global.id!, setCount);

    storage.createItem('controls');

    const { current } = input;

    if (current) {
      setTimeout(() => current.focus(), 100);
    }

    return () => {
      clearResult(global.id!);

      dispose();
    };
  }, [props.isVisible]);

  return (
    <Container
      className="focused"
      $isVisible={props.isVisible}
      onClick={(event: MouseEvent) => handleFocus(event, true)}
      onMouseEnter={(event: MouseEvent) => handleFocus(event, true)}
      onMouseLeave={(event: MouseEvent) => handleFocus(event, false)}
    >
      <Content>
        <SearchInput placeholder="Search" onChange={handleSearch} ref={input} />
        <Controls>
          <Count>{count.join('/')}</Count>
          <Control
            aria-label="up"
            onClick={() => findResult(global.id!, result, 'findPrevious')}
          >
            <ArrowUpIcon />
            <Label>
              <Arrow />
              <span>Previous Match</span>
            </Label>
          </Control>
          <Control
            aria-label="down"
            onClick={() => findResult(global.id!, result, 'findNext')}
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
                className={controls[control] ? 'actived' : undefined}
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
          <Control onClick={props.handleModal}>
            <CloseMenuIcon />
          </Control>
        </Controls>
      </Content>
    </Container>
  );
};

export default memo(Search);
