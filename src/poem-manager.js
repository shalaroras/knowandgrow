import './poem-manager.css'

const OWNER = 'shalaroras'
const REPOSITORY = 'knowandgrow'
const BRANCH = 'main'
const CONTENT_PATH = 'public/content/poems.json'
const API_URL = `https://api.github.com/repos/${OWNER}/${REPOSITORY}/contents/${CONTENT_PATH}`

let token = ''
let poems = []
let fileSha = ''
let editingIndex = null
let dirty = false

const app = document.querySelector('#manager-app')
app.innerHTML = `
  <header><a href="../">← Poems</a><span>Know <i>&</i> Grow</span><button id="sign-out" hidden>Sign out</button></header>
  <main>
    <section class="login-card" id="login-panel">
      <p class="eyebrow">Owner access</p><h1>Poem <i>Manager.</i></h1>
      <p>Add and edit poems through a friendly form. Your GitHub token is kept only in this page’s memory and is forgotten when you close or refresh it.</p>
      <label>Fine-grained GitHub token<input id="token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></label>
      <button class="primary" id="connect">Connect securely</button>
      <p class="status" id="login-status"></p>
      <details><summary>How do I create the token?</summary><ol><li>Open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">GitHub’s fine-grained token page</a>.</li><li>Select only the <b>knowandgrow</b> repository.</li><li>Under repository permissions, set <b>Contents</b> to <b>Read and write</b>.</li><li>Create and copy the token, then paste it above. Choose a short expiry such as 30 or 90 days.</li></ol><p>Never send this token by email or chat. Revoke it from GitHub at any time.</p></details>
    </section>
    <section class="workspace" id="workspace" hidden>
      <div class="workspace-top"><div><p class="eyebrow">Your collection</p><h1>Shape the <i>words.</i></h1></div><div class="workspace-actions"><span id="save-state">Everything is published</span><button id="new-poem">＋ New poem</button><button class="primary" id="publish" disabled>Publish changes</button></div></div>
      <div class="manager-grid"><aside><div id="poem-list"></div></aside><section class="editor-card">
        <form id="poem-form"><input type="hidden" name="originalSlug"><div class="two-fields"><label>Title<input name="title" required></label><label>Theme<input name="theme" required placeholder="Hope, Growth, Courage…"></label></div><div class="two-fields"><label>Date<input name="date" required placeholder="15 October 2026"></label><label>URL name<input name="slug" required placeholder="my-poem-title"><small>Automatically formatted with lowercase letters and hyphens.</small></label></div><label>Short introduction<textarea name="introduction" required rows="2"></textarea></label><label>Poem<textarea name="lines" required rows="14" placeholder="Write each line naturally. Leave a blank line between stanzas."></textarea></label><div class="form-buttons"><button type="button" id="cancel-edit">Clear</button><button class="primary" type="submit">Keep this poem</button></div></form>
        <div class="preview"><p class="eyebrow">Live preview</p><h2 id="preview-title">Your poem title</h2><div id="preview-lines">Your lines will appear here.</div></div>
      </section></div>
      <p class="publish-status" id="publish-status"></p>
    </section>
  </main>`

const loginPanel = document.querySelector('#login-panel')
const workspace = document.querySelector('#workspace')
const form = document.querySelector('#poem-form')

async function github(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...options.headers }
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `GitHub returned ${response.status}`)
  }
  return response.json()
}

function decodeContent(content) {
  const bytes = Uint8Array.from(atob(content.replace(/\n/g, '')), char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function encodeContent(content) {
  const bytes = new TextEncoder().encode(content)
  let binary = ''
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

async function connect() {
  const status = document.querySelector('#login-status')
  token = document.querySelector('#token').value.trim()
  if (!token) { status.textContent = 'Enter your GitHub token first.'; return }
  status.textContent = 'Connecting…'
  document.querySelector('#connect').disabled = true
  try {
    const file = await github(`?ref=${BRANCH}`)
    poems = JSON.parse(decodeContent(file.content))
    fileSha = file.sha
    loginPanel.hidden = true; workspace.hidden = false; document.querySelector('#sign-out').hidden = false
    renderList(); resetForm(); status.textContent = ''
  } catch (error) {
    token = ''; status.textContent = `Could not connect: ${error.message}`; document.querySelector('#connect').disabled = false
  }
}

function renderList() {
  document.querySelector('#poem-list').innerHTML = poems.length ? poems.map((poem, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><b>${escapeHtml(poem.title)}</b><small>${escapeHtml(poem.theme)} · ${escapeHtml(poem.date)}</small></div><button data-edit="${index}">Edit</button><button class="delete" data-delete="${index}" aria-label="Delete ${escapeHtml(poem.title)}">×</button></article>`).join('') : '<p>No poems yet. Begin with one honest line.</p>'
  document.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => editPoem(Number(button.dataset.edit))))
  document.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => deletePoem(Number(button.dataset.delete))))
}

function editPoem(index) {
  editingIndex = index
  const poem = poems[index]
  for (const key of ['title','theme','date','slug','introduction','lines']) form.elements[key].value = poem[key]
  form.elements.originalSlug.value = poem.slug
  updatePreview(); form.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function resetForm() {
  editingIndex = null; form.reset()
  form.elements.date.value = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
  updatePreview()
}

function markDirty() {
  dirty = true; document.querySelector('#publish').disabled = false; document.querySelector('#save-state').textContent = 'Unpublished changes'
}

function deletePoem(index) {
  if (!confirm(`Remove “${poems[index].title}” from the collection? It will not disappear publicly until you publish.`)) return
  poems.splice(index, 1); markDirty(); renderList(); resetForm()
}

function updatePreview() {
  document.querySelector('#preview-title').textContent = form.elements.title.value || 'Your poem title'
  const lines = form.elements.lines.value
  document.querySelector('#preview-lines').innerHTML = lines ? lines.split('\n').map(line => line ? `<span>${escapeHtml(line)}</span>` : '<br>').join('') : 'Your lines will appear here.'
}

form.addEventListener('input', event => {
  if (event.target.name === 'title' && !form.elements.slug.value && editingIndex === null) form.elements.slug.value = slugify(event.target.value)
  updatePreview()
})

form.addEventListener('submit', event => {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(form))
  const poem = { slug:slugify(data.slug || data.title), title:data.title.trim(), date:data.date.trim(), theme:data.theme.trim(), introduction:data.introduction.trim(), lines:data.lines.trim() }
  const duplicate = poems.some((item, index) => item.slug === poem.slug && index !== editingIndex)
  if (duplicate) { document.querySelector('#publish-status').textContent = 'That URL name is already used. Choose another.'; return }
  if (editingIndex === null) poems.unshift(poem); else poems[editingIndex] = poem
  markDirty(); renderList(); resetForm(); document.querySelector('#publish-status').textContent = 'Poem kept. Select “Publish changes” when you are ready.'
})

async function publish() {
  const button = document.querySelector('#publish'); const status = document.querySelector('#publish-status')
  button.disabled = true; button.textContent = 'Publishing…'; status.textContent = 'Sending your collection to GitHub…'
  try {
    const latest = await github(`?ref=${BRANCH}`)
    const response = await github('', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ message:'Publish poems from Poem Manager', content:encodeContent(`${JSON.stringify(poems, null, 2)}\n`), sha:latest.sha, branch:BRANCH }) })
    fileSha = response.content.sha; dirty = false; document.querySelector('#save-state').textContent = 'Everything is published'; status.textContent = 'Published successfully. The Poems page will update after GitHub finishes deployment.'
  } catch (error) {
    button.disabled = false; status.textContent = `Could not publish: ${error.message}`
  } finally { button.textContent = 'Publish changes' }
}

function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = value || ''; return node.innerHTML }

document.querySelector('#connect').addEventListener('click', connect)
document.querySelector('#token').addEventListener('keydown', event => { if (event.key === 'Enter') connect() })
form.elements.slug.addEventListener('blur', event => { event.target.value = slugify(event.target.value || form.elements.title.value) })
document.querySelector('#new-poem').addEventListener('click', () => { resetForm(); form.scrollIntoView({behavior:'smooth'}) })
document.querySelector('#cancel-edit').addEventListener('click', resetForm)
document.querySelector('#publish').addEventListener('click', publish)
document.querySelector('#sign-out').addEventListener('click', () => { token = ''; location.reload() })
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = '' } })
