// public/index.js
const html = window.nanohtml;

const offset = 0;
const limit = 12; // show a dozen per page
const tag = '';   // start with no filter
listPrints({ offset, limit, tag }).then(prints =>
  render({ prints, offset, limit, tag })
);

function listPrints({ offset = 0, limit = 25, tag }) {
  const qs = `?offset=${offset}&limit=${limit}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`;
  return fetchJSON(`/products${qs}`);
}

function fetchJSON(url) {
  return fetch(url, { cache: 'no-store' }).then(res => res.json());
}

function render({ prints, offset, limit, tag }) {
  // support either {items:[...]} or [...] shapes
  const data = Array.isArray(prints) ? prints : (prints.items || prints.products || prints.data || []);
  document.body.innerHTML = '';
  document.body.appendChild(html`
    <article>
      <h2 class="f3 fw4 pa3 mv0">Products</h2>
      <div class="pa3">${renderButtons({ offset, limit, tag })}</div>
      <div class="cf pa2">
        ${data.map(renderCard)}
      </div>
    </article>
  `);
}

function renderButtons({ offset, limit, tag }) {
  return html`
    <div class="flex items-center justify-center pa2">
      ${offset > 0 ? renderPrev({ offset, limit, tag }) : ''}
      ${renderNext({ offset, limit, tag })}
    </div>
  `;
}

function renderPrev({ offset, limit, tag }) {
  const prev = Math.max(0, offset - limit);
  return linkBtn('Previous', () =>
    listPrints({ offset: prev, limit, tag }).then(prints =>
      render({ prints, offset: prev, limit, tag })
    )
  );
}

function renderNext({ offset, limit, tag }) {
  const next = offset + limit;
  return linkBtn('Next', () =>
    listPrints({ offset: next, limit, tag }).then(prints =>
      render({ prints, offset: next, limit, tag })
    )
  );
}

function linkBtn(label, onclick) {
  return html`
    <a href="#"
       class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mh2"
       onclick=${ev => { ev.preventDefault(); onclick(); }}>
      <span>${label}</span>
    </a>
  `;
}

function renderCard(item) {
  // Try multiple common shapes from the lab data
  const title =
    item.title || item.name || item.alt_description || 'Untitled';

  const tagList = normalizeTags(item);
  const img =
    item?.urls?.thumb || item?.image?.thumb || item?.image || placeholder();

  return html`
    <div class="fl w-50 w-25-m w-20-l pa2">
      <div class="db link dim tc">
        <div style="background:url('${img}') center/cover no-repeat;"
             class="w-100 db outline black-10 h4">
        </div>
        <dl class="mt2 f6 lh-copy tl">
          <dt class="clip">Title</dt>
          <dd class="ml0 black truncate w-100">${title}</dd>

          ${tagList.length ? html`
            <dt class="clip">Tags</dt>
            <dd class="ml0 gray truncate w-100">${tagList.join(', ')}</dd>
          ` : ''}
        </dl>
      </div>
    </div>
  `;
}

function normalizeTags(item) {
  // supports: tags: [{title}], tags: ["a","b"], categories, topics
  const candidates = [
    item?.tags,
    item?.categories,
    item?.topics
  ].find(Array.isArray) || [];

  return candidates
    .map(t => typeof t === 'string' ? t : (t?.title || t?.name || ''))
    .filter(Boolean)
    .slice(0, 4);
}

function placeholder() {
  // simple white placeholder with light grid
  return `data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
      <rect width='100%' height='100%' fill='%23f7f7f7'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='sans-serif' font-size='14' fill='%23999'>No image</text>
    </svg>`;
}
