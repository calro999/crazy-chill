export async function updateGitHubFile(
  filePath: string,
  content: string,
  commitMessage: string
) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    throw new Error('Missing GitHub configuration variables (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // 1. Get current file SHA
  const getRes = await fetch(`${url}?ref=${branch}`, { headers });
  if (!getRes.ok && getRes.status !== 404) {
    const err = await getRes.json();
    throw new Error(`Failed to fetch file from GitHub: ${err.message}`);
  }
  
  let sha = undefined;
  if (getRes.ok) {
    const fileData = await getRes.json();
    sha = fileData.sha;
  }

  // 2. Update file
  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha, // Required if file exists
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(`Failed to commit to GitHub: ${err.message}`);
  }

  return await putRes.json();
}
