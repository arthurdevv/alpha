import { styled } from '@linaria/react';

import { Pane } from './Split/styles';

export const Group = styled.div`
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;

  &.c {
    display: block;
  }

  &:has(${Pane}.e) {
    ${Pane}.e {
      pointer-events: all;
      opacity: 1 !important;
      animation: none !important;
    }

    ${Pane}:not(.e) {
      pointer-events: none;
      opacity: 0 !important;
      animation: none !important;
    }
  }
`;
