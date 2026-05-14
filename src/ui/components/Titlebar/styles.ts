import { styled } from '@linaria/react';

// import { List as Tabs } from 'components/Titlebar/Tabs/styles';
import {
  Arrow as TooltipArrow,
  Container as TooltipContainer,
  Content as TooltipContent,
} from 'components/Tooltip/styles';

export const DragRegion = styled.div`
  -webkit-app-region: drag;
  flex: 1 0 1%;
  min-width: 3.125rem;
  height: 100%;
  background: var(--titlebar, transparent);
`;

export const Action = styled.button`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 2.375rem;
  padding: 0 0.75rem;
  cursor: pointer;

  & svg {
    color: var(--muted);
    transition: color 0.2s ease 0s;
  }

  &:hover svg {
    color: var(--foreground);
  }
`;

export const Actions = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  background: var(--titlebar, transparent);

  &:first-of-type ${TooltipContent} {
    left: 0.5rem;

    ${TooltipArrow} {
      left: 0.375rem;
    }
  }

  &:last-of-type ${TooltipContainer}:last-of-type ${TooltipContent} {
    right: 0.5rem;

    ${TooltipArrow} {
      right: 0.375rem;
    }
  }
`;

export const Container = styled.header`
  z-index: 100;
  display: flex;
  width: 100%;
  height: 2.375rem;
  /* opacity: 0; */
  /* pointer-events: none; */
  /* animation: fade-in 1s ease 3.5s forwards; */

  ${TooltipContent} {
    top: 2.75rem;
  }

  @media (max-width: 34.375rem) {
    ${Actions}:first-of-type {
      display: none;
    }

    ${Actions}:last-of-type ${TooltipContainer}:first-of-type {
      display: none;
    }
  }
`;

//   &:has(${Tabs} > *) ${Actions}:first-of-type ${TooltipContent} {
//   left: auto !important;

//   & ${TooltipArrow} {
//     left: unset !important;
//   }
// }

// export const ZenModeGlobalStyles = createGlobalStyle`
//   html {
//     &[zen-mode='true'] {
//       ${Actions} {
//         display: none;
//       }
//     }

//     &[zen-mode-show-tabs='single'] {
//       ${List} {
//         position: fixed;
//         height: 2.375rem;
//         width: 100%;
//         justify-content: center;
//         transition: width .2s ease 0s;
//       }

//       ${DragRegion} {
//         position: fixed;
//         width: 100%;
//         height: 2.375rem;
//         z-index: 999;
//       }

//       ${Tab}:not(.current) {
//         width: 0;
//         opacity: 0;
//         pointer-events: none;
//         transform: scaleX(0.98);
//         transition: opacity .2s ease 0s, transform .2s ease 0s;
//       }
//     }

//     &[zen-mode-show-tabs='hidden'] {
//       ${Header} {
//         position: fixed;
//         opacity: 0 !important;
//         pointer-events: none;
//         transition: opacity .2s ease 0s;
//       }

//       ${TermContent} {
//         margin: 1rem 0.75rem 0.75rem 1rem;
//       }
//     }

//     &[zen-mode-hide-indicators='true'] {
//       ${Indicators} {
//         opacity: 0;
//         transform: translateY(-2px);
//         pointer-events: none;
//         transition: opacity .2s ease 0s;
//       }
//     }
//   }
// `
