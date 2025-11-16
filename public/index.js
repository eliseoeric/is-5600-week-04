const html = window.nanohtml

const offset = 0
const limit = 10
const tag = 'texture'
listPrints({offset, limit, tag})
  .then(prints => render({prints, offset, limit, tag}))

function listPrints ({offset = 0, limit = 25, tag}) {
  const endpoint = '/products'
  const qs = `?offset=${offset}&limit=${limit}&tag=${tag || ''}`
  return fetchJSON(endpoint + qs)
}

function fetchJSON (url) {
  return fetch(url).then(res => res.json())
}

function render ({prints, offset, limit, tag}) {
  document.body.innerHTML = ''
  document.body.appendChild(html`
    <article>
      <h2 class="f3 fw4 pa3 mv0">Prints</h2>
      <div>${renderButtons({offset, limit, tag})}</div>
      <div class="cf pa2">
        ${prints.map(renderPrint)}
      </div>
    </article>
  `)
}

function renderButtons ({offset, limit, tag}) {
  return html`
    <div class="flex items-center justify-center pa4">
      ${renderPrev({offset, limit, tag})}
      ${renderNext({offset, limit, tag})}
    </div>
  `

  function renderPrev ({offset, limit, tag}) {
    if (!offset) return

    offset = offset - limit
    return html`
      <a
        href="#"
        class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4"
        onclick=${() => listPrints({offset, limit, tag}).then(prints => render({prints, offset, limit, tag}))}
        >

        <span class="pl1">Previous</span>
      </a>
    `
  }

  function renderNext ({offset, limit, tag}) {
    offset = offset + limit
    return html`
    <a
      href="#"
      class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box"
      onclick=${() => listPrints({offset, limit, tag}).then(prints => render({prints, offset, limit, tag}))}>
      <span class="pr1">Next</span>
    </a>
    `
  }
}

function renderPrint (print) {
  console.log(print)
  return html`
    <div class="fl w-50 w-25-m w-20-l pa2">
      <a href="${print.links.html}" target="_blank" class="db link dim tc">
        <div style="background: url(${print.urls.thumb})" class="w-100 db outline black-10 h4 cover" alt="${print.alt_description}">
        </div>
        <dl class="mt2 f6 lh-copy">
          <dt class="clip">Title</dt>
          <dd class="ml0 black truncate w-100">
            ${print.tags.slice(0, 3).map(({title}) => title).join(', ')}
          </dd>
          <dt class="clip">Artist</dt>
          <dd class="ml0 gray truncate w-100">${print.user.first_name} ${print.user.last_name}</dd>
        </dl>
      </a>
    </div>
  `
}
const path = require('path')
const Products = require('./products')
const autoCatch = require('lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {

  const { offset = 0, limit = 25,tag } = req.query


  try {
    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag,
    }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct (req, res, next) {

  const { id } = req.params

  try {
    const product = await Products.get(id)
    if (!product) {
      // next() is a callback that will pass the request to the next available route in the stack
      return next()
    }

    return res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct (req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

module.exports =autoCatch( {
  handleRoot,
  listProducts,
  getProduct,
  createProduct
});