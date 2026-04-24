import { v4 as uuidv4 } from 'uuid';
import { basename, extname, relative, sep } from 'path';
import { getDefaultProfile, getProfileByKey } from 'app/common/profiles';
import systemInfo from 'app/utils/system-info';

export function createWorkspace(t: any, length = 0): IWorkspace {
  return {
    id: uuidv4(),
    name: `${t('Workspace')} ${length + 1}`,
    tabs: [createWorkspaceTab()],
  };
}

export function createWorkspaceTab(length = 0): IWorkspaceTab {
  const { id: profile } = getDefaultProfile();

  return {
    profile,
    id: uuidv4(),
    title: `Terminal ${length + 1}`,
    overrideTitle: true,
    group: createWorkspaceGroup({}),
  };
}

export function createWorkspaceGroup({
  id,
  commands,
}: Partial<IWorkspaceGroup>): IWorkspaceGroup {
  return {
    id: id ?? uuidv4(),
    commands: commands ?? [],
    ratios: [],
    children: [],
    orientation: null,
  };
}

export function getPreviewPrompt(id: string, theme: ITheme): string[] {
  const profile = getProfileByKey('id', id);

  if (profile.type === 'shell') {
    const { root, username, home } = systemInfo;

    let { file, cwd, args } = profile.options;

    file = basename(file, extname(file));
    cwd ??= home;

    if (args.some(a => /clink/i.test(a))) return [`Clink v1.7.21`, `${cwd}>%`];

    if (/cmd/i.test(file)) return [`Command Prompt`, `${cwd}>%`];

    if (/powershell/i.test(file))
      return [
        `Windows PowerShell`,
        `PS ${cwd}> <span style="color:${theme.brightYellow};">%</span>`,
      ];

    return [
      `<span style="color:${theme.brightGreen};">${root}</span> <span style="color:${theme.brightYellow};">${
        basename(String.raw`${cwd}`) === username
          ? `~`
          : `~/${relative(home, cwd).split(sep).join('/')}`
      }</span>`,
      '$ %',
    ];
  }

  const info =
    profile.type === 'ssh'
      ? `${profile.options.host} ⇌ ${profile.options.port}`
      : `${profile.options.path} (${profile.options.baudRate})`;

  return [
    `<span style="color:${theme.background};background:${theme.foreground};font-weight:600;text-transform:uppercase;padding:0 .3125rem;">${profile.type}</span>` +
      `&nbsp;<span>${info}</span>`,
    '> %',
  ];
}
