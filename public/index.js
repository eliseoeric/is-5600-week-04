// cSpell:ignore nanohtml XMODIFY
const html = window.nanohtml;

let offset = 0;
const limit = 10;
const tag = "abstract";

// Fetch and render products on load
listPrints({ offset, limit, tag }).then((prints) =>
  render({ prints, offset, limit, tag })
);

/**
 * Fetch list of prints (products) from the API
 * @param {object} params
 * @returns {Promise<Array>}
 */
function listPrints({ offset = 0, limit = 25, tag }) {
  const endpoint = "/products";
  const qs = `?offset=${offset}&limit=${limit}&tag=${tag || ""}`;
  return fetchJSON(endpoint + qs);
}

/**
 * Fetch JSON from given URL
 * @param {string} url
 * @returns {Promise<any>}
 */
function fetchJSON(url) {
  return fetch(url).then((res) => res.json());
}

/**
 * Render the product list
 * @param {object} props
 */
function render({ prints, offset, limit, tag }) {
  document.body.innerHTML = "";
  document.body.appendChild(html`
    <article>
      <h2 class="f3 fw4 pa3 mv0">Prints</h2>
      <div>${renderButtons({ offset, limit, tag })}</div>
      <div class="cf pa2">${prints.map(renderPrint)}</div>
    </article>
  `);
}

/**
 * Render pagination buttons
 * @param {object} props
 * @returns {any}
 */
function renderButtons({ offset, limit, tag }) {
  return html`
    <div class="flex items-center justify-center pa4">
      ${renderPrev({ offset, limit, tag })}
      ${renderNext({ offset, limit, tag })}
    </div>
  `;
}

/**
 * Render the previous page button
 */
function renderPrev({ offset, limit, tag }) {
  if (offset <= 0) return;
  const newOffset = offset - limit;

  return html`
    <a
      href="#"
      class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4"
      onclick=${() =>
        listPrints({ offset: newOffset, limit, tag }).then((prints) =>
          render({ prints, offset: newOffset, limit, tag })
        )}
    >
      <span class="pl1">Previous</span>
    </a>
  `;
}

/**
 * Render the next page button
 */
function renderNext({ offset, limit, tag }) {
  const newOffset = offset + limit;

  return html`
    <a
      href="#"
      class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box"
      onclick=${() =>
        listPrints({ offset: newOffset, limit, tag }).then((prints) =>
          render({ prints, offset: newOffset, limit, tag })
        )}
    >
      <span class="pr1">Next</span>
    </a>
  `;
}

/**
 * Render a single product card
 * @param {object} product
 * @returns {any}
 */
function renderPrint(product) {
  return html`
    <div class="fl w-50 w-25-m w-20-l pa2">
      <a href="${product.links.html}" target="_blank" class="db link dim tc">
        <div
          style="background-image: url('${product.urls.thumb}')"
          class="w-100 db outline black-10 h4 cover bg-center"
        ></div>
        <dl class="mt2 f6 lh-copy">
          <dt class="clip">Tags</dt>
          <dd class="ml0 black truncate w-100">
            ${product.tags?.slice(0, 3).map(t => t.title).join(", ") || "No tags"}
          </dd>

          <dt class="clip">Photographer</dt>
          <dd class="ml0 gray truncate w-100">
            ${product.user.first_name || ""} ${product.user.last_name || ""}
          </dd>
        </dl>
      </a>
    </div>
  `;
}