import { reportError } from 'shared/error-reporter';

export default async (
  gist: string | null,
): Promise<Record<string, string> | null> => {
  if (!gist || !/^[a-f0-9]{32}$/i.test(gist)) {
    reportError(new Error(`Invalid Gist: ${gist}`));

    return null;
  }

  const response = await fetch(`https://api.github.com/gists/${gist}`);

  try {
    if (response.ok) {
      const { files } = await response.json();

      return Object.values<Record<string, string>>(files)[0];
    }
  } catch (error) {
    reportError(new Error(`GitHub API error: ${response.statusText}`));
  }

  return null;
};
