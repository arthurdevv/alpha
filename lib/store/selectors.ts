import { createSelector } from '@reduxjs/toolkit';

const getProcessContext = ({ process }: AlphaState) => process.context;

const getTerminalContext = ({ terminal }: AlphaState) => terminal.context;

const getTerminalProcess = ({ terminal }: AlphaState) => terminal.process;

const getCurrentTerminalId = ({ terminal }: AlphaState) => terminal.current;

const getRecentProfiles = ({ profiles }: AlphaState) => profiles.recent;

export const getIdContext = (state: AlphaState) => {
  const context = getTerms(state).map(({ id }) => id);

  const currentId = state.terminal.current!;

  const currentIndex = context.indexOf(currentId);

  return { context, currentId, currentIndex };
};

export const getTerminalById = (id: string, state: TerminalState) => {
  const { context } = state;

  return Object.keys(context)
    .map(id => context[id])
    .find(target => target.pid === id);
};

export const getTerms = createSelector(getTerminalContext, context =>
  Object.keys(context).map(id => context[id]),
);

export const getTabs = createSelector(
  [getProcessContext, getTerms, getTerminalProcess, getCurrentTerminalId],
  (context, terms, process, currentId) =>
    terms.map((term: ITerminal) => {
      const { id } = term;

      const { title } = context[process[id]];

      return {
        id,
        title,
        isCurrent: id === currentId,
      };
    }),
);

export const getRecent = createSelector(getRecentProfiles, recent =>
  Object.keys(recent).map(profile => recent[profile]),
);
