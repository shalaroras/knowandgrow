export function icon(name) {
  const icons = {
    leaf: '<svg viewBox="0 0 24 24"><path d="M20 4C12 4 5 8 5 15c0 2 1 4 3 5 0-5 4-9 9-11-4 3-7 7-8 11 7 1 11-4 11-16Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="m4 20 4-1 10-10-3-3L5 16l-1 4ZM13 8l3 3M14 5l2-2 5 5-2 2"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4V4Z"/></svg>'
  }
  return icons[name] || ''
}

export function storyCard(story, featured = false) {
  return `<article class="story-card ${featured ? 'featured-story' : ''}" data-story="${story.id}" tabindex="0">
    <div class="story-image" style="background-image:url('${story.image}')"><span class="story-tag">${story.kind}</span></div>
    <div class="story-copy"><h3>${story.title}</h3><p>${story.excerpt}</p>
      <div class="story-meta"><span>${story.date}</span><span class="dot"></span><span>${story.readTime}</span><button class="icon-button save-story" aria-label="Save story">${icon('bookmark')}</button></div>
    </div></article>`
}

export function pageTemplate(stories, visibleStories, activeFilter) {
  const filters = ['All', 'Learn better', 'Everyday wisdom', 'From the kitchen', 'A poem']
  const filterLabel = f => ({'Learn better':'Learning','Everyday wisdom':'Life','From the kitchen':'Recipes','A poem':'Poems'}[f] || f)
  return `
  <header class="site-header">
    <a class="brand" href="#top"><span class="brand-mark">${icon('leaf')}</span><span>Know <em>&</em> Grow</span></a>
    <nav><a href="#discover">Discover</a><a href="#about">Our story</a><button class="text-button open-search">${icon('search')} Search</button></nav>
    <button class="desk-button open-desk">${icon('pen')} Writer’s desk</button>
  </header>
  <main id="top">
    <section class="hero">
      <div class="hero-copy"><p class="kicker"><span></span>A place for curious minds</p><h1>Ideas worth<br><i>keeping.</i></h1><p class="hero-intro">Practical know-how, thoughtful words and small discoveries for a richer everyday life.</p><a class="primary-button" href="#discover">See what’s growing ${icon('arrow')}</a></div>
      <div class="hero-art" aria-label="A journal, wildflowers and a cup of tea"><div class="paper paper-back"></div><div class="paper paper-front"><span class="tape"></span><p>Stay curious.<br>Share generously.<br>Keep growing.</p><small>one idea at a time</small></div><div class="sun"></div><div class="cup"><span></span></div><div class="stem"><i></i><i></i><i></i></div></div>
    </section>
    <section class="welcome-strip"><span>✦</span><p><strong>Welcome in.</strong> This is a collection of things we’ve learnt, loved and found worth passing on.</p><span>✦</span></section>
    <section class="editorial" id="discover">
      <div class="section-heading"><div><p class="kicker"><span></span>Fresh from the journal</p><h2>Something for your<br><i>head & heart.</i></h2></div><a href="#all-stories" class="line-link">Browse the whole journal ${icon('arrow')}</a></div>
      <div class="feature-grid">${storyCard(visibleStories[0] || stories[0], true)}<div class="side-stories">${visibleStories.slice(1,3).map(s => storyCard(s)).join('')}</div></div>
    </section>
    <section class="topics"><p class="kicker centered"><span></span>Wander by interest<span></span></p><h2>What are you curious about?</h2><div class="topic-grid">
      <button data-filter="Learn better"><b>01</b><span>⌁</span><h3>Learn</h3><p>Ideas made clearer</p></button>
      <button data-filter="Everyday wisdom"><b>02</b><span>☼</span><h3>Live</h3><p>Wisdom for everyday</p></button>
      <button data-filter="From the kitchen"><b>03</b><span>♨</span><h3>Make</h3><p>Recipes & things to try</p></button>
      <button data-filter="A poem"><b>04</b><span>✧</span><h3>Feel</h3><p>Poems & perspective</p></button>
    </div></section>
    <section class="journal" id="all-stories"><div class="journal-top"><div><p class="kicker"><span></span>The whole journal</p><h2>Take your time.<br><i>There’s plenty here.</i></h2></div><div class="filters">${filters.map(f => `<button class="${activeFilter===f?'active':''}" data-filter="${f}">${filterLabel(f)}</button>`).join('')}</div></div><div class="journal-grid">${visibleStories.map(s => storyCard(s)).join('') || '<p>Nothing here yet—but something is growing.</p>'}</div></section>
    <section class="newsletter"><div class="newsletter-leaf">${icon('leaf')}</div><p class="kicker centered"><span></span>A thoughtful note, now and then<span></span></p><h2>Keep a little curiosity<br>in your <i>inbox.</i></h2><p>No noise. Just one good idea, recipe or poem when we have something worth sharing.</p><form id="newsletter-form"><input type="email" aria-label="Email address" placeholder="Your email address" required><button>Count me in ${icon('arrow')}</button></form><small>Unsubscribe anytime. We’ll never make your inbox noisy.</small></section>
    <section class="about" id="about"><div class="about-note"><p class="handwritten">Why we’re here</p><h2>Knowledge grows<br>when it’s <i>shared.</i></h2><p>Know & Grow began with a simple thought: useful things shouldn’t stay tucked away in someone’s notebook. This is a living collection for anyone who likes to ask why, try something new, or notice the poetry hiding in an ordinary day.</p><a href="#discover" class="line-link">Come explore ${icon('arrow')}</a></div><div class="about-photo"><span>For the lifelong<br>learners.</span></div></section>
  </main>
  <footer><a class="brand" href="#top"><span class="brand-mark">${icon('leaf')}</span><span>Know <em>&</em> Grow</span></a><p>Learn something. Make something.<br>Feel something. Pass it on.</p><div><a href="#discover">Journal</a><a href="#about">About</a><button class="text-button open-desk">Write</button></div><small>© ${new Date().getFullYear()} Know & Grow · Made thoughtfully in India</small></footer>
  <dialog id="story-dialog"><button class="dialog-close" aria-label="Close">${icon('close')}</button><div class="article-content"></div></dialog>
  <dialog id="desk-dialog"><button class="dialog-close" aria-label="Close">${icon('close')}</button><div class="desk-inner"><p class="kicker"><span></span>Your creative corner</p><h2>Writer’s <i>desk.</i></h2><p>Draft a piece and preview it in the journal. Your work stays in this browser until a publishing CMS is connected.</p><form id="story-form"><div class="field-row"><label>Kind<select name="kind"><option>Everyday wisdom</option><option>Learn better</option><option>From the kitchen</option><option>A poem</option><option>Try this</option></select></label><label>Title<input name="title" required placeholder="A title that invites curiosity"></label></div><label>Short introduction<textarea name="excerpt" required rows="2"></textarea></label><label>Your story<textarea name="body" required rows="8" placeholder="Write freely…"></textarea></label><label class="upload-field"><input name="image" type="file" accept="image/*"><span>＋ Add a cover picture</span><small>JPG, PNG or WebP · kept in this browser</small></label><div class="form-actions"><button type="button" class="secondary-button" id="save-draft">Save draft</button><button class="primary-button" type="submit">Publish preview ${icon('arrow')}</button></div></form><div class="draft-list"><h3>Saved drafts</h3><div id="drafts"></div></div></div></dialog>
  <dialog id="search-dialog"><button class="dialog-close" aria-label="Close">${icon('close')}</button><div class="search-inner"><p class="kicker"><span></span>Search the journal</p><h2>What would you like to <i>find?</i></h2><input id="search-input" type="search" placeholder="Try ‘recipe’, ‘garden’ or ‘remember’"><div id="search-results"></div></div></dialog>
  <div class="toast" role="status"></div>`
}
