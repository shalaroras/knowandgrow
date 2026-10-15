import './styles.css'
import { seededStories } from './data.js'
import { icon, pageTemplate } from './ui.js'

let activeFilter = 'All'
let stories = loadStories()
const app = document.querySelector('#app')

function savedItems() {
  try { return JSON.parse(localStorage.getItem('kg-stories') || '[]') } catch { return [] }
}
function loadStories() { return [...seededStories, ...savedItems().filter(item => item.status === 'published')] }

function render() {
  const visible = activeFilter === 'All' ? stories : stories.filter(s => s.kind === activeFilter)
  app.innerHTML = pageTemplate(stories, visible, activeFilter)
  bindEvents()
}

function bindEvents() {
  document.querySelectorAll('[data-story]').forEach(card => {
    card.addEventListener('click', e => { if (!e.target.closest('.save-story')) openStory(card.dataset.story) })
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openStory(card.dataset.story) })
  })
  document.querySelectorAll('.save-story').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation(); btn.classList.toggle('saved'); toast(btn.classList.contains('saved') ? 'Saved for later' : 'Removed from saved')
  }))
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter; render(); document.querySelector('#all-stories').scrollIntoView({behavior:'smooth'})
  }))
  document.querySelectorAll('.open-desk').forEach(btn => btn.addEventListener('click', () => {
    document.querySelector('#desk-dialog').showModal(); renderDrafts()
  }))
  document.querySelectorAll('.open-search').forEach(btn => btn.addEventListener('click', () => document.querySelector('#search-dialog').showModal()))
  document.querySelectorAll('.dialog-close').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()))
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close() }))
  document.querySelector('#newsletter-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Lovely — your first note will arrive soon.') })
  document.querySelector('#story-form').addEventListener('submit', e => saveStory(e, 'published'))
  document.querySelector('#save-draft').addEventListener('click', e => saveStory(e, 'draft'))
  document.querySelector('#search-input').addEventListener('input', searchStories)
}

function openStory(id) {
  const story = stories.find(s => s.id === id)
  if (!story) return
  const dialog = document.querySelector('#story-dialog')
  dialog.querySelector('.article-content').innerHTML = `<div class="article-hero" style="background-image:url('${story.image}')"></div><p class="kicker"><span></span>${story.kind}</p><h1>${story.title}</h1><p class="article-deck">${story.excerpt}</p><div class="article-meta">${story.date} · ${story.readTime}</div><div class="article-body">${story.body}</div><div class="article-end">${icon('leaf')}<p>Found this useful? Pass it on to someone curious.</p></div>`
  dialog.showModal()
}

function saveStory(event, status) {
  event.preventDefault()
  const form = document.querySelector('#story-form')
  if (!form.reportValidity()) return
  const data = new FormData(form)
  const file = data.get('image')
  const finish = image => {
    const stored = savedItems()
    const body = String(data.get('body'))
    const item = {
      id: `reader-${Date.now()}`, kind: data.get('kind'), title: safe(data.get('title')),
      excerpt: safe(data.get('excerpt')), body: `<p>${safe(body).replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')}</p>`,
      image: image || seededStories[0].image,
      date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),
      readTime: `${Math.max(1, Math.ceil(body.split(/\s+/).length/200))} min read`, status
    }
    localStorage.setItem('kg-stories', JSON.stringify([item, ...stored]))
    form.reset()
    toast(status === 'draft' ? 'Draft saved in this browser' : 'Published to your local preview')
    if (status === 'published') { stories = loadStories(); document.querySelector('#desk-dialog').close(); render() } else renderDrafts()
  }
  if (file?.size) { const reader = new FileReader(); reader.onload = () => finish(reader.result); reader.readAsDataURL(file) } else finish('')
}

function renderDrafts() {
  const drafts = savedItems().filter(d => d.status === 'draft')
  document.querySelector('#drafts').innerHTML = drafts.length ? drafts.map(d => `<div><span><b>${d.title}</b><small>${d.kind} · ${d.date}</small></span><button data-delete="${d.id}">Delete</button></div>`).join('') : '<p>No saved drafts yet.</p>'
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
    localStorage.setItem('kg-stories', JSON.stringify(savedItems().filter(d => d.id !== btn.dataset.delete))); renderDrafts(); toast('Draft deleted')
  }))
}

function searchStories(e) {
  const query = e.target.value.toLowerCase().trim()
  const matches = query ? stories.filter(s => `${s.title} ${s.excerpt} ${s.kind}`.toLowerCase().includes(query)) : []
  document.querySelector('#search-results').innerHTML = query ? (matches.length ? matches.map(s => `<button data-result="${s.id}"><span>${s.kind}</span><b>${s.title}</b>${icon('arrow')}</button>`).join('') : '<p>Nothing matched that yet. Try another word.</p>') : ''
  document.querySelectorAll('[data-result]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelector('#search-dialog').close(); openStory(btn.dataset.result)
  }))
}

function safe(value) { const node = document.createElement('div'); node.textContent = value; return node.innerHTML }
function toast(message) {
  const element = document.querySelector('.toast'); element.textContent = message; element.classList.add('show')
  setTimeout(() => element.classList.remove('show'), 2600)
}

render()
