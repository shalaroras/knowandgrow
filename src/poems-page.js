import './poems.css'
import { icon } from './ui.js'

const app = document.querySelector('#poems-app')
const contentUrl = new URL('../content/poems.json', document.baseURI)

function poemCard(poem, index) {
  const preview = poem.lines.split('\n').filter(Boolean).slice(0, 4).join('<br>')
  return `<article class="poem-card" id="${poem.slug}">
    <div class="poem-number">${String(index + 1).padStart(2, '0')}</div>
    <div class="poem-summary"><p class="poem-theme">${poem.theme}</p><h2>${poem.title}</h2><p>${poem.introduction}</p><button data-poem="${poem.slug}">Read the poem ${icon('arrow')}</button></div>
    <div class="poem-preview"><p>${preview}</p><span>···</span></div>
  </article>`
}

function render(poems) {
  app.innerHTML = `
    <header class="poems-header">
      <a class="brand" href="../"><span class="brand-mark">${icon('leaf')}</span><span>Know <em>&</em> Grow</span></a>
      <nav><a href="../">Journal</a><a class="active" href="./">Poems</a><a href="../#quotes">Quotes</a><a href="../#about">Our story</a></nav>
      <a class="back-link" href="../">${icon('arrow')} Back home</a>
    </header>
    <main>
      <section class="poems-hero"><div><p class="kicker"><span></span>Words to keep</p><h1>Poems for the<br><i>quiet moments.</i></h1><p>Small observations, honest questions and a little light—gathered here whenever you need them.</p></div><div class="hero-lines" aria-hidden="true"><span></span><span></span><span></span><span></span><b>✦</b></div></section>
      <section class="poem-collection"><div class="collection-heading"><p>${poems.length} poems in the collection</p><p>Read slowly. Return often.</p></div>${poems.map(poemCard).join('')}</section>
      <section class="poem-invitation"><p class="kicker centered"><span></span>Your words belong here too<span></span></p><h2>Have a poem to <i>share?</i></h2><p>Use the Poem Manager to add, edit and publish your writing without touching code.</p><a href="./manage/">Open Poem Manager ${icon('arrow')}</a></section>
    </main>
    <footer><a class="brand" href="../"><span class="brand-mark">${icon('leaf')}</span><span>Know <em>&</em> Grow</span></a><p>Words for the lifelong learners<br>and the quietly becoming.</p><a href="../">Return to the journal ${icon('arrow')}</a><small>© ${new Date().getFullYear()} Know & Grow · Made thoughtfully in India</small></footer>
    <dialog id="poem-dialog"><button class="dialog-close" aria-label="Close">${icon('close')}</button><article></article></dialog>`

  document.querySelectorAll('[data-poem]').forEach(button => button.addEventListener('click', () => {
    const poem = poems.find(item => item.slug === button.dataset.poem)
    const dialog = document.querySelector('#poem-dialog')
    dialog.querySelector('article').innerHTML = `<p class="poem-theme">${poem.theme}</p><h1>${poem.title}</h1><p class="poem-date">${poem.date}</p><div class="full-poem">${poem.lines.split('\n').map(line => line ? `<span>${line}</span>` : '<br>').join('')}</div><div class="poem-end">${icon('leaf')}<p>Keep what speaks to you. Share what someone else may need.</p></div>`
    dialog.showModal()
  }))
  document.querySelector('.dialog-close').addEventListener('click', () => document.querySelector('#poem-dialog').close())
  document.querySelector('#poem-dialog').addEventListener('click', event => { if (event.target.id === 'poem-dialog') event.target.close() })
}

fetch(contentUrl)
  .then(response => { if (!response.ok) throw new Error('Could not load poems'); return response.json() })
  .then(render)
  .catch(() => { app.innerHTML = '<main class="load-error"><h1>The poems are resting.</h1><p>Please try this page again in a moment.</p><a href="../">Return home</a></main>' })
