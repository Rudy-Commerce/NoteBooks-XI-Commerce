// script.js — Step navigation & UI logic for the ADANotes installer

// ── Shared state ───────────────────────────────────────────────────────────
const S = {
  repo         : null,   // {username, repoName, repo, pagesHost}
  pat          : null,
  fullName     : '',
  shortName    : '',
  preCommitSha : null,
  vercelUrl    : '',
};

const STEPS = ['welcome','names','applying','workflows','vercel-guide','vercel-url','patching-vercel','success','cleanup'];

function showStep(name) {
  document.querySelectorAll('.step').forEach(el => {
    el.classList.toggle('active', el.id === `step-${name}`);
  });
  // Update progress dots
  const idx = STEPS.indexOf(name);
  document.querySelectorAll('.prog-dot').forEach((d, i) => {
    d.classList.toggle('done',    i < idx);
    d.classList.toggle('current', i === idx);
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function setErr(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}
function clrErr(id) { setErr(id, ''); }

function setBtnLoading(id, on, label = 'Please wait…') {
  const b = document.getElementById(id);
  if (!b) return;
  b.disabled = on;
  if (!b._orig) b._orig = b.textContent;
  b.textContent = on ? label : b._orig;
}

function addLog(containerId, msg, cls = 'info') {
  const c = document.getElementById(containerId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = `log-line log-${cls}`;
  d.textContent = msg;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

// ── Step 1: Welcome ────────────────────────────────────────────────────────
function initWelcome() {
  const detected = detectRepo();
  S.repo = detected;
  const ok   = document.getElementById('detect-ok');
  const fail = document.getElementById('detect-fail');
  if (detected) {
    document.getElementById('detected-repo').textContent = detected.repo;
    document.getElementById('detected-host').textContent = detected.pagesHost;
    ok.style.display   = 'flex';
    fail.style.display = 'none';
  } else {
    ok.style.display   = 'none';
    fail.style.display = 'flex';
  }
}

async function onWelcomeContinue() {
  const pat = document.getElementById('pat-input').value.trim();
  clrErr('welcome-err');
  if (!pat)      { setErr('welcome-err', 'Please enter your GitHub Personal Access Token.'); return; }
  if (!S.repo)   { setErr('welcome-err', 'Could not detect a GitHub repository from this URL.'); return; }
  setBtnLoading('welcome-btn', true);
  try {
    await ghVerifyAccess(pat, S.repo.repo);
    S.pat = pat;
    showStep('names');
  } catch (e) {
    setErr('welcome-err', e.message);
  } finally {
    setBtnLoading('welcome-btn', false);
  }
}

// ── Step 2: Names ──────────────────────────────────────────────────────────
function onNamesContinue() {
  const full  = document.getElementById('full-name').value.trim();
  const short = document.getElementById('short-name').value.trim();
  clrErr('names-err');
  if (!full)          { setErr('names-err', 'Full name is required.'); return; }
  if (!short)         { setErr('names-err', 'Short name is required.'); return; }
  if (short.length > 12) { setErr('names-err', 'Short name should be 12 characters or less.'); return; }
  S.fullName  = full;
  S.shortName = short;
  startApplying();
}

// ── Step 3: Applying changes ───────────────────────────────────────────────
async function startApplying() {
  showStep('applying');
  const log = id => addLog('apply-log', id);
  const ok  = id => addLog('apply-log', id, 'success');
  const err = id => addLog('apply-log', id, 'error');

  const retryBtn = document.getElementById('apply-retry');
  retryBtn.style.display = 'none';

  try {
    const { pat, repo: ri, fullName: fn, shortName: sn } = S;
    const repo = ri.repo, host = ri.pagesHost;

    S.preCommitSha = await ghLatestCommitSha(pat, repo);
    log(`📍 Snapshot commit: ${S.preCommitSha?.slice(0,7) ?? 'unknown'}`);
    addLog('apply-log', '');

    // ── api/gh.js ──────────────────────────────────────────────────────────
    log('Patching api/gh.js…');
    const ghJs = await ghGetFile(pat, repo, 'api/gh.js');
    if (!ghJs) throw new Error('api/gh.js not found in repository.');
    const newGhJs = ghJs.content.replace(/const REPO\s*=\s*'[^']*';/, `const REPO = '${repo}';`);
    await ghPutFile(pat, repo, 'api/gh.js', newGhJs, ghJs.sha, `installer: set REPO → ${repo}`);
    ok('✓ api/gh.js — REPO updated');

    // ── api/raw.js ─────────────────────────────────────────────────────────
    log('Patching api/raw.js…');
    const rawJs = await ghGetFile(pat, repo, 'api/raw.js');
    if (!rawJs) throw new Error('api/raw.js not found in repository.');
    const newRawJs = rawJs.content.replace(/const REPO\s*=\s*'[^']*';/, `const REPO = '${repo}';`);
    await ghPutFile(pat, repo, 'api/raw.js', newRawJs, rawJs.sha, `installer: set REPO → ${repo} in raw.js`);
    ok('✓ api/raw.js — REPO updated');

    // ── index.html (hostname + title + h1 + welcome) ───────────────────────
    log('Patching root index.html…');
    const idxFile = await ghGetFile(pat, repo, 'index.html');
    if (!idxFile) throw new Error('index.html not found in repository.');
    let newIdx = idxFile.content;
    // GitHub Pages hostname in maybeShowVercelPopup
    newIdx = newIdx.replace(/pratyushchanda\.github\.io/g, host);
    // <title>
    newIdx = newIdx.replace(/<title>[^<]*<\/title>/, `<title>${fn}</title>`);
    // <h1>Ada</h1>
    newIdx = newIdx.replace(/<h1>Ada<\/h1>/, `<h1>${fn}</h1>`);
    // Welcome overlay text
    newIdx = newIdx.replace(/Welcome to Ada/g, `Welcome to ${fn}`);
    await ghPutFile(pat, repo, 'index.html', newIdx, idxFile.sha, `installer: brand as "${fn}", set pages host`);
    ok('✓ index.html — title, h1, hostname updated');

    // ── manifest.json ──────────────────────────────────────────────────────
    log('Patching manifest.json…');
    const mFile = await ghGetFile(pat, repo, 'manifest.json');
    if (!mFile) throw new Error('manifest.json not found in repository.');
    const mJson = JSON.parse(mFile.content);
    mJson.name       = fn;
    mJson.short_name = sn;
    await ghPutFile(pat, repo, 'manifest.json', JSON.stringify(mJson, null, 2) + '\n', mFile.sha, `installer: PWA names → "${fn}" / "${sn}"`);
    ok('✓ manifest.json — name & short_name updated');

    // ── .installer/log.txt ─────────────────────────────────────────────────
    log('Saving .installer/log.txt…');
    const logTxt = `full_name=${fn}\nshort_name=${sn}\nrepo=${repo}\ninstalled_at=${new Date().toISOString()}\n`;
    const existLog = await ghGetFile(pat, repo, '.installer/log.txt');
    await ghPutFile(pat, repo, '.installer/log.txt', logTxt, existLog?.sha ?? null, 'installer: save log.txt');
    ok('✓ .installer/log.txt saved');

    // ── conf.txt ───────────────────────────────────────────────────────────
    log('Saving conf.txt…');
    const existConf = await ghGetFile(pat, repo, 'conf.txt');
    await ghPutFile(pat, repo, 'conf.txt', `${fn}\n`, existConf?.sha ?? null, 'installer: save conf.txt');
    ok('✓ conf.txt saved');

    addLog('apply-log', '');
    log('All commits pushed. Starting workflow monitor…');
    await new Promise(res => setTimeout(res, 1800));
    startWorkflowWait();

  } catch (e) {
    err(`✗ ${e.message}`);
    retryBtn.style.display = 'inline-flex';
  }
}

// ── Step 4: Workflow wait ──────────────────────────────────────────────────
async function startWorkflowWait() {
  showStep('workflows');
  const statusEl  = document.getElementById('wf-status');
  const barEl     = document.getElementById('wf-bar');
  const continueBtn = document.getElementById('wf-continue');
  continueBtn.style.display = 'none';

  function onUpdate(msg, pct) {
    statusEl.textContent = msg;
    barEl.style.width    = Math.round(pct) + '%';
  }

  try {
    onUpdate('Waiting for GitHub Actions to start…', 0);
    await new Promise(res => setTimeout(res, 6000));

    await waitForWorkflows(S.pat, S.repo.repo, onUpdate);

    // Post-workflow checks
    onUpdate('Checking latest commit…', 98);
    const latestSha = await ghLatestCommitSha(S.pat, S.repo.repo);
    const hasNewCommit = latestSha && latestSha !== S.preCommitSha;

    // Verify conf.txt survived
    onUpdate('Verifying conf.txt…', 99);
    const conf = await ghGetFile(S.pat, S.repo.repo, 'conf.txt');
    if (!conf || !conf.content.trim()) {
      onUpdate('Restoring conf.txt…', 99);
      await ghPutFile(S.pat, S.repo.repo, 'conf.txt', `${S.fullName}\n`, conf?.sha ?? null, 'installer: restore conf.txt');
    }

    onUpdate(`✓ Done${hasNewCommit ? ` — new commit ${latestSha.slice(0,7)}` : ''}`, 100);
    barEl.parentElement.classList.add('bar-done');
    continueBtn.style.display = 'inline-flex';

  } catch (e) {
    statusEl.textContent     = `⚠  ${e.message}`;
    statusEl.style.color     = 'var(--clr-error)';
    continueBtn.textContent  = 'Continue anyway →';
    continueBtn.style.display = 'inline-flex';
  }
}

// ── Step 5: Vercel guide ───────────────────────────────────────────────────
function onVercelGuideContinue() {
  const raw = document.getElementById('satoken-input').value.trim().toUpperCase();
  clrErr('vg-err');
  if (!/^[A-Z0-9]{6}$/.test(raw)) {
    setErr('vg-err', 'Super Admin code must be exactly 6 alphanumeric characters (A-Z, 0-9).');
    return;
  }
  S.satoken = raw;
  // Show chosen code in the Vercel URL step for reference
  const el = document.getElementById('vurl-satoken-hint');
  if (el) el.textContent = raw;
  showStep('vercel-url');
}

// ── Step 6: Vercel URL ─────────────────────────────────────────────────────
async function onVercelUrlContinue() {
  let url = document.getElementById('vercel-url-input').value.trim().replace(/\/$/, '');
  clrErr('vurl-err');
  if (!url) { setErr('vurl-err', 'Please enter your Vercel deployment URL.'); return; }
  if (!url.startsWith('http')) url = 'https://' + url;

  setBtnLoading('vurl-btn', true, 'Checking…');
  const reachable = await verifyUrl(url);
  if (!reachable) {
    setErr('vurl-err', 'Could not reach that URL. Make sure the deployment is live and try again.');
    setBtnLoading('vurl-btn', false);
    return;
  }

  S.vercelUrl = url;
  setBtnLoading('vurl-btn', false);
  startPatchingVercel();
}

// ── Step 7: Patch goToVercel URL ───────────────────────────────────────────
async function startPatchingVercel() {
  showStep('patching-vercel');
  const logAdd = (m, c) => addLog('pv-log', m, c);

  try {
    logAdd(`Fetching index.html…`);
    const f = await ghGetFile(S.pat, S.repo.repo, 'index.html');
    if (!f) throw new Error('index.html not found');

    logAdd(`Replacing goToVercel() URL…`);
    // Match: window.location.href = '<anything>' inside goToVercel
    const newContent = f.content.replace(
      /(function goToVercel\(\)[\s\S]*?window\.location\.href\s*=\s*')[^']*(')/,
      `$1${S.vercelUrl}$2`
    );
    if (newContent === f.content) throw new Error('Could not find goToVercel URL pattern in index.html');

    await ghPutFile(S.pat, S.repo.repo, 'index.html', newContent, f.sha, `installer: set Vercel redirect → ${S.vercelUrl}`);
    logAdd(`✓ index.html updated with Vercel URL`, 'success');
    logAdd(``);
    logAdd(`All done! 🎉`, 'success');

    await new Promise(res => setTimeout(res, 1200));
    showStep('success');

  } catch (e) {
    logAdd(`✗ ${e.message}`, 'error');
    document.getElementById('pv-retry').style.display = 'inline-flex';
  }
}

// ── Step 9: Cleanup ────────────────────────────────────────────────────────
async function startCleanup() {
  showStep('cleanup');
  const statusEl  = document.getElementById('cleanup-status');
  const fallbackEl = document.getElementById('cleanup-fallback');

  try {
    statusEl.textContent = 'Listing .installer files…';
    const files = await ghListDir(S.pat, S.repo.repo, 'install');
    const toDelete = files.filter(f => f.type === 'file');

    for (let i = 0; i < toDelete.length; i++) {
      const f = toDelete[i];
      statusEl.textContent = `Removing ${f.name} (${i + 1} / ${toDelete.length})…`;
      await ghDeleteFile(S.pat, S.repo.repo, f.path, f.sha, `installer: cleanup — remove ${f.name}`);
      await new Promise(res => setTimeout(res, 600));
    }

    statusEl.textContent = '✓ Installer removed. Closing tab…';
    await new Promise(res => setTimeout(res, 2200));
    window.close();

    // window.close() only works if the tab was script-opened; show fallback if blocked
    await new Promise(res => setTimeout(res, 800));
    fallbackEl.style.display = 'block';

  } catch (e) {
    statusEl.textContent = `⚠  ${e.message}`;
    fallbackEl.style.display = 'block';
  }
}

// ── Boot ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initWelcome();
  showStep('welcome');
});
