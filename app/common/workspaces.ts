import { v4 as uuidv4 } from 'uuid';
import { basename, extname, relative, sep } from 'path';
import { getDefaultProfile, getProfileByKey } from 'app/common/profiles';
import systemInfo, { getCurrentBranch } from 'app/utils/system-info';

function createWorkspace(t: any, index: number = 0): IWorkspace {
  return {
    id: uuidv4(),
    name: `${t('Workspace')} ${index}`,
    tabs: [createWorkspaceTab(t)],
  };
}

function createWorkspaceTab(t: any, index: number = 1): IWorkspaceTab {
  const { id } = getDefaultProfile();

  return {
    title: `${t('Terminal')} ${index}`,
    profile: id,
    commands: [],
    overrideTitle: true,
  };
}

function getPreviewPrompt({ profile: id }: IWorkspaceTab, theme: ITheme) {
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

    const branch = getCurrentBranch(cwd);

    return [
      `<span style="color:${theme.brightGreen};">${root}</span> <span style="color:${theme.brightYellow};">${
        basename(String.raw`${cwd}`) === username
          ? `~`
          : `~/${relative(home, cwd).split(sep).join('/')}`
      }</span> ${branch ? `<span style="color:${theme.brightCyan};">(${branch})</span>` : ''}`,
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

export { createWorkspace, createWorkspaceTab, getPreviewPrompt };
