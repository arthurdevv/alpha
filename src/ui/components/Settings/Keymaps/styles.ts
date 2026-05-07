import { styled } from '@linaria/react';

import { Action } from 'components/Settings/styles';

export const Content = styled.ul`
  flex: 1 0 1%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &.empty {
    align-items: center;
    justify-content: center;
  }
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.75rem;
  animation: fade-in 0.2s ease 0s;

  &:hover ${Action} {
    opacity: 1;
  }
`;

export const Label = styled.span`
  margin-right: auto;
  font-size: 0.875rem;
`;

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  height: 100%;
  gap: 0.375rem;
`;

export const Key = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.2s ease 0s;
`;

export const Keys = styled.div`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  height: 100%;
  gap: 0.25rem;
  cursor: pointer;
  border: 1px solid var(--border);
  border-radius: 4px;

  &:hover ${Key} {
    color: var(--foreground);
  }
`;

export const AddKeys = styled(Action)`
  margin-right: 0.25rem;
  opacity: 0;
  color: var(--muted);

  &:hover {
    color: var(--foreground);
  }
`;

//
//
//
//
//
//
//
//
//
//
//
//
//

// export const Editor = styled.div<{ $isVisible: boolean }>`
//   position: absolute;
//   transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
//   transition-property: transform, opacity;

//   ${({ $isVisible }) =>
//     $isVisible
//       ? css`
//           opacity: 1;
//           transform: scale(1);
//         `
//       : css`
//           opacity: 0;
//           transform: scale(0.98);
//         `}
// `;

// export const EditorTags = styled.div`
//   display: flex;
//   gap: 0.375rem;

//   & > :first-child {
//     margin-left: auto;
//   }
// `;

// export const EditorTag = styled.div<{ $isText?: boolean }>`
//   max-width: 100%;
//   height: 1.5rem;
//   margin-bottom: 0.5rem;
//   padding: 0.25rem 0.5rem;
//   cursor: pointer;
//   display: inline-flex;
//   align-items: center;
//   font-size: 0.6875rem;
//   text-transform: uppercase;
//   color: ${props => props.theme.disabled};
//   background: ${props => props.theme.modal};
//   border-radius: 4px;
//   border: 1px solid ${props => props.theme.border};
//   transition: color 0.2s ease 0s;
//   backdrop-filter: ${props => props.theme.modalBackdrop};

//   &:hover {
//     color: ${props => props.theme.foreground};
//   }

//   ${({ $isText }) =>
//     $isText &&
//     css`
//       margin-right: auto;
//       margin-left: unset !important;
//       white-space: pre;
//       cursor: default;
//       pointer-events: none;
//       text-transform: none;
//       color: ${props => props.theme.foreground};
//     `}
// `;

// export const EditorContent = styled.div`
//   padding: 1rem 2rem;
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
//   background: ${props => props.theme.modal};
//   border: 1px solid ${props => props.theme.border};
//   border-radius: 4px;
//   box-shadow: ${props => props.theme.boxShadow} 0px 2px 7px;
//   backdrop-filter: ${props => props.theme.modalBackdrop};
// `;

// export const EditorTitle = styled.div`
//   margin-bottom: 1rem;
//   gap: 0.375rem;
//   font-size: 0.8125rem;
//   line-height: 1.4;
//   display: flex;
//   justify-content: center;
// `;

// export const EditorKeys = styled.div`
//   height: 1.25rem;
//   padding: 0.25rem;
//   gap: 0.25rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   & > div {
//     font-size: 0.8125rem;
//     color: ${props => props.theme.disabled};
//   }
// `;

// export const EditorKey = styled.span`
//   height: 1.25rem;
//   min-width: 1.25rem;
//   padding: 0 0.25rem;
//   font-size: 0.688rem;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   text-transform: uppercase;
//   color: ${props => props.theme.popoverForeground};
//   border: 1px solid ${props => props.theme.border};
//   border-radius: 3px;
// `;
