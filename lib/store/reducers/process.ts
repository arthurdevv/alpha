import Immutable from 'seamless-immutable';
import {
  PROCESS_ADD,
  PROCESS_SET_TITLE,
  PROCESS_SET_CURRENT,
  PROCESS_SET_DATA,
  PROCESS_CLEAR_DATA,
  PROCESS_DELETE,
  PROCESS_KILL,
} from '../types/process';

const defaultState: ProcessState = Immutable<Mutable<ProcessState>>({
  context: {},
  current: undefined,
});

export default (state = defaultState, action: AlphaActions) => {
  switch (action.type) {
    case PROCESS_ADD:
      return state.set('current', action.id).setIn(
        ['context', action.id],
        Immutable({
          id: action.id,
          shell: action.shell ? action.shell.split('/').pop() : null,
        }),
      );

    case PROCESS_SET_TITLE:
      return state.setIn(['context', action.id, 'title'], action.title.trim());

    case PROCESS_SET_CURRENT:
      return state.set('current', action.id);

    case PROCESS_SET_DATA:
      return state.merge(
        {
          context: {
            [action.id]: {
              isDirty: true,
            },
          },
        },
        {
          deep: true,
        },
      );

    case PROCESS_CLEAR_DATA:
      if (state.current) {
        return state.merge(
          {
            context: {
              [state.current]: {
                isDirty: false,
              },
            },
          },
          {
            deep: true,
          },
        );
      }

      return state;

    case PROCESS_DELETE:
    case PROCESS_KILL:
      return state.updateIn(['context'], context => {
        const process = context.asMutable();

        delete process[action.id];

        return process;
      });
  }

  return state;
};
