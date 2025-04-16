const offset = 0
const limit = 10
const tag = 'texture'
listPrints({offset, limit, tag})
  .then(prints => render({prints, offset, limit, tag}))

function listPrints ({offset = 0, limit = 25, tag}) {
listPrints({ offset, limit, tag })
  .then(prints => render({ prints, offset, limit, tag }))
  .catch(error => {
    console.error('Fetch error:', error)
    document.body.innerHTML = '<p style="color:red">Failed to load prints. Please try again later.</p>'
  })

function listPrints({ offset = 0, limit = 25, tag }) {
  const endpoint = '/products'
  const qs = `?offset=${offset}&limit=${limit}&tag=${tag || ''}`
  return fetchJSON(endpoint + qs)
}

function fetchJSON (url) {
  return fetch(url).then(res => res.json())
function fetchJSON(url) {
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    });
}

function render ({prints, offset, limit, tag}) {
function render({ prints, offset, limit, tag }) {
  // ✅ Fix: ensure prints is an array before mapping
  if (!Array.isArray(prints)) {
    console.error('prints is not an array:', prints)
    document.body.innerHTML = '<p style="color:red">Error loading prints.</p>'
    return
  }

  document.body.innerHTML = ''
  document.body.appendChild(html`
    <article>
      <h2 class="f3 fw4 pa3 mv0">Prints</h2>
      <div>${renderButtons({offset, limit, tag})}</div>
      <div>${renderButtons({ offset, limit, tag })}</div>
      <div class="cf pa2">
        ${prints.map(renderPrint)}
      </div>
    </article>
  `)
}

function renderButtons ({offset, limit, tag}) {
function renderButtons({ offset, limit, tag }) {
  return html`
    <div class="flex items-center justify-center pa4">
      ${renderPrev({offset, limit, tag})}
      ${renderNext({offset, limit, tag})}
      ${renderPrev({ offset, limit, tag })}
      ${renderNext({ offset, limit, tag })}
    </div>
  `

  function renderPrev ({offset, limit, tag}) {
  function renderPrev({ offset, limit, tag }) {
    if (!offset) return

    offset = offset - limit
    return html`
      <a
        href="#"
        class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4"
        onclick=${() => listPrints({offset, limit, tag}).then(prints => render({prints, offset, limit, tag}))}
        >
        onclick=${() => listPrints({ offset, limit, tag }).then(prints => render({ prints, offset, limit, tag }))}>
        <span class="pl1">Previous</span>
      </a>
    `
  }

  function renderNext ({offset, limit, tag}) {
  function renderNext({ offset, limit, tag }) {
    offset = offset + limit
    return html`
    <a
      href="#"
      class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box"
      onclick=${() => listPrints({offset, limit, tag}).then(prints => render({prints, offset, limit, tag}))}>
      <span class="pr1">Next</span>
    </a>
      <a
        href="#"
        class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box"
        onclick=${() => listPrints({ offset, limit, tag }).then(prints => render({ prints, offset, limit, tag }))}>
        <span class="pr1">Next</span>
      </a>
    `
  }
}

function renderPrint (print) {
function renderPrint(print) {
  console.log(print)
  return html`
    <div class="fl w-50 w-25-m w-20-l pa2">
@@ -76,7 +90,7 @@ function renderPrint (print) {
        <dl class="mt2 f6 lh-copy">
          <dt class="clip">Title</dt>
          <dd class="ml0 black truncate w-100">
            ${print.tags.slice(0, 3).map(({title}) => title).join(', ')}
            ${print.tags.slice(0, 3).map(({ title }) => title).join(', ')}
          </dd>
          <dt class="clip">Artist</dt>
          <dd class="ml0 gray truncate w-100">${print.user.first_name} ${print.user.last_name}</dd>
        </dl>
      </a>
    </div>
  `
}