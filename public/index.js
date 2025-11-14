// Using nanohtml library for creating HTML elements
const html = window.nanohtml

// ------------------------
// Pagination and global variables
// ------------------------
let offset = 0                 // Current page offset
const limit = 20               // Number of products per page
let allProducts = []           // Stores all products fetched from server
let filteredProducts = []      // Stores products to show (here no filter, just same as allProducts)
let totalProducts = 0          // Total number of products
let deletedProducts = []       // Keeps track of deleted products by id
let addFormVisible = false     // To show/hide Add Product form
let editFormVisible = false    // To show/hide Edit Product form
let blockOutsideClose = false  // Prevent accidental form close when clicking outside
let currentEditId = null       // Stores currently editing product id
let popupVisible = false       // To show popup for required fields
let popupMessage = ""          // Message in popup

// ------------------------
// State for New Product Form
// ------------------------
let newProductFormState = {
  name: '',
  desc: '',
  link: '',
  img: '',
  color: '',
  artist: '',
  updated: ''
}

// ------------------------
// Utility function to generate 10-char unique ID
// ------------------------
function generateId10() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

// ------------------------
// Initialize page
// ------------------------
init()
async function init() {
  // Fetch all products from backend
  allProducts = await fetch('/products?offset=0&limit=999999').then(res => res.json())
  filteredProducts = allProducts           // No filter applied here
  totalProducts = filteredProducts.length // Count total products
  loadPage(offset)                         // Load first page
}

// ------------------------
// Load products for a given offset
// ------------------------
function loadPage(offset) {
  const paginated = filteredProducts.slice(offset, offset + limit) // Slice products for current page
  render({ prints: paginated, offset, limit })                     // Render products
}

// ------------------------
// Add New Product
// ------------------------
function addNewProduct(name, description, link, imageUrl, color, artist, updatedAt) {
  // Generate unique ID
  let newId = generateId10()
  while (allProducts.some(p => String(p.id) === newId)) {
    newId = generateId10()
  }

  // Product name tag
  const nameTag = name || 'New Product'

  // Split artist into first and last name
  let first = ''
  let last = ''
  if (artist && artist.trim() !== '') {
    const parts = artist.trim().split(/\s+/)
    first = parts.shift() || ''
    last = parts.join(' ') || ''
  }

  // Create new product object
  const newProduct = {
    id: newId,
    links: { html: link || '#' },
    urls: {
      thumb: imageUrl && imageUrl.trim() !== ""
              ? imageUrl.trim()
              : "https://via.placeholder.com/300?text=New+Product"
    },
    alt_description: description || "",
    tags: [{ title: nameTag }],
    user: { first_name: first, last_name: last },
    color: color && color.trim() !== '' ? color.trim() : null,
    updated_at: updatedAt && updatedAt.trim() !== '' ? updatedAt.trim() : new Date().toISOString()
  }

  // Add new product at beginning
  allProducts.unshift(newProduct)
  filteredProducts = allProducts
  totalProducts = filteredProducts.length
  offset = 0
  loadPage(offset)

  // Reset form fields
  newProductFormState = { name:'', desc:'', link:'', img:'', color:'', artist:'', updated:'' }
}

// ------------------------
// Open Edit Form
// ------------------------
function openEditForm(productId) {
  currentEditId = productId
  editFormVisible = true

  render({ prints: filteredProducts.slice(offset, offset + limit), offset, limit })

  // Add event listener for clicking outside the form
  document.removeEventListener('click', outsideEditForm)
  setTimeout(() => document.addEventListener('click', outsideEditForm), 40)
}

// ------------------------
// Close Edit Form
// ------------------------
function closeEditForm() {
  editFormVisible = false
  currentEditId = null
  document.removeEventListener('click', outsideEditForm)
  render({ prints: filteredProducts.slice(offset, offset + limit), offset, limit })
}

// ------------------------
// Detect outside click on edit form
// ------------------------
function outsideEditForm(e) {
  if (blockOutsideClose) return
  const box = document.querySelector('.edit-form')
  if (!box) return
  if (!box.contains(e.target)) {
    editFormVisible = false
    currentEditId = null
    document.removeEventListener('click', outsideEditForm)
    render({ prints: filteredProducts.slice(offset, offset + limit), offset, limit })
  }
}

// ------------------------
// Save Edit Changes
// ------------------------
function saveEdits() {
  if (!currentEditId) return

  // Get values from inputs
  const idInput = document.getElementById('editId')
  const colorInput = document.getElementById('editColor')
  const descInput = document.getElementById('editDesc')
  const artistInput = document.getElementById('editArtist')
  const updatedInput = document.getElementById('editUpdated')
  const imgInput = document.getElementById('editImg')

  const id = idInput ? idInput.value : currentEditId
  const color = colorInput ? colorInput.value.trim() : ''
  const desc = descInput ? descInput.value.trim() : ''
  const artist = artistInput ? artistInput.value.trim() : ''
  const updatedAt = updatedInput ? updatedInput.value.trim() : ''
  const imgUrl = imgInput ? imgInput.value.trim() : ''

  // Find product index in array
  const idx = allProducts.findIndex(p => String(p.id) === String(id))
  if (idx === -1) {
    alert('Product not found in memory.')
    return
  }

  const prod = allProducts[idx]

  // Update product details
  prod.color = color !== '' ? color : null
  prod.alt_description = desc !== '' ? desc : ''
  prod.urls = prod.urls || {}
  prod.urls.thumb = imgUrl !== '' ? imgUrl : prod.urls.thumb || 'https://via.placeholder.com/300?text=New+Product'

  if (artist !== '') {
    const parts = artist.split(' ')
    prod.user = prod.user || {}
    prod.user.first_name = parts.shift() || ''
    prod.user.last_name = parts.join(' ') || ''
  } else {
    prod.user = prod.user || {}
    prod.user.first_name = ''
    prod.user.last_name = ''
  }

  prod.updated_at = updatedAt !== '' ? updatedAt : new Date().toISOString()

  // Update filteredProducts too
  const fidx = filteredProducts.findIndex(p => String(p.id) === String(id))
  if (fidx !== -1) filteredProducts[fidx] = prod

  editFormVisible = false
  currentEditId = null
  document.removeEventListener('click', outsideEditForm)
  render({ prints: filteredProducts.slice(offset, offset + limit), offset, limit })
}

// ------------------------
// Show popup for missing required fields
// ------------------------
function showRequiredPopup(message) {
  popupMessage = message
  popupVisible = true
  render({ prints: filteredProducts.slice(offset, offset+limit), offset, limit })

  // Detect outside click to close popup
  function outsidePopup(e) {
    const box = document.querySelector('.required-popup')
    if (!box.contains(e.target)) {
      popupVisible = false
      document.removeEventListener('click', outsidePopup)
      render({ prints: filteredProducts.slice(offset, offset+limit), offset, limit })
    }
  }

  setTimeout(() => document.addEventListener('click', outsidePopup), 50)
}

// ------------------------
// Render the whole UI
// ------------------------
function render({ prints, offset, limit }) {
  document.body.innerHTML = ''

  // ------------------------
  // Styles for page
  // ------------------------
  const style = document.createElement("style")
  style.innerHTML = `
    .product-card {transition: transform 0.25s ease, box-shadow 0.25s ease;border-radius: 12px;overflow: hidden;box-shadow: 0 2px 8px rgba(0,0,0,0.12); position: relative;}
    .product-card:hover {transform: scale(1.05);box-shadow: 0 6px 18px rgba(0,0,0,0.25);z-index: 10;}
    .nav-button, .add-button {transition: transform 0.2s ease, background-color 0.2s ease;border-radius: 8px;cursor: pointer;}
    .nav-button:hover, .add-button:hover {transform: scale(1.08);}
    .disabled-btn {background: white !important;color: #999 !important;opacity: 0.5;cursor: not-allowed;transform: none !important;}
    .add-form-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.45); z-index: 19;}
    .add-form {position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background:#f9f9f9; border:2px solid #ccc; padding:1rem; border-radius: 10px; box-shadow:0 4px 20px rgba(0,0,0,0.3); z-index: 20;}
    .add-close {float:right; font-size:1.6rem; cursor:pointer; font-weight:bold; color:blue; margin-top:-10px;}
    .add-input { width:100%; padding:0.4rem; margin:0.35rem 0; border:1px solid #ccc; border-radius:6px; }
    .add-submit { background:#0077cc; color:white; border:none; border-radius:6px; padding:0.5rem 1rem; cursor:pointer; width:100%; margin-top:0.6rem; }
    .add-submit:hover { background:#005fa3; }
    .edit-form { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 420px; background:#fff; border:2px solid #ccc; padding:1rem; border-radius:10px; box-shadow:0 6px 30px rgba(0,0,0,0.35); z-index: 30; }
    .edit-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.45); z-index:29; }
    .menu-wrapper { position: absolute; bottom: 5px; right: 5px; display: inline-block; }
    .menu { cursor: pointer; font-size: 18px; padding: 0 5px; transition: color 0.2s ease; }
    .menu:hover { color: #0077cc; }
    .dropdown { position: absolute; bottom: 25px; right: 0; display: none; background: white; border: 1px solid #ccc; border-radius: 4px; z-index: 10; }
    .dropdown button { display: block; padding: 5px 10px; width: 100%; border: none; background: white; cursor: pointer; text-align: left; transition: background-color 0.2s ease, color 0.2s ease; }
    .dropdown button:hover { background: red; color: white; }
    .required-popup-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.3); z-index:50; }
    .required-popup { position: fixed; top:50%; left:50%; transform: translate(-50%,-50%); background:#fff; padding:1rem 1.2rem; border-radius:8px; border:2px solid #0077cc; box-shadow:0 4px 20px rgba(0,0,0,0.4); z-index:51; width:300px; text-align:center; }
    .required-popup-close { float:right; color:#0077cc; font-weight:bold; font-size:1.4rem; cursor:pointer; }
  `
  document.head.appendChild(style)

  // ------------------------
  // Handle dropdown outside click
  // ------------------------
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown').forEach(dd => {
      if (!dd.contains(e.target) && !dd.previousElementSibling.contains(e.target)) {
        dd.style.display = 'none'
      }
    })
  })

  // ------------------------
  // Function to detect outside click on add form
  // ------------------------
  function outsideAddForm(e) {
    if (blockOutsideClose) return
    const box = document.querySelector('.add-form')
    if (box && !box.contains(e.target)) {
      addFormVisible = false
      render({ prints, offset, limit })
      document.removeEventListener('click', outsideAddForm)
    }
  }

  // ------------------------
  // Main HTML
  // ------------------------
  document.body.appendChild(html`
    <article>
      <h2 class="f3 fw4 pa3 mv0">Prints</h2>
      <div class="flex justify-between items-center pa3">
        <button class="ba pa3 pointer white bg-green hover-bg-dark-green add-button"
          onclick=${(e) => {
            e.stopPropagation()
            blockOutsideClose = true
            setTimeout(()=> blockOutsideClose=false, 200)
            addFormVisible = !addFormVisible;
            render({prints,offset,limit})
            if (addFormVisible) {
              setTimeout(() => document.addEventListener('click', outsideAddForm), 50)
            }
          }}>
          + New Product
        </button>
        <div>${renderButtons({ offset, limit })}</div>
      </div>
      <div class="cf pa2">${prints.map(renderPrint)}</div>

      ${addFormVisible ? html`
        <div>
          <div class="add-form-overlay"></div>
          <div class="add-form" onclick=${e => e.stopPropagation()}>
            <span class="add-close" onclick=${() => { addFormVisible=false; render({prints,offset,limit}) }}>×</span>
            <h3>Add New Product</h3>
            <input id="newName" class="add-input" placeholder="Product Name (required)" value="${newProductFormState.name}">
            <input id="newDesc" class="add-input" placeholder="Description (optional)" value="${newProductFormState.desc}">
            <input id="newLink" class="add-input" placeholder="Product Link (required)" value="${newProductFormState.link}">
            <input id="newImg" class="add-input" placeholder="Image URL (optional)" value="${newProductFormState.img}">
            <input id="newColor" class="add-input" placeholder="Color (hex or name) (optional)" value="${newProductFormState.color}">
            <input id="newArtist" class="add-input" placeholder="Artist (First Last) (optional)" value="${newProductFormState.artist}">
            <input id="newUpdated" class="add-input" placeholder="Updated At (ISO) (optional)" value="${newProductFormState.updated}">
            <button class="add-submit" onclick=${() => {
              newProductFormState = {
                name: document.getElementById('newName').value.trim(),
                desc: document.getElementById('newDesc').value.trim(),
                link: document.getElementById('newLink').value.trim(),
                img: document.getElementById('newImg').value.trim(),
                color: document.getElementById('newColor').value.trim(),
                artist: document.getElementById('newArtist').value.trim(),
                updated: document.getElementById('newUpdated').value.trim()
              }
              if(!newProductFormState.name){
                showRequiredPopup("Please enter product name")
                return
              }
              if(!newProductFormState.link){
                showRequiredPopup("Please enter product URL")
                return
              }
              addNewProduct(
                newProductFormState.name,
                newProductFormState.desc,
                newProductFormState.link,
                newProductFormState.img,
                newProductFormState.color,
                newProductFormState.artist,
                newProductFormState.updated
              )
              addFormVisible = false
              render({ prints: filteredProducts.slice(0, limit), offset: 0, limit })
            }}>Add Product</button>
          </div>
        </div>
      ` : null}

      ${popupVisible ? html`
        <div class="required-popup-overlay"></div>
        <div class="required-popup" onclick=${e=>e.stopPropagation()}>
          <span class="required-popup-close" onclick=${()=>{popupVisible=false; render({prints, offset, limit})}}>×</span>
          <p style="margin-top:1.2rem;">${popupMessage}</p>
        </div>
      ` : null}

      ${editFormVisible && currentEditId ? html`
        <div>
          <div class="edit-overlay"></div>
          <div class="edit-form" onclick=${e => e.stopPropagation()}>
            <span class="add-close" onclick=${() => closeEditForm()}>×</span>
            <h3>Edit Product</h3>
            ${renderEditFields(currentEditId)}
            <button class="add-submit" onclick=${() => { saveEdits() }}>Save</button>
          </div>
        </div>
      ` : null}

    </article>
  `)
}

// ------------------------
// Render Edit Form Fields
// ------------------------
function renderEditFields(productId) {
  const prod = allProducts.find(p => String(p.id) === String(productId)) || {}
  const idVal = prod.id || ''
  const colorVal = prod.color || ''
  const descVal = prod.alt_description || ''
  const artistVal = prod.user ? `${prod.user.first_name || ''} ${prod.user.last_name || ''}`.trim() : ''
  const updatedVal = prod.updated_at || ''
  const imgVal = prod.urls ? prod.urls.thumb : ''

  return html`
    <label style="font-size:0.9rem;color:#333">ID (readonly)</label>
    <input id="editId" class="add-input" value="${idVal}" readonly>
    <label style="font-size:0.9rem;color:#333">Color (hex or name)</label>
    <input id="editColor" class="add-input" value="${colorVal}">
    <label style="font-size:0.9rem;color:#333">Description</label>
    <input id="editDesc" class="add-input" value="${descVal}">
    <label style="font-size:0.9rem;color:#333">Artist (First Last)</label>
    <input id="editArtist" class="add-input" value="${artistVal}">
    <label style="font-size:0.9rem;color:#333">Updated At (ISO)</label>
    <input id="editUpdated" class="add-input" value="${updatedVal}">
    <label style="font-size:0.9rem;color:#333">Image URL</label>
    <input id="editImg" class="add-input" value="${imgVal}">
  `
}

// ------------------------
// Render pagination buttons
// ------------------------
function renderButtons({ offset, limit }) {
  const isFirstPage = offset === 0
  const isLastPage = offset + limit >= totalProducts
  return html`
    <div class="flex items-center justify-center pa4">
      ${renderPrev({ offset, limit, isFirstPage })}
      ${renderNext({ offset, limit, isLastPage })}
    </div>
  `
}

// ------------------------
// Render Previous Button
// ------------------------
function renderPrev({ offset, limit, isFirstPage }) {
  if(isFirstPage) return html`<button class="ba pa3 mr4 disabled-btn nav-button" disabled>Previous</button>`
  return html`<button class="ba pa3 mr4 pointer white bg-blue hover-bg-dark-blue nav-button"
    onclick=${()=>{offset-=limit; loadPage(offset)}}>Previous</button>`
}

// ------------------------
// Render Next Button
// ------------------------
function renderNext({ offset, limit, isLastPage }) {
  if(isLastPage) return html`<button class="ba pa3 disabled-btn nav-button" disabled>Next</button>`
  return html`<button class="ba pa3 pointer white bg-blue hover-bg-dark-blue nav-button"
    onclick=${()=>{offset+=limit; loadPage(offset)}}>Next</button>`
}

// ------------------------
// Render Single Product Card
// ------------------------
function renderPrint(print) {
  if(deletedProducts.includes(print.id)) return null
  return html`
    <div class="fl w-50 w-25-m w-20-l pa2 product-card">
      <a href="${print.links?.html || '#'}" target="_blank" class="db link dim tc">
        <div style="background: url(${print.urls?.thumb || 'https://via.placeholder.com/200'})"
             class="w-100 db outline black-10 h4 cover"></div>
        <dl class="mt2 f6 lh-copy pa2">
          <dt class="clip">Title</dt>
          <dd class="ml0 black truncate w-100">${print.tags?.length ? print.tags.slice(0,3).map(t=>t.title).join(', ') : ''}</dd>
          <dt class="clip">Artist</dt>
          <dd class="ml0 gray truncate w-100">${print.user ? `${print.user.first_name || ''} ${print.user.last_name || ''}` : ''}</dd>
        </dl>
      </a>
      <div class="menu-wrapper">
        <span class="menu" onclick=${(e) => {
          const dropdown = e.target.nextElementSibling
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'
          e.stopPropagation()
        }}>⋮</span>
        <div class="dropdown" onclick=${e => e.stopPropagation()}>
          <button onclick=${() => { deletedProducts.push(print.id); render({prints: filteredProducts.slice(offset, offset+limit), offset, limit}) }}>Delete</button>
          <button onclick=${() => openEditForm(print.id)}>Product details</button>
        </div>
      </div>
    </div>
  `
}
