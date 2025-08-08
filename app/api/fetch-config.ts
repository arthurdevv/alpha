export default async (gist: string | null): Promise<string | null> => {
  if (!gist || !/^[a-f0-9]{32}$/i.test(gist)) {
    console.error(`Invalid Gist: ${gist}`);

    return null;
  }

  const response = await fetch(`https://api.github.com/gists/${gist}`);

  if (response.ok) {
    const { files } = await response.json();

    const [{ content }] = Object.values<Record<string, string>>(files);

    return content;
  }

  console.error(`GitHub API error: ${response.statusText}`);

  return null;
};
