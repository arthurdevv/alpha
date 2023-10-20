import { h } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';

import { findResult, clearResult } from 'app/common/addons';

import { Container, Content, Controls, ControlsItem } from './styles';
import { Tag, SearchInput } from '../styles';
import ControlsLabel from './label';
import {
  SearchIcon,
  ArrowUp,
  ArrowDown,
  CaseSensitivy,
  RegexIcon,
  WholeWord,
  CloseMenuIcon,
} from 'lib/components/Icon';

const Search: React.FC<SearchProps> = ({ isVisible, onClose }) => {
  const [isFocused, setFocused] = useState<boolean>(true);

  const [controls, setControls] = useState<ISearchControls>({});

  const [search, setSearch] = useState<string>('');

  const parent = useRef<HTMLDivElement>();

  const input = useRef<HTMLDivElement>();

  const handleSearch = ({ currentTarget }) => {
    const { value } = currentTarget;

    findResult('next', value, controls);

    setSearch(value);
  };

  const handleControl = ({ currentTarget }) => {
    const { classList, ariaLabel } = currentTarget;

    if (ariaLabel !== 'up') {
      classList.toggle('actived');
    }

    setControls({ ...controls, [ariaLabel]: !controls[ariaLabel] });
  };

  const handleFocused = (flag: boolean) => {
    const { current } = input;

    if (current) {
      current.focus();
    }

    setFocused(flag);
  };

  useEffect(() => {
    handleFocused(false);

    return () => {
      clearResult();
    };
  }, [isVisible]);

  return (
    <Container
      $isVisible={isVisible}
      $isFocused={isFocused}
      onClick={() => handleFocused(true)}
      onMouseEnter={() => handleFocused(true)}
      onMouseLeave={() => handleFocused(false)}
      ref={parent}
    >
      <Tag>
        <SearchIcon />
        Search
      </Tag>
      <Content>
        <SearchInput onChange={handleSearch} ref={input} />
        <Controls>
          <ControlsItem
            aria-label="up"
            onClick={() => findResult('previous', search, controls)}
          >
            <ArrowUp />
            <ControlsLabel text="Previous Match" />
          </ControlsItem>
          <ControlsItem
            aria-label="down"
            onClick={() => findResult('next', search, controls)}
          >
            <ArrowDown />
            <ControlsLabel text="Next Match" />
          </ControlsItem>
          <ControlsItem aria-label="caseSensitive" onClick={handleControl}>
            <CaseSensitivy />
            <ControlsLabel text="Case Sensitivy" />
          </ControlsItem>
          <ControlsItem aria-label="regex" onClick={handleControl}>
            <RegexIcon />
            <ControlsLabel text="Regular Expression" />
          </ControlsItem>
          <ControlsItem aria-label="wholeWord" onClick={handleControl}>
            <WholeWord />
            <ControlsLabel text="Whole Word" />
          </ControlsItem>
          <ControlsItem onClick={onClose}>
            <CloseMenuIcon />
          </ControlsItem>
        </Controls>
      </Content>
    </Container>
  );
};

export default memo(Search);
