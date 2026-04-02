// installer.js — GitHub API layer for the ADANotes installer

const GH_API = 'https://api.github.com';

function _authHeader(pat) {
  return pat.startsWith('github_pat_') ? `Bearer ${pat}` : `token ${pat}`;
}
function _encodePath(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}

// ── Detect repo from current page URL ─────────────────────────────────────
function detectRepo() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const match    = hostname.match(/^([a-z0-9-]+)\.github\.io$/i);
  if (!match) return null;
  const username = match[1];
  const segments = pathname.split('/').filter(Boolean);
  const firstSeg = segments[0] || '';
  const repoName = (!firstSeg || firstSeg === '.installer')
                 ? `${username}.github.io`
                 : firstSeg;
  return { username, repoName, repo: `${username}/${repoName}`, pagesHost: hostname };
}

// ── Get file → {sha, content:string} or null ──────────────────────────────
async function ghGetFile(pat, repo, filePath) {
  const r = await fetch(`${GH_API}/repos/${repo}/contents/${_encodePath(filePath)}`, {
    headers: { Authorization: _authHeader(pat), Accept: 'application/vnd.github.v3+json' },
  });
  if (r.status === 404) return null;
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || `GET ${filePath} failed (${r.status})`); }
  const d   = await r.json();
  const raw = d.content.replace(/\n/g, '');
  let content;
  try { content = decodeURIComponent(escape(atob(raw))); } catch { content = atob(raw); }
  return { sha: d.sha, content };
}

// ── Put file (create or update) ────────────────────────────────────────────
async function ghPutFile(pat, repo, filePath, textContent, sha, message) {
  let b64;
  try { b64 = btoa(unescape(encodeURIComponent(textContent))); } catch { b64 = btoa(textContent); }
  const body = { message, content: b64 };
  if (sha) body.sha = sha;
  const r = await fetch(`${GH_API}/repos/${repo}/contents/${_encodePath(filePath)}`, {
    method: 'PUT',
    headers: { Authorization: _authHeader(pat), 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || `PUT ${filePath} failed (${r.status})`); }
  return await r.json();
}

// ── Delete file ────────────────────────────────────────────────────────────
async function ghDeleteFile(pat, repo, filePath, sha, message) {
  const r = await fetch(`${GH_API}/repos/${repo}/contents/${_encodePath(filePath)}`, {
    method: 'DELETE',
    headers: { Authorization: _authHeader(pat), 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
    body: JSON.stringify({ message: message || `installer: delete ${filePath}`, sha }),
  });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || `DELETE ${filePath} failed (${r.status})`); }
  return true;
}

// ── List directory ─────────────────────────────────────────────────────────
async function ghListDir(pat, repo, dirPath) {
  const r = await fetch(`${GH_API}/repos/${repo}/contents/${_encodePath(dirPath)}`, {
    headers: { Authorization: _authHeader(pat), Accept: 'application/vnd.github.v3+json' },
  });
  if (r.status === 404) return [];
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || `LIST ${dirPath} failed (${r.status})`); }
  return await r.json();
}

// ── Latest commit SHA ──────────────────────────────────────────────────────
async function ghLatestCommitSha(pat, repo) {
  const r = await fetch(`${GH_API}/repos/${repo}/commits?per_page=1`, {
    headers: { Authorization: _authHeader(pat), Accept: 'application/vnd.github.v3+json' },
  });
  if (!r.ok) throw new Error(`Commits check failed (${r.status})`);
  const d = await r.json();
  return Array.isArray(d) && d[0]?.sha ? d[0].sha : null;
}

// ── Verify PAT + repo access ───────────────────────────────────────────────
async function ghVerifyAccess(pat, repo) {
  const r = await fetch(`${GH_API}/repos/${repo}`, {
    headers: { Authorization: _authHeader(pat), Accept: 'application/vnd.github.v3+json' },
  });
  if (r.status === 401) throw new Error('Invalid token — authentication failed.');
  if (r.status === 403) throw new Error('Token lacks access to this repository.');
  if (r.status === 404) throw new Error('Repository not found. Verify the repo name and token scope.');
  if (!r.ok) throw new Error(`Repo check failed (${r.status})`);
  return true;
}

// ── Poll workflows until all complete ─────────────────────────────────────
async function waitForWorkflows(pat, repo, onUpdate) {
  const MAX = 6 * 60 * 1000, POLL = 9000;
  const t0  = Date.now();
  while (true) {
    const elapsed = Date.now() - t0;
    if (elapsed > MAX) throw new Error('Workflows timed out. Check the Actions tab on GitHub.');
    const r = await fetch(`${GH_API}/repos/${repo}/actions/runs?per_page=10`, {
      headers: { Authorization: _authHeader(pat), Accept: 'application/vnd.github.v3+json' },
    });
    if (!r.ok) throw new Error(`Workflow runs fetch failed (${r.status})`);
    const { workflow_runs: runs = [] } = await r.json();
    const active = runs.filter(w => w.status === 'in_progress' || w.status === 'queued');
    const failed = runs.filter(w => w.status === 'completed' && w.conclusion === 'failure');
    if (active.length === 0) {
      if (failed.length > 0) throw new Error(`Workflow "${failed[0].name}" failed. Check GitHub Actions.`);
      onUpdate('All workflows completed ✓', 100); return;
    }
    onUpdate(`Running: ${active.map(w => w.name).join(', ')}`, Math.min(90, (elapsed / MAX) * 100));
    await new Promise(res => setTimeout(res, POLL));
  }
}

// ── Verify a URL responds (no-cors so CORS won't block us) ────────────────
async function verifyUrl(url) {
  try { await fetch(url, { mode: 'no-cors' }); return true; } catch { return false; }
}
