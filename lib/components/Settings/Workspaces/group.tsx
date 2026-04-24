import { memo, useEffect, useMemo, useRef } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';

import { getPreviewPrompt } from 'app/common/workspaces';
import { getKeymaps, normalizeKeyCombo } from 'app/keymaps';
import { isPane } from 'lib/store/workspaces/helpers';
import { theme as globalTheme } from 'lib/styles/theme';

import SplitTerm from 'components/Terminal/split';
import { Content, Cursor, Line, Pane } from './styles';

function WorkspaceGroup(props: WorkspaceGroupProps) {
  const { group, focused, prompts, profile, ...settings } = props;

  const keymaps = useMemo(() => getKeymaps(), []);

  const splitSets = useMemo(
    () => ({
      horizontal: new Set(keymaps['pane:split-horizontal']),
      vertical: new Set(keymaps['pane:split-vertical']),
      close: new Set(keymaps['pane:close']),
    }),
    [keymaps],
  );

  if (isPane(group)) {
    const paneProps: WorkspacePaneProps = {
      ...settings,
      profile,
      splitSets,
      prompt: prompts[group.id],
      isCurrent: focused === group.id,
      onFocus: () => props.setFocusedGroup(group.id),
      onBlur: commands => props.clearFocusedGroup(group.id, commands),
      onPrompt: data => props.setPrompt(group.id, data),
      onSplit: orientation => props.splitPane(group, orientation),
      onClose: () => props.closePane(group.id),
    };

    return <WorkspacePane {...paneProps} key={group.id} />;
  }

  return (
    <SplitTerm
      ratios={group.ratios}
      orientation={group.orientation}
      onResizeGroup={ratios => props.setGroupRatios(group.id, ratios)}
      isPreview
    >
      {group.children.map(child => (
        <WorkspaceGroup {...props} group={child} key={child.id} />
      ))}
    </SplitTerm>
  );
}

function WorkspacePane(props: WorkspacePaneProps) {
  const { prompt, profile, isCurrent, splitSets, ...settings } = props;

  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const handlePrompt = (event: KeyboardEvent) => {
    if (!isCurrent) return;

    event.preventDefault();

    const combo = normalizeKeyCombo(event);

    if (splitSets.horizontal.has(combo)) {
      handleBlur();
      return props.onSplit('horizontal');
    }

    if (splitSets.vertical.has(combo)) {
      handleBlur();
      return props.onSplit('vertical');
    }

    if (splitSets.close.has(combo)) {
      return props.onClose();
    }

    const { key } = event;

    let data = prompt || '';

    if (key.length === 1) data += key;

    if (key === 'Enter' && data[data.length - 1] !== '\n' && data !== '') {
      data += '\n';
    }

    if (key === 'Backspace') data = data.slice(0, -1);

    props.onPrompt(data);
  };

  const handleBlur = () => {
    const commands = (prompt ? prompt.split('\n') : []).filter(c => c !== '');

    props.onBlur(commands);
  };

  useEffect(() => {
    if (isCurrent) ref.current?.focus();
  }, [isCurrent]);

  const [prefix, symbol] = getPreviewPrompt(profile, settings.theme);

  return (
    <Pane
      ref={ref}
      tabIndex={0}
      onClick={props.onFocus}
      onKeyDown={handlePrompt}
      onBlur={handleBlur}
      style={{
        fontFamily: settings.fontFamily,
        fontWeight: settings.fontWeight,
        color: settings.theme.foreground,
      }}
    >
      <Content>
        <Line dangerouslySetInnerHTML={{ __html: prefix }} />
        {prompt ? (
          prompt.split('\n').map((command, index, array) => (
            <Line key={index}>
              {parse(symbol.replace('%', command))}
              {array.length - 1 === index && (
                <Cursor
                  className={`cursor ${isCurrent ? 'focused' : 'hidden'}`}
                  style={{ background: settings.theme.cursor }}
                >
                  &nbsp;
                </Cursor>
              )}
            </Line>
          ))
        ) : (
          <Line>
            {parse(
              symbol.replace(
                '%',
                `<span style="color:${globalTheme.disabled};">${t('Type a command and press Enter to add another')}</span>`,
              ),
            )}
            <Cursor
              className={`cursor ${isCurrent ? 'focused' : 'hidden'}`}
              style={{ background: settings.theme.cursor }}
            >
              &nbsp;
            </Cursor>
          </Line>
        )}
      </Content>
      <style>
        {`
          ::selection {
            background: ${settings.theme.selectionBackground};
            color: unset;
          }
        `}
      </style>
    </Pane>
  );
}

export default memo(WorkspaceGroup);
