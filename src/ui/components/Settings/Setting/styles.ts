import { styled } from '@linaria/react';

import { Keys } from 'components/Tooltip/styles';

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.75rem;
`;

export const Name = styled.div`
  display: inline-flex;
  flex: 1 0 1%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Description = styled.span`
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  color: var(--muted);

  @media screen and (max-width: 37.5rem) {
    display: none;
  }
`;

export const Badges = styled(Keys)`
  margin-left: 0.375rem;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s ease 0s;
  transition-property: opacity, scale;
  transform: scale(0.99);

  &.visible {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Entry = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover svg {
    color: var(--foreground);
  }
`;

export const Progress = styled.div`
  position: absolute;
  bottom: 2.5rem;
  pointer-events: none;
  transition:
    opacity 0.2s ease 0s,
    left 0.1s linear 0s;

  & [role='tooltip'] :last-of-type {
    min-height: unset;

    & span {
      font-size: 0.75rem;
    }
  }
`;

export const Ranges = styled.div`
  position: absolute;
  top: 0.625rem;
  display: flex;
  justify-content: space-between;
  width: 100%;

  & > span {
    font-size: 0.75rem;
    color: var(--muted);
    transition: color 0.2s ease 0s;
  }
`;

export const Input = styled.input`
  font-size: 0.875rem;
  text-align: end;
  text-overflow: ellipsis;
  color: var(--muted);
  transition: color 0.2s ease 0s;
  user-select: text;

  &[type='number'] {
    padding-right: 0.875rem;
    cursor: default;
  }

  &[type='range'] {
    --progress: 0%;
    --bg: var(--muted);

    width: 6.875rem;
    height: 0.375rem;
    cursor: grab;
    border-radius: 4px;
    background: linear-gradient(
      to right,
      var(--bg) 0%,
      var(--bg) var(--progress),
      var(--border) var(--progress),
      var(--border) 100%
    );
    transition: background 0.2s ease 0s;

    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 0.3125rem;
      height: 100%;
    }

    &:active::-webkit-slider-thumb {
      cursor: grabbing;
    }

    &:hover {
      --bg: var(--foreground);

      & ~ ${Progress} div {
        opacity: 1;
      }

      & ~ ${Ranges} span {
        color: var(--foreground);
      }
    }
  }

  &:hover,
  &:focus {
    color: var(--foreground);
  }
`;

export const Slider = styled.div`
  width: 1.125rem;
  height: 0.875rem;
  background: var(--muted);
  transition:
    background 0.1s ease 0.1s,
    transform 0.2s ease 0s;
  transform: translateX(0.125rem);
  will-change: transform;
  border-radius: 100px;
`;

export const Switch = styled.div`
  position: relative;
  width: 2.125rem;
  height: 1.125rem;
  padding-block: 0.125rem;
  cursor: pointer;
  background: var(--border);
  transition: background 0.1s ease 0.1s;
  border-radius: 100px;

  &.checked {
    background: var(--foreground);

    ${Slider} {
      background: var(--background);
      transform: translateX(0.875rem);
    }
  }
`;

export const Selector = styled.select`
  z-index: 100;
  padding-right: 1rem;
  text-align: end;
  text-overflow: ellipsis;
  color: var(--muted);
  transition: color 0.2s ease 0s;

  &:hover,
  &:focus {
    color: var(--foreground);
  }

  option {
    background: var(--background);
  }
`;

export const Segmented = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 1.5rem;
  margin-left: auto;
  border: 1px solid var(--border);
  border-radius: 4px;

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
    text-transform: uppercase;
    color: var(--muted);
    border-right: 1px solid var(--border);
    transition: color 0.2s ease 0s;

    &:last-of-type {
      border-right: none;
    }

    &:hover,
    &.selected {
      color: var(--foreground);
    }
  }
`;

export const Spinner = styled.div`
  position: absolute;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;

  & svg {
    color: var(--muted);
    transition: color 0.2s ease 0s;
  }

  &:hover ~ ${Input} {
    color: var(--foreground);
  }
`;

// export const Form = styled.div`
//   position: relative;
//   height: 1.5rem;
//   margin-left: auto;
//   display: inline-flex;
//   align-items: center;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   border: 1px solid ${props => props.theme.border};
//   border-radius: 4px;
// `;

// export const FormItem = styled.div`
//   position: relative;
//   height: 100%;
//   padding: 0 0.5rem;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
//   font-size: 0.6875rem;
//   text-transform: uppercase;
//   color: ${props => props.theme.disabled};
//   transition: 0.2s ease 0s;
//   transition-property: color, width;

//   &:first-of-type {
//     padding: 0;
//     border-right: 1px solid ${props => props.theme.border};

//     & input {
//       height: 100%;
//       width: 100%;
//       padding: 0 0.5rem 0 1.625rem;
//       font: inherit;
//       text-transform: inherit;

//       & ~ svg {
//         position: absolute;
//         cursor: text;
//         width: 0.75rem;
//         height: 0.75rem;
//         left: 0.5rem;
//         color: ${props => props.theme.disabled};
//         transition: color 0.2s ease 0s;
//       }

//       &:focus ~ svg {
//         color: ${props => props.theme.foreground};
//       }
//     }
//   }

//   &:hover {
//     color: ${props => props.theme.foreground};
//   }
// `;

// export const Placeholder = styled.div`
//   margin-bottom: 0.625rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   overflow: hidden;
//   white-space: normal;
//   text-align: center;
//   text-overflow: ellipsis;
//   font-size: 0.875rem;
//   line-height: 1.25rem;
//   color: ${props => props.theme.disabled};
//   animation: ${keyframes`
//       0% {
//         opacity: 0;
//       }

//       100% {
//         opacity: 1;
//       }
//     `} 0.4s ease 0s forwards;

//   & svg {
//     width: 1.625rem;
//     height: 1.625rem;
//     margin-bottom: 0.375rem;
//   }

//   & span:first-of-type {
//     font-weight: 600;
//   }

//   & span:last-of-type {
//     margin-top: 0.125rem;
//     font-weight: 400;
//   }
// `;
