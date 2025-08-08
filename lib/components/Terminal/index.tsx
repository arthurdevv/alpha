import { Fragment, h, JSX } from 'preact';
import { memo } from 'preact/compat';

import useStore from 'lib/store';

import { Group } from './styles';
import Term from './term';
import SplitTerm from './split';
import Viewport from './Viewport';
import Settings from '../Settings';

const Terms: React.FC = () => {
  const store = useStore();

  const {
    context,
    current: { origin, terms },
  } = store;

  return (
    <Fragment>
      {Object.entries(context).map(([id, group]) => {
        const props: TermGroupProps = {
          ...store,
          group,
          current: terms[id],
        };

        return id === 'Settings' ? (
          <Settings origin={origin} />
        ) : (
          <Group role="group" key={id} $isCurrent={id === origin}>
            <TermGroup {...props} />
          </Group>
        );
      })}
      <Viewport {...store} />
    </Fragment>
  );
};

const TermGroup: React.FC<TermGroupProps> = (props: TermGroupProps) => {
  const { group, instances, current } = props;

  const createTerm = (id: string) => {
    const instance = instances[id];

    const termProps: TermProps = {
      ...props,
      ...instance,
      isCurrent: current.includes(id),
      onFocus: props.onFocus.bind(null, id),
      onResize: props.onResize.bind(null, id),
      onTitleChange: props.onTitleChange.bind(null, id),
    };

    return <Term {...termProps} key={id} />;
  };

  const createSplit = (children: JSX.Element[]) => {
    const splitProps: SplitTermProps = {
      ...group,
      children,
      onResizeGroup: props.onResizeGroup.bind(null, group.id),
    };

    return <SplitTerm {...splitProps} />;
  };

  const children = group.children.map(group => (
    <TermGroup {...props} group={group} key={group.id} />
  ));

  return group.pid ? createTerm(group.pid) : createSplit(children);
};

export default memo(Terms);
